using API.Layers.ContextLayer;
using API.Manager;
using API.Models;
using Microsoft.EntityFrameworkCore;
using API.Shared;
using API.Views.Shared;
using System.Security.Claims;

namespace API.Processor.Payroll.Setup
{
    public class MenuCategoryProcessor : IProcessor<MenuCategoryBaseModel>
    {
         private AppDBContext _context;
         private IManager _manager;
         public  MenuCategoryProcessor (AppDBContext context, IManager manager) {
            _context = context;
            _manager = manager; 
        }

        public async Task<ApiResponse> ProcessGet(Guid MenuId, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            if (_manager != null) {
                var response = await _manager.GetDataAsync(_User);
                var _Table = response.data as IEnumerable<MenuCategory>;
                var apiResponseUser = await SecurityHelper.UserMenuPermissionAsync(MenuId, _User);
                if (apiResponseUser.statusCode.ToString() != StatusCodes.Status200OK.ToString()) { return apiResponseUser; }
                var _UserMenuPermissionAsync = (GetUserPermissionViewModel)apiResponseUser.data;
                if (Convert.ToInt32 (response.statusCode) == 200) {
                    var result = (from ViewTable in _Table select new MenuCategoryViewModel {
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
                    var _Table = response.data as MenuCategory;
                    var _ViewModel = new MenuCategoryViewByIdModel {
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

        public async Task<ApiResponse> ProcessPost(object MenuCategoryAddRequest,ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            var _MenuCategoryRequest = (MenuCategoryAddModel)MenuCategoryAddRequest;
            if (_manager != null) {
                var _Table = new MenuCategory {
                    Code = _MenuCategoryRequest.Code,
                    Name = _MenuCategoryRequest.Name,
                    Icon = _MenuCategoryRequest.Icon,
                    CompanyId = Guid.Parse("5FD03956-8BB0-4BB7-5555-08DB9D1290D4") ,
                    Type = _MenuCategoryRequest.Type,
                    Active = _MenuCategoryRequest.Active,
                    //UserIdInsert = _MenuCategoryRequest.User
                };
                return await _manager.AddAsync (_Table,_User);
            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessPut(object MenuCategoryUpdateRequest,ClaimsPrincipal _User)
        {
             ApiResponse apiResponse = new ApiResponse ();
              var _MenuCategoryRequest = (MenuCategoryUpdateModel)MenuCategoryUpdateRequest;
            if (_manager != null) {
                var _Table = new MenuCategory {
                    Id = _MenuCategoryRequest.Id,
                    Code = _MenuCategoryRequest.Code,
                    Name = _MenuCategoryRequest.Name,      
                    Icon = _MenuCategoryRequest.Icon,  
                    CompanyId = Guid.Parse("5FD03956-8BB0-4BB7-5555-08DB9D1290D4") ,
                    Type = _MenuCategoryRequest.Type,                
                    Active = _MenuCategoryRequest.Active,
                    //UserIdUpdate = _MenuCategoryRequest.User
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