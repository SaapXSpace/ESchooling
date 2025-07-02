using System;
using System.Security.Claims;
using API.Layers.ContextLayer;
using API.Models;
using API.Shared;
using Microsoft.EntityFrameworkCore;

namespace API.Manager.Payroll.Setup
{
    public class UserRoleManager : IManager
    {
        private readonly AppDBContext _context;
        public UserRoleManager(AppDBContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse> GetDataAsync( ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse ();
            try {
                var _Table = await _context.UserRoles.Where (a => a.Action != Enums.Operations.D.ToString ()).OrderBy (o => o.Role).ToListAsync ();

                if (_Table == null || _Table.Count == 0) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();;
                    apiResponse.message = "Record Not Found";
                    return apiResponse;
                }

                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.data = _Table;
                return apiResponse;
            }
            catch (Exception e) {
                string innerexp = e.InnerException == null? e.Message : e.Message + " Inner Error : " + e.InnerException.ToString ();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = innerexp;
                return apiResponse;
            }
        }
        public async Task<ApiResponse> GetDataByIdAsync(Guid _Id,  ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse ();
            try {
                var _Table = await _context.UserRoles.Where (a => a.Id == _Id && a.Action != Enums.Operations.D.ToString ()).FirstOrDefaultAsync ();

                if (_Table == null ) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }
                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.data = _Table;
                return apiResponse;
            } 
            catch (Exception e) {
                string innerexp = e.InnerException == null? e.Message : e.Message + " Inner Error : " + e.InnerException.ToString ();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = innerexp;
                return apiResponse;
            }
        }

        public async Task<ApiResponse> AddAsync(object model,  ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse ();
            try {

                var _UserId = _User.Claims.FirstOrDefault(c => c.Type == Enums.Misc.UserId.ToString())?.Value.ToString();
                var _model = (UserRole) model;
                string error = "";
                bool _NameExists = _context.UserRoles.Any (rec => rec.Code.Trim ().ToLower ().Equals (_model.Code.Trim ().ToLower ()) && rec.Action != Enums.Operations.D.ToString ());
                bool _Code = _context.UserRoles.Any (rec => rec.Role.Trim ().ToLower ().Equals (_model.Role.Trim ().ToLower ()) && rec.Action != Enums.Operations.D.ToString ());
                
                if (_Code)
                {
                    error = "Applogoies, This Code is Already Generated, Please Regenrate Code";
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString ();
                    apiResponse.message = error ;
                    return apiResponse;
                }

                if (_NameExists) {
                    error = error + "Name";
                }

                if (_NameExists) {
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString ();
                    apiResponse.message = error + " Already Exist";
                    return apiResponse;
                }

                _model.UserIdInsert = Guid.Parse(_UserId);
                _model.InsertDate = DateTime.Now;
                _model.Action = Enums.Operations.A.ToString ();

                await _context.UserRoles.AddAsync (_model);
                _context.SaveChanges ();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.message = "Record Save : " + _model.Role;
                return apiResponse;

            } catch (DbUpdateException _exceptionDb) {

                string innerexp = _exceptionDb.InnerException == null? _exceptionDb.Message : _exceptionDb.Message + " Inner Error : " + _exceptionDb.InnerException.ToString ();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = innerexp;
                return apiResponse;

            } catch (Exception e) {

                string innerexp = e.InnerException == null? e.Message : e.Message + " Inner Error : " + e.InnerException.ToString ();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = innerexp;
                return apiResponse;
            }
        }
        

        public async Task<ApiResponse> UpdateAsync(object model,  ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse ();
            try {
                var _UserId = _User.Claims.FirstOrDefault(c => c.Type == Enums.Misc.UserId.ToString())?.Value.ToString();
                var _model = (UserRole) model;
                string error = "";
                bool _Code = _context.UserRoles.Any (rec => rec.Code.Trim ().ToLower ().Equals (_model.Code.Trim ().ToLower ()) && rec.Id !=_model.Id && rec.Action != Enums.Operations.D.ToString ());
                bool _NameExists = _context.UserRoles.Any (rec => rec.Role.Trim ().ToLower ().Equals (_model.Role.Trim ().ToLower ()) && rec.Id !=_model.Id && rec.Action != Enums.Operations.D.ToString ());
                
                if (_Code)
                {
                    error = "Applogoies, This Code is Already Generated, Please Regenrate Code";
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString ();
                    apiResponse.message = error ;
                    return apiResponse;
                }

                if (_NameExists) {
                    error = error + "Name";
                }

                if (_NameExists) {
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString ();
                    apiResponse.message = error + " Already Exist";
                    return apiResponse;
                }

                var result = _context.UserRoles.Where (a => a.Id == _model.Id && a.Action != Enums.Operations.D.ToString ()).FirstOrDefault ();
                if (result == null) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found ";
                    return apiResponse;
                }


                result.Code = _model.Code;
                result.Role = _model.Role;
                result.Active = _model.Active;
                result.Type = _model.Type;
                result.UserIdUpdate = Guid.Parse(_UserId);
                result.Action = Enums.Operations.E.ToString ();
                result.UpdateDate = DateTime.Now;

                await _context.SaveChangesAsync ();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.message = "Record Update : " + result.Role;
                return apiResponse;

            } catch (DbUpdateException _exceptionDb) {

                string innerexp = _exceptionDb.InnerException == null? _exceptionDb.Message : _exceptionDb.Message + " Inner Error : " + _exceptionDb.InnerException.ToString ();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = innerexp;
                return apiResponse;

            } catch (Exception e) {

                string innerexp = e.InnerException == null? e.Message : e.Message + " Inner Error : " + e.InnerException.ToString ();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = innerexp;
                return apiResponse;
            }
        }

        public async Task<ApiResponse> DeleteAsync(Guid _Id,  ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse ();
            try {

                var _UserId = _User.Claims.FirstOrDefault(c => c.Type == Enums.Misc.UserId.ToString())?.Value.ToString();
                var result = _context.UserRoles.Where (a => a.Id == _Id && a.Action != Enums.Operations.D.ToString ()).FirstOrDefault ();
                if (result == null) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found ";
                    return apiResponse;
                }

                result.UserIdDelete = Guid.Parse(_UserId);
                result.Action = Enums.Operations.D.ToString ();
                result.DeleteDate = DateTime.Now;

                await _context.SaveChangesAsync ();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.message = "Record Deleted : " + result.Role;
                return apiResponse;

            } catch (DbUpdateException _exceptionDb) {

                string innerexp = _exceptionDb.InnerException == null? _exceptionDb.Message : _exceptionDb.Message + " Inner Error : " + _exceptionDb.InnerException.ToString ();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = innerexp;
                return apiResponse;

            } catch (Exception e) {

                string innerexp = e.InnerException == null? e.Message : e.Message + " Inner Error : " + e.InnerException.ToString ();
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = innerexp;
                return apiResponse;
            }
        }

       

        
    }
}