using System;
using System.Security.Claims;
using API.Layers.ContextLayer;
using API.Model.Payroll; // Assuming this is where your Teacher entity is defined
using API.Models; // Assuming ApiResponse, TeacherBaseModel, TeacherAddModel, TeacherUpdateModel are here
using API.Shared; // Assuming Enums and StatusCodes are here
using API.Views.Payroll; // Assuming TeacherAddModel, TeacherUpdateModel are here
using Microsoft.EntityFrameworkCore;

namespace API.Manager.Payroll
{
    public class TeacherManager : IManager
    {
        private readonly AppDBContext _context;

        public TeacherManager(AppDBContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse> GetDataAsync(ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse();
            try
            {
                var _Table = await _context.Teachers
                    .Where(a => a.Action != Enums.Operations.D.ToString())
                    .OrderBy(o => o.FullName)
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
                var _Table = await _context.Teachers
                    .Where(a => a.TeacherId == _Id && a.Action != Enums.Operations.D.ToString()).FirstOrDefaultAsync();
                // Console.WriteLine("table data" + _Table.TeacherId); // Consider removing or using proper logging

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
                var _UserId = _User.Claims.FirstOrDefault(c => c.Type == Enums.Misc.UserId.ToString())?.Value;

                var addModel = model as TeacherAddModel; // Cast to specific AddModel
                if (addModel == null)
                {
                    apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                    apiResponse.message = "Invalid Class: Expected TeacherAddModel.";
                    return apiResponse;
                }

                if (!Guid.TryParse(_UserId, out Guid parsedUserId))
                {
                    apiResponse.statusCode = StatusCodes.Status400BadRequest.ToString();
                    apiResponse.message = "Invalid User ID";
                    return apiResponse;
                }

                bool emailExists = await _context.Teachers.AnyAsync(t =>
                    t.Email.Trim().ToLower() == addModel.Email.Trim().ToLower() &&
                    t.Action != Enums.Operations.D.ToString());

                if (emailExists)
                {
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString();
                    apiResponse.message = "Email already exists.";
                    return apiResponse;
                }

                bool cnicExists = await _context.Teachers.AnyAsync(t =>
                    t.Cnic.Trim() == addModel.Cnic.Trim() &&
                    t.Action != Enums.Operations.D.ToString());

                if (cnicExists)
                {
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString();
                    apiResponse.message = "CNIC already exists.";
                    return apiResponse;
                }

                var teacher = new Teacher
                {
                    TeacherId = Guid.NewGuid(),
                    FullName = addModel.FullName,
                    Code = addModel.Code, // Assuming Code is passed from frontend or generated earlier in Processor
                    Email = addModel.Email,
                    Phone = addModel.Phone,
                    Cnic = addModel.Cnic,
                    Gender = addModel.Gender,
                    DateOfBirth = addModel.DateOfBirth,
                    JoiningDate = addModel.JoiningDate,
                    Active = addModel.Active,
                    EmploymentStatus = addModel.EmploymentStatus,
                    ExitDate = addModel.ExitDate,
                    ExitReason = addModel.ExitReason,
                    // Handle Picture: Use provided URL or a default if null/empty
                    Picture = string.IsNullOrWhiteSpace(addModel.Picture) ? "/img/images/profile.jpg" : addModel.Picture,
                    CreatedBy = parsedUserId,
                    CreatedAt = DateTime.Now,
                    Action = Enums.Operations.A.ToString()
                };

                await _context.Teachers.AddAsync(teacher);
                await _context.SaveChangesAsync();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.message = "Teacher added successfully: " + teacher.FullName;
                return apiResponse;
            }
            catch (DbUpdateException dbEx)
            {
                string innerexp = dbEx.InnerException == null ? dbEx.Message : dbEx.Message + " Inner Error: " + dbEx.InnerException.ToString();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = innerexp;
                return apiResponse;
            }
            catch (Exception ex)
            {
                string innerexp = ex.InnerException == null ? ex.Message : ex.Message + " Inner Error: " + ex.InnerException.ToString();
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

                var updateModel = model as TeacherUpdateModel; // Cast to specific UpdateModel
                if (updateModel == null)
                {
                    apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                    apiResponse.message = "Invalid Class: Expected TeacherUpdateModel.";
                    return apiResponse;
                }

                bool emailExists = _context.Teachers.Any(t => t.Email == updateModel.Email && t.TeacherId != updateModel.TeacherId && t.Action != Enums.Operations.D.ToString());
                bool cnicExists = _context.Teachers.Any(t => t.Cnic == updateModel.Cnic && t.TeacherId != updateModel.TeacherId && t.Action != Enums.Operations.D.ToString());

                if (emailExists)
                {
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString();
                    apiResponse.message = "Email already exists.";
                    return apiResponse;
                }

                if (cnicExists)
                {
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString();
                    apiResponse.message = "CNIC already exists.";
                    return apiResponse;
                }

                var result = await _context.Teachers.FirstOrDefaultAsync(t => t.TeacherId == updateModel.TeacherId && t.Action != Enums.Operations.D.ToString());
                if (result == null)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "Record not found.";
                    return apiResponse;
                }

                // Update values from the updateModel DTO
                result.FullName = updateModel.FullName;
                result.Code = updateModel.Code; // Ensure Code is updated
                result.Email = updateModel.Email;
                result.Phone = updateModel.Phone;
                result.Cnic = updateModel.Cnic;
                result.Gender = updateModel.Gender;
                result.DateOfBirth = updateModel.DateOfBirth;
                result.JoiningDate = updateModel.JoiningDate;
                result.EmploymentStatus = updateModel.EmploymentStatus;
                result.ExitDate = updateModel.ExitDate;
                result.ExitReason = updateModel.ExitReason;
                // Handle Picture: Use provided URL or a default if null/empty
                result.Picture = string.IsNullOrWhiteSpace(updateModel.Picture) ? "/img/images/profile.jpg" : updateModel.Picture;
                result.Active = updateModel.Active;

                if (Guid.TryParse(_UserId, out Guid parsedUserId))
                {
                    result.UpdatedBy = parsedUserId;
                }
               
                result.UpdatedAt = DateTime.Now;
                result.Action = Enums.Operations.E.ToString();

                await _context.SaveChangesAsync();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.message = "Record updated successfully: " + result.FullName;
                return apiResponse;
            }
            catch (DbUpdateException _exceptionDb)
            {
                string innerexp = _exceptionDb.InnerException == null ? _exceptionDb.Message : _exceptionDb.Message + " Inner Error: " + _exceptionDb.InnerException.ToString();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = innerexp;
                return apiResponse;
            }
            catch (Exception e)
            {
                string innerexp = e.InnerException == null ? e.Message : e.Message + " Inner Error: " + e.InnerException.ToString();
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

                var result = await _context.Teachers
                    .Where(t => t.TeacherId == _Id && t.Action != Enums.Operations.D.ToString())
                    .FirstOrDefaultAsync();

                if (result == null)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "Teacher record not found.";
                    return apiResponse;
                }

                if (Guid.TryParse(_UserId, out Guid parsedUserId))
                {
                    result.DeletedBy = parsedUserId;
                }
               
                result.Action = Enums.Operations.D.ToString();
                result.DeletedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.message = "Teacher deleted: " + result.FullName;
                return apiResponse;
            }
            catch (DbUpdateException _exceptionDb)
            {
                string innerexp = _exceptionDb.InnerException == null ? _exceptionDb.Message : _exceptionDb.Message + " Inner Error: " + _exceptionDb.InnerException.ToString();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = innerexp;
                return apiResponse;
            }
            catch (Exception e)
            {
                string innerexp = e.InnerException == null ? e.Message : e.Message + " Inner Error: " + e.InnerException.ToString();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = innerexp;
                return apiResponse;
            }
        }
    }
}
