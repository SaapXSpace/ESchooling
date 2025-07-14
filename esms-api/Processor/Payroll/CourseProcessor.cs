using API.Layers.ContextLayer;
using API.Manager;
using API.Models;
using Microsoft.EntityFrameworkCore;
using API.Shared;
using API.Views.Shared;
using System.Security.Claims;

namespace API.Processor.Admin
{
    public class CourseProcessor : IProcessor<CourseBaseModel>
    {
        private AppDBContext _context;
        private IManager? _manager;

        public CourseProcessor(AppDBContext context)
        {
            _context = context;
            _manager = Builder.MakeManagerClass(Enums.ModuleClassName.Course, _context);
        }

        public async Task<ApiResponse> ProcessGet(Guid MenuId, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();
            if (_manager != null)
            {
                var response = await _manager.GetDataAsync(_User);
                var _Table = response.data as IEnumerable<Course>;
                var apiResponseUser = await SecurityHelper.UserMenuPermissionAsync(MenuId, _User);

                if (apiResponseUser.statusCode.ToString() != StatusCodes.Status200OK.ToString())
                {
                    return apiResponseUser;
                }

                var _UserMenuPermissionAsync = (GetUserPermissionViewModel)apiResponseUser.data;

                if (Convert.ToInt32(response.statusCode) == 200)
                {
                    var result = (from ViewTable in _Table
                                  select new CourseViewModel
                                  {
                                      CourseId = ViewTable.CourseId,
                                      Code = ViewTable.Code,
                                      CourseName = ViewTable.CourseName,
                                      Description = ViewTable.Description,
                                      Credits = ViewTable.Credits,
                                      Active = ViewTable.Active
                                  }).ToList();
                    response.data = result;
                }
                response.Permissions = _UserMenuPermissionAsync;
                return response;
            }

            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessGetById(Guid _Id, Guid _MenuId, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();
            if (_manager != null)
            {
                var response = await _manager.GetDataByIdAsync(_Id, _User);

                if (Convert.ToInt32(response.statusCode) == 200)
                {
                    var _Table = response.data as Course;
                    var _ViewModel = new CourseViewByIdModel
                    {
                        CourseId = _Table.CourseId,
                        Code = _Table.Code,
                        CourseName = _Table.CourseName,
                        Description = _Table.Description,
                        Credits = _Table.Credits,
                        Active = _Table.Active
                    };
                    response.data = _ViewModel;
                }
                return response;
            }

            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }
        public async Task<ApiResponse> ProcessPost(object _Course, ClaimsPrincipal _User)
        {
            var Course = (CourseAddModel)_Course;
            var apiResponse = new ApiResponse();

            try
            {
                // Check if course name already exists
                bool _NameExists = await _context.Courses.AnyAsync(rec =>
                    rec.CourseName.Trim().ToLower().Equals(Course.CourseName.Trim().ToLower()) &&
                    rec.Action != Enums.Operations.D.ToString());

                if (_NameExists)
                {
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString();
                    apiResponse.message = "Course Name Already Exists";
                    return apiResponse;
                }

                // Get all codes and parse the numeric part in memory
                var allCodes = await _context.Courses
                    .Where(c => c.Action != Enums.Operations.D.ToString() && c.Code.StartsWith("CRS-"))
                    .Select(c => c.Code)
                    .ToListAsync();

                int lastCodeNumber = 0;
                if (allCodes.Any())
                {
                    lastCodeNumber = allCodes
                        .Select(c => int.TryParse(c.Substring(4), out var num) ? num : 0)
                        .Max();
                }

                string newCode = $"CRS-{(lastCodeNumber + 1):D4}";

                var _Table = new Course
                {
                    CourseName = Course.CourseName,
                    Code = newCode,
                    Description = Course.Description,
                    Credits = Course.Credits,
                    Active = Course.Active,
                    CreatedBy = Guid.Parse(_User.Claims.FirstOrDefault(c => c.Type == Enums.Misc.UserId.ToString())?.Value),
                    CreatedAt = DateTime.Now,
                    Action = Enums.Operations.A.ToString()
                };

                await _context.Courses.AddAsync(_Table);
                await _context.SaveChangesAsync();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.message = "Course saved successfully";
                apiResponse.data = new { Code = _Table.Code };
                return apiResponse;
            }
            catch (Exception ex)
            {
                apiResponse.statusCode = StatusCodes.Status500InternalServerError.ToString();
                apiResponse.message = $"Error saving course: {ex.Message}";
                return apiResponse;
            }
        }

        public async Task<ApiResponse> ProcessPut(object _Course, ClaimsPrincipal _User)
        {
            var Course = (CourseUpdateModel)_Course;
            var apiResponse = new ApiResponse();

            try
            {
                var existingCourse = await _context.Courses
                    .FirstOrDefaultAsync(c => c.CourseId == Course.CourseId &&
                                             c.Action != Enums.Operations.D.ToString());

                if (existingCourse == null)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "Course not found";
                    return apiResponse;
                }

                // Check if new name conflicts with other courses
                bool _NameExists = await _context.Courses.AnyAsync(rec =>
                    rec.CourseId != Course.CourseId &&
                    rec.CourseName.Trim().ToLower().Equals(Course.CourseName.Trim().ToLower()) &&
                    rec.Action != Enums.Operations.D.ToString());

                if (_NameExists)
                {
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString();
                    apiResponse.message = "Course Name Already Exists";
                    return apiResponse;
                }

                // Update course properties (Code remains unchanged)
                existingCourse.CourseName = Course.CourseName;
                existingCourse.Description = Course.Description;
                existingCourse.Credits = Course.Credits;
                existingCourse.Active = Course.Active;
                existingCourse.UpdatedBy = Guid.Parse(_User.Claims.FirstOrDefault(c => c.Type == Enums.Misc.UserId.ToString())?.Value);
                existingCourse.UpdatedAt = DateTime.Now;
                existingCourse.Action = Enums.Operations.E.ToString();

                await _context.SaveChangesAsync();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.message = "Course updated successfully";
                return apiResponse;
            }
            catch (Exception ex)
            {
                apiResponse.statusCode = StatusCodes.Status500InternalServerError.ToString();
                apiResponse.message = $"Error updating course: {ex.Message}";
                return apiResponse;
            }
        }

        public async Task<ApiResponse> ProcessDelete(Guid _Id, ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse();

            try
            {
                var course = await _context.Courses
                    .FirstOrDefaultAsync(c => c.CourseId == _Id &&
                                             c.Action != Enums.Operations.D.ToString());

                if (course == null)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "Course not found";
                    return apiResponse;
                }

                course.Action = Enums.Operations.D.ToString();
                course.DeletedBy = Guid.Parse(_User.Claims.FirstOrDefault(c => c.Type == Enums.Misc.UserId.ToString())?.Value);
                course.DeletedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.message = "Course deleted successfully";
                return apiResponse;
            }
            catch (Exception ex)
            {
                apiResponse.statusCode = StatusCodes.Status500InternalServerError.ToString();
                apiResponse.message = $"Error deleting course: {ex.Message}";
                return apiResponse;
            }
        }
    }
}