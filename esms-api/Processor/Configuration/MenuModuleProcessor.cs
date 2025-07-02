using API.Layers.ContextLayer;
using API.Manager;
using API.Models;
using Microsoft.EntityFrameworkCore;
using API.Shared;
using API.Views.Shared;
using System.Security.Claims;

namespace API.Processor.Payroll.Setup
{
    public class MenuModuleProcessor : IProcessor<MenuModuleBaseModel>
    {
         private AppDBContext _context;
         private IManager? _manager;
         public  MenuModuleProcessor (AppDBContext context) {
            _context = context;
            _manager = Builder.MakeManagerClass(Enums.ModuleClassName.MenuModule, _context); 
        }

        public async Task<ApiResponse> ProcessGet(Guid MenuId, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            if (_manager != null) {
                var response = await _manager.GetDataAsync(_User);
                var _Table = response.data as IEnumerable<MenuModule>;
                var apiResponseUser = await SecurityHelper.UserMenuPermissionAsync(MenuId, _User);
                if (apiResponseUser.statusCode.ToString() != StatusCodes.Status200OK.ToString()) { return apiResponseUser; }
                var _UserMenuPermissionAsync = (GetUserPermissionViewModel)apiResponseUser.data;
                if (Convert.ToInt32 (response.statusCode) == 200) {
                    var result = (from ViewTable in _Table select new MenuModuleViewModel {
                            Id = ViewTable.Id,
                            Code = ViewTable.Code,
                            Name = ViewTable.Name,
                            Icon = ViewTable.Icon,
                            Type = ViewTable.Type,
                            Active = ViewTable.Active,
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
                    var _Table = response.data as MenuModule;
                    var _ViewModel = new MenuModuleViewByIdModel {
                        Id = _Table.Id,
                        Code = _Table.Code,
                        Name = _Table.Name,
                        Icon = _Table.Icon,
                        Type = _Table.Type,
                        Active = _Table.Active
                    };
                    response.data = _ViewModel;
                }
                return response;
            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessPost(object MenuModuleAddRequest,ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            var _MenuModuleRequest = (MenuModuleAddModel)MenuModuleAddRequest;
            if (_manager != null) {
                var _Table = new MenuModule {
                    Code = _MenuModuleRequest.Code,
                    Name = _MenuModuleRequest.Name,
                    Icon = _MenuModuleRequest.Icon,
                    CompanyId = Guid.Parse("5FD03956-8BB0-4BB7-5555-08DB9D1290D4") ,
                    Type = _MenuModuleRequest.Type,
                    Active = _MenuModuleRequest.Active,
                    //UserIdInsert = _MenuModuleRequest.User
                };
                return await _manager.AddAsync (_Table,_User);
            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessPut(object MenuModuleUpdateRequest,ClaimsPrincipal _User)
        {
             ApiResponse apiResponse = new ApiResponse ();
              var _MenuModuleRequest = (MenuModuleUpdateModel)MenuModuleUpdateRequest;
            if (_manager != null) {
                var _Table = new MenuModule {
                    Id = _MenuModuleRequest.Id,
                    Code = _MenuModuleRequest.Code,
                    Name = _MenuModuleRequest.Name,      
                    Icon = _MenuModuleRequest.Icon,  
                    CompanyId = Guid.Parse("5FD03956-8BB0-4BB7-5555-08DB9D1290D4") ,
                    Type = _MenuModuleRequest.Type,                
                    Active = _MenuModuleRequest.Active,
                    //UserIdUpdate = _MenuModuleRequest.User
                };
                return await _manager.UpdateAsync (_Table,_User);

            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessDelete(Guid _Id,ClaimsPrincipal _User)
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