using API.Layers.ContextLayer;
using API.Migrations;
using API.Models;
using API.Shared;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;

namespace API.Manager.Payroll.Setup
{
    public class ClassroomManager : IManager
    {
        private readonly AppDBContext _context;
        public ClassroomManager(AppDBContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse> GetDataAsync(ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse();
            try
            {
                var _Table = await _context.Classrooms
                    .Where(a => a.DeletedAt == null)
                    .OrderBy(o => o.RoomNumber)
                    .ToListAsync();

                if (_Table == null || _Table.Count == 0)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "No classrooms found";
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
                var _Table = await _context.Classrooms
                    .Where(a => a.Id == _Id && a.DeletedAt == null)
                    .FirstOrDefaultAsync();

                if (_Table == null)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "Classroom not found";
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
                var _model = (Classroom)model;
                string error = "";
                bool _Code = _context.Classrooms.Any(rec => rec.Code.Trim().ToLower().Equals(_model.Code.Trim().ToLower()) && rec.Action != Enums.Operations.D.ToString());

                if (_Code)
                {
                    error = "Applogoies, This Code is Already Generated, Please Regenrate Code";
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString();
                    apiResponse.message = error;
                    return apiResponse;
                }

                _model.CreatedBy = Guid.Parse(_UserId);
                _model.CreatedAt = DateTime.Now;
                _model.Action = Enums.Operations.A.ToString();

                await _context.Classrooms.AddAsync(_model);
                _context.SaveChanges();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.message = "Record Saved";
                return apiResponse;

            }
            catch (DbUpdateException _exceptionDb)
            {

                string innerexp = _exceptionDb.InnerException == null ? _exceptionDb.Message : _exceptionDb.Message + " Inner Error : " + _exceptionDb.InnerException.ToString();
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
                var _model = (Classroom)model;
                string error = "";

                bool _RoomNumberExists = _context.Classrooms.Any(rec =>
                    rec.RoomNumber.Trim().ToLower().Equals(_model.RoomNumber.Trim().ToLower()) &&
                    rec.Id != _model.Id &&
                    rec.Action != Enums.Operations.D.ToString());

                if (_RoomNumberExists)
                {
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString();
                    apiResponse.message = "room number Already Exists";
                    return apiResponse;
                }

                var result = _context.Classrooms
                    .Where(a => a.Id == _model.Id && a.Action != Enums.Operations.D.ToString())
                    .FirstOrDefault();

                if (result == null)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "Room not found";
                    return apiResponse;
                }

                result.RoomNumber = _model.RoomNumber;
                result.RoomType = _model.RoomType;
                result.Capacity = _model.Capacity;
                result.Location = _model.Location;
                result.Active = _model.Active;
                result.UpdatedBy = Guid.Parse(_UserId);
                result.Action = Enums.Operations.E.ToString();
                result.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.message = "Course Updated: " + result.RoomNumber;
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
                var result = await _context.Classrooms
                    .Where(a => a.Id == _Id && a.DeletedAt == null)
                    .FirstOrDefaultAsync();

                if (result == null)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "Classroom not found";
                    return apiResponse;
                }

                result.DeletedBy = Guid.Parse(_UserId);
                result.Action = Enums.Operations.D.ToString();
                result.DeletedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.message = $"Classroom {result.RoomNumber} deleted successfully";
                return apiResponse;
            }
            catch (DbUpdateException _exceptionDb)
            {
                string innerexp = _exceptionDb.InnerException == null ? _exceptionDb.Message : _exceptionDb.Message + " Inner Error : " + _exceptionDb.InnerException.ToString();
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