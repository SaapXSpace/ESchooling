using API.Layers.ContextLayer;
using API.Manager;
using API.Models;
using Microsoft.EntityFrameworkCore;
using API.Shared;
using API.Views.Shared;
using System.Security.Claims;

namespace API.Processor.Admin
{
    public class UserRoleProcessor : IProcessor<UserRoleBaseModel>
    {
         private AppDBContext _context;
         private IManager? _manager;
         public  UserRoleProcessor (AppDBContext context) {
            _context = context;
            _manager = Builder.MakeManagerClass(Enums.ModuleClassName.UserRole, _context); 
        }

        public async Task<ApiResponse> ProcessGet(Guid MenuId, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            if (_manager != null) {
                var response = await _manager.GetDataAsync(_User);
                var _Table = response.data as IEnumerable<UserRole>;
                var apiResponseUser = await SecurityHelper.UserMenuPermissionAsync(MenuId, _User);
                if (apiResponseUser.statusCode.ToString() != StatusCodes.Status200OK.ToString()) { return apiResponseUser; }
                var _UserMenuPermissionAsync = (GetUserPermissionViewModel)apiResponseUser.data;
                if (Convert.ToInt32 (response.statusCode) == 200) {
                    var result = (from ViewTable in _Table select new UserRoleViewModel {
                            Id = ViewTable.Id,
                            Code = ViewTable.Code,
                            Role = ViewTable.Role,
                            Active = ViewTable.Active,
                            Type = ViewTable.Type,
                    }).ToList();
                    response.data = result;
                }
                response.Permissions = _UserMenuPermissionAsync;
                return response;
            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessGetById(Guid _Id, Guid _MenuId, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            if (_manager != null) {
                var response = await _manager.GetDataByIdAsync (_Id,_User);
                if (Convert.ToInt32 (response.statusCode) == 200) {
                    var _Table = response.data as UserRole;
                    var _ViewModel = new UserRoleViewByIdModel {
                        Id = _Table.Id,
                        Code = _Table.Code,
                        Role = _Table.Role,
                        Active = _Table.Active,
                    };
                    response.data = _ViewModel;
                }
                return response;
            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessPost(object _UserRole, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            var UserRole = (UserRoleAddModel)_UserRole;
            if (_manager != null) {
                var _Table = new UserRole {
                    Code = UserRole.Code,
                    Role = UserRole.Role,
                    Active = UserRole.Active,
                    Type = UserRole.Type,
                    //UserIdInsert = UserRole.User
                };
                return await _manager.AddAsync (_Table,_User);
            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessPut(object _UserRole, ClaimsPrincipal _User)
        {
             ApiResponse apiResponse = new ApiResponse ();
              var UserRole = (UserRoleUpdateModel)_UserRole;
            if (_manager != null) {
                var _Table = new UserRole {
                    Id = UserRole.Id,
                    Code = UserRole.Code,
                    Role = UserRole.Role,                    
                    Active = UserRole.Active,
                    Type = UserRole.Type,
                    //UserIdUpdate = UserRole.User
                };
                return await _manager.UpdateAsync (_Table,_User);

            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessDelete(Guid _Id, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            if (_manager != null) {
                return await _manager.DeleteAsync (_Id,_User);
            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }
    }
}