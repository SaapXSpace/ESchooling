using System;
using System.Security.Claims;
using API.Layers.ContextLayer;
using API.Models;
using API.Shared;
using Microsoft.EntityFrameworkCore;

namespace API.Manager.Payroll.Setup
{
    public class CourseManager : IManager
    {
        private readonly AppDBContext _context;

        public CourseManager(AppDBContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse> GetDataAsync(ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse();
            try
            {
                var _Table = await _context.Courses
                    .Where(a => a.Action != Enums.Operations.D.ToString())
                    .OrderBy(o => o.CourseName)
                    .ToListAsync();

                if (_Table == null || _Table.Count == 0)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "Record Not Found";
                    return apiResponse;
                }

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.data = _Table;
                return apiResponse;
            }
            catch (Exception e)
            {
                string innerexp = e.InnerException == null ? e.Message : e.Message + " Inner Error : " + e.InnerException.ToString();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = innerexp;
                return apiResponse;
            }
        }

        public async Task<ApiResponse> GetDataByIdAsync(Guid _Id, ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse();
            try
            {
                var _Table = await _context.Courses
                    .Where(a => a.CourseId == _Id && a.Action != Enums.Operations.D.ToString())
                    .FirstOrDefaultAsync();

                if (_Table == null)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.data = _Table;
                return apiResponse;
            }
            catch (Exception e)
            {
                string innerexp = e.InnerException == null ? e.Message : e.Message + " Inner Error : " + e.InnerException.ToString();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = innerexp;
                return apiResponse;
            }
        }

        public async Task<ApiResponse> AddAsync(object model, ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse();
            try
            {
                var _UserId = _User.Claims.FirstOrDefault(c => c.Type == Enums.Misc.UserId.ToString())?.Value.ToString();
                var _model = (Course)model;
                string error = "";

                bool _NameExists = _context.Courses.Any(rec =>
                    rec.CourseName.Trim().ToLower().Equals(_model.CourseName.Trim().ToLower()) &&
                    rec.Action != Enums.Operations.D.ToString());

                if (_NameExists)
                {
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString();
                    apiResponse.message = "Course Name Already Exists";
                    return apiResponse;
                }

                _model.CreatedBy = Guid.Parse(_UserId);
                _model.CreatedAt = DateTime.Now;
                _model.Action = Enums.Operations.A.ToString();

                await _context.Courses.AddAsync(_model);
                _context.SaveChanges();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.message = "Course Saved: " + _model.CourseName;
                return apiResponse;
            }
            catch (DbUpdateException _exceptionDb)
            {
                string innerexp = _exceptionDb.InnerException == null ? _exceptionDb.Message :
                    _exceptionDb.Message + " Inner Error : " + _exceptionDb.InnerException.ToString();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = innerexp;
                return apiResponse;
            }
            catch (Exception e)
            {
                string innerexp = e.InnerException == null ? e.Message : e.Message + " Inner Error : " + e.InnerException.ToString();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = innerexp;
                return apiResponse;
            }
        }

        public async Task<ApiResponse> UpdateAsync(object model, ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse();
            try
            {
                var _UserId = _User.Claims.FirstOrDefault(c => c.Type == Enums.Misc.UserId.ToString())?.Value.ToString();
                var _model = (Course)model;
                string error = "";

                bool _NameExists = _context.Courses.Any(rec =>
                    rec.CourseName.Trim().ToLower().Equals(_model.CourseName.Trim().ToLower()) &&
                    rec.CourseId != _model.CourseId &&
                    rec.Action != Enums.Operations.D.ToString());

                if (_NameExists)
                {
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString();
                    apiResponse.message = "Course Name Already Exists";
                    return apiResponse;
                }

                var result = _context.Courses
                    .Where(a => a.CourseId == _model.CourseId && a.Action != Enums.Operations.D.ToString())
                    .FirstOrDefault();

                if (result == null)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "Course not found";
                    return apiResponse;
                }

                result.CourseName = _model.CourseName;
                result.Description = _model.Description;
                result.Credits = _model.Credits;
                result.Active = _model.Active;
                result.UpdatedBy = Guid.Parse(_UserId);
                result.Action = Enums.Operations.E.ToString();
                result.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.message = "Course Updated: " + result.CourseName;
                return apiResponse;
            }
            catch (DbUpdateException _exceptionDb)
            {
                string innerexp = _exceptionDb.InnerException == null ? _exceptionDb.Message :
                    _exceptionDb.Message + " Inner Error : " + _exceptionDb.InnerException.ToString();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = innerexp;
                return apiResponse;
            }
            catch (Exception e)
            {
                string innerexp = e.InnerException == null ? e.Message : e.Message + " Inner Error : " + e.InnerException.ToString();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = innerexp;
                return apiResponse;
            }
        }

        public async Task<ApiResponse> DeleteAsync(Guid _Id, ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse();
            try
            {
                var _UserId = _User.Claims.FirstOrDefault(c => c.Type == Enums.Misc.UserId.ToString())?.Value.ToString();
                var result = _context.Courses
                    .Where(a => a.CourseId == _Id && a.Action != Enums.Operations.D.ToString())
                    .FirstOrDefault();

                if (result == null)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "Course not found";
                    return apiResponse;
                }

                result.DeletedBy = Guid.Parse(_UserId);
                result.Action = Enums.Operations.D.ToString();
                result.DeletedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.message = "Course Deleted: " + result.CourseName;
                return apiResponse;
            }
            catch (DbUpdateException _exceptionDb)
            {
                string innerexp = _exceptionDb.InnerException == null ? _exceptionDb.Message :
                    _exceptionDb.Message + " Inner Error : " + _exceptionDb.InnerException.ToString();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = innerexp;
                return apiResponse;
            }
            catch (Exception e)
            {
                string innerexp = e.InnerException == null ? e.Message : e.Message + " Inner Error : " + e.InnerException.ToString();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = innerexp;
                return apiResponse;
            }
        }
    }
}