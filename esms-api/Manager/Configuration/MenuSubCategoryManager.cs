using System;
using System.Security.Claims;
using API.Layers.ContextLayer;
using API.Models;
using API.Shared;
using Microsoft.EntityFrameworkCore;

namespace API.Manager.Payroll.Setup
{
    public class MenuSubCategoryManager : IManager
    {
        private readonly AppDBContext _context;
        public MenuSubCategoryManager(AppDBContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse> GetDataAsync(ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse ();
            try {
                var _Table = await _context.MenuSubCategories.Include(x => x.MenuModule).Include(x => x.MenuCategory).Where (a =>  a.Action != Enums.Operations.D.ToString ()).OrderBy (o => o.Name).ToListAsync ();

                if (_Table == null || _Table.Count == 0) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();;
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

        public async Task<ApiResponse> GetDataByIdAsync(Guid _Id, ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse ();
            try {
                var _Table = await _context.MenuSubCategories.Include(x => x.MenuModule).Include(x => x.MenuCategory).Where (a => a.Id == _Id && a.Action != Enums.Operations.D.ToString ()).FirstOrDefaultAsync ();

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

        public async Task<ApiResponse> AddAsync(object model, ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse ();
            try {


                var _UserId = _User.Claims.FirstOrDefault(c => c.Type == Enums.Misc.UserId.ToString())?.Value.ToString();
                var _model = (MenuSubCategory) model;
                string error = "";
                bool _Code = _context.MenuSubCategories.Any(rec => rec.Code.Trim().ToLower().Equals(_model.Code.Trim().ToLower()) && rec.MenuModuleId == _model.MenuModuleId && rec.MenuCategoryId == _model.MenuCategoryId && rec.Action != Enums.Operations.D.ToString());
                bool _Alias = _context.MenuSubCategories.Any(rec => rec.Alias.Trim().ToLower().Equals(_model.Alias.Trim().ToLower()) && rec.MenuModuleId == _model.MenuModuleId && rec.MenuCategoryId == _model.MenuCategoryId && rec.Action != Enums.Operations.D.ToString());
                bool _NameExists = _context.MenuSubCategories.Any(rec => rec.Name.Trim().ToLower().Equals(_model.Name.Trim().ToLower()) && rec.MenuModuleId == _model.MenuModuleId && rec.MenuCategoryId == _model.MenuCategoryId && rec.Action != Enums.Operations.D.ToString());

                if (_Code)
                {
                    error = "Applogoies, This Code is Already Generated, Please Regenrate Code";
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString ();
                    apiResponse.message = error ;
                    return apiResponse;
                }

                if (_Alias)
                {
                    error = "Alias";
                }

                if (_NameExists)
                {
                    error = error + "Name";
                }

                if (_Alias || _NameExists )
                {
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString();
                    apiResponse.message = error + " Already Exists";
                    return apiResponse;
                }

                _model.UserIdInsert = Guid.Parse(_UserId);
                _model.InsertDate = DateTime.Now;
                _model.Action = Enums.Operations.A.ToString ();

                await _context.MenuSubCategories.AddAsync (_model);
                _context.SaveChanges ();

                //super admin assign permission
                var _superRoleId = await _context.UserRoles.Where(x => x.Role == "Super Admin").FirstOrDefaultAsync();

                var permissionTable = new UsersPermissions();
                permissionTable.Show_Permission = true;
                permissionTable.Insert_Permission = true;
                permissionTable.Update_Permission = true;
                permissionTable.Delete_Permission = true;
                permissionTable.Print_Permission = true;
                permissionTable.Check_Permission = true;
                permissionTable.Approve_Permission = true;
                permissionTable.Allow_Permission = true;
                permissionTable.RoleId = _superRoleId.Id;
                permissionTable.MenuId = _model.Id;
                permissionTable.Type = Enums.Operations.U.ToString();
                permissionTable.Active = true;
                permissionTable.Action = Enums.Operations.A.ToString();
                permissionTable.UserId = Guid.Parse(_UserId) ;
                permissionTable.UserIdInsert = Guid.Parse(_UserId) ;
                permissionTable.InsertDate = DateTime.Now;
                permissionTable.Action = Enums.Operations.A.ToString();
                permissionTable.Type = Enums.Operations.S.ToString();

                await _context.UsersPermissions.AddAsync(permissionTable);
                await _context.SaveChangesAsync();
                

                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.message = _model.Name + " has been added successfully";
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
                var _model = (MenuSubCategory) model;

                string error = "";
                bool _Code = _context.MenuSubCategories.Any(rec => rec.Code.Trim().ToLower().Equals(_model.Code.Trim().ToLower()) && rec.MenuModuleId == _model.MenuModuleId && rec.MenuCategoryId == _model.MenuCategoryId && rec.Id != _model.Id && rec.Action != Enums.Operations.D.ToString());
                bool _Alias = _context.MenuSubCategories.Any(rec => rec.Alias.Trim().ToLower().Equals(_model.Alias.Trim().ToLower()) && rec.MenuModuleId == _model.MenuModuleId && rec.MenuCategoryId == _model.MenuCategoryId && rec.Id != _model.Id && rec.Action != Enums.Operations.D.ToString());
                bool _NameExists = _context.MenuSubCategories.Any(rec => rec.Name.Trim().ToLower().Equals(_model.Name.Trim().ToLower()) && rec.MenuModuleId == _model.MenuModuleId && rec.MenuCategoryId == _model.MenuCategoryId && rec.Id != _model.Id && rec.Action != Enums.Operations.D.ToString());


                if (_Code)
                {
                    error = "Applogoies, This Code is Already Generated, Please Regenrate Code";
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString ();
                    apiResponse.message = error ;
                    return apiResponse;
                }

                if (_Alias)
                {
                    error = "Alias";
                }

                if (_NameExists)
                {
                    error = error + "Name";
                }

                if (_Alias || _NameExists )
                {
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString();
                    apiResponse.message = error + " Already Exists";
                    return apiResponse;
                }

                if (_NameExists) {
                    apiResponse.statusCode = StatusCodes.Status409Conflict.ToString ();
                    apiResponse.message = error + " already exist";
                    return apiResponse;
                }

                var result = _context.MenuSubCategories.Where (a => a.Id == _model.Id && a.Action != Enums.Operations.D.ToString ()).FirstOrDefault ();
                if (result == null) {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                    apiResponse.message = "Record not found ";
                    return apiResponse;
                }


                result.Code = _model.Code;
                result.Name = _model.Name;
                result.MenuModuleId = _model.MenuModuleId;
                result.MenuCategoryId = _model.MenuCategoryId;
                //result.CompanyId = _model.CompanyId;
                result.Alias = _model.Alias;
                result.Icon = _model.Icon;
                result.View = _model.View;
                result.Type = _model.Type;
                result.Active = _model.Active;
                result.UserIdUpdate = Guid.Parse(_UserId );
                result.Action = Enums.Operations.E.ToString ();
                result.UpdateDate = DateTime.Now;

                await _context.SaveChangesAsync ();




                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.message = result.Name + " has been updated successfully";
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
                var result = _context.MenuSubCategories.Where (a => a.Id == _Id && a.Action != Enums.Operations.D.ToString ()).FirstOrDefault ();
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
                apiResponse.message =  result.Name + " has been deleted successfully" ;
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