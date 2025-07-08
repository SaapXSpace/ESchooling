using System;
using System.Security.Claims;
using API.Layers.ContextLayer;
using API.Model.Payroll;
using API.Models;
using API.Shared;
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
                var _model = (Teacher)model;

                string error = "";
                bool emailExists = _context.Teachers.Any(t => t.Email.Trim().ToLower() == _model.Email.Trim().ToLower() && t.Action != Enums.Operations.D.ToString());
                bool cnicExists = _context.Teachers.Any(t => t.CNIC.Trim() == _model.CNIC.Trim() && t.Action != Enums.Operations.D.ToString());

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

                _model.CreatedBy = Guid.Parse(_UserId);
                _model.CreatedAt = DateTime.Now;
                _model.Action = Enums.Operations.A.ToString(); 

                await _context.Teachers.AddAsync(_model);
                _context.SaveChanges();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.message = "Teacher added successfully: " + _model.FullName;
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

        public async Task<ApiResponse> UpdateAsync(object model, ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse();
            try
            {
                var _UserId = _User.Claims.FirstOrDefault(c => c.Type == Enums.Misc.UserId.ToString())?.Value.ToString();
                var _model = (Teacher)model;

                bool emailExists = _context.Teachers.Any(t => t.Email == _model.Email && t.TeacherId != _model.TeacherId && t.Action != Enums.Operations.D.ToString());
                bool cnicExists = _context.Teachers.Any(t => t.CNIC == _model.CNIC && t.TeacherId != _model.TeacherId && t.Action != Enums.Operations.D.ToString());

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

                var result = _context.Teachers.FirstOrDefault(t => t.TeacherId == _model.TeacherId && t.Action != Enums.Operations.D.ToString());
                if (result == null)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "Record not found.";
                    return apiResponse;
                }

                // Update values
                result.FullName = _model.FullName;
                result.Email = _model.Email;
                result.Phone = _model.Phone;
                result.CNIC = _model.CNIC;
                result.Gender = _model.Gender;
                result.DateOfBirth = _model.DateOfBirth;
                result.JoiningDate = _model.JoiningDate;
                result.EmploymentStatus = _model.EmploymentStatus;
                result.ExitDate = _model.ExitDate;
                result.ExitReason = _model.ExitReason;
                result.Picture = _model.Picture;
                result.Active = _model.Active;

                result.UpdatedBy = Guid.Parse(_UserId);
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

                var result = _context.Teachers
                    .Where(t => t.TeacherId == _Id && t.Action != Enums.Operations.D.ToString())
                    .FirstOrDefault();

                if (result == null)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "Teacher record not found.";
                    return apiResponse;
                }

                result.DeletedBy = Guid.Parse(_UserId);
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
