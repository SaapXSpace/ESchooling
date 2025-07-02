using API.Layers.ContextLayer;
using API.Manager;
using API.Models;
using Microsoft.EntityFrameworkCore;
using API.Shared;
using API.Views.Shared;
using System.Security.Claims;

namespace API.Processor.Payroll.Setup
{
    public class MenuSubCategoryProcessor : IProcessor<MenuSubCategoryBaseModel>
    {
         private AppDBContext _context;
         private IManager? _manager;
         public  MenuSubCategoryProcessor (AppDBContext context) {
            _context = context;
            _manager = Builder.MakeManagerClass(Enums.ModuleClassName.MenuSubCategory, _context); 
        }

        public async Task<ApiResponse> ProcessGet(Guid MenuId, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            if (_manager != null) {
                var response = await _manager.GetDataAsync(_User);
                var _Table = response.data as IEnumerable<MenuSubCategory>;
                var apiResponseUser = await SecurityHelper.UserMenuPermissionAsync(MenuId, _User);
                if (apiResponseUser.statusCode.ToString() != StatusCodes.Status200OK.ToString()) { return apiResponseUser; }
                var _UserMenuPermissionAsync = (GetUserPermissionViewModel)apiResponseUser.data;
                if (Convert.ToInt32 (response.statusCode) == 200) {
                    var result = (from ViewTable in _Table select new MenuSubCategoryViewModel {
                            Id = ViewTable.Id,
                            Code = ViewTable.Code,
                            Name = ViewTable.Name,
                            Alias = ViewTable.Alias,
                            MenuModuleName = ViewTable.MenuModule.Name,
                            MenuCategoryName = ViewTable.MenuCategory.Name,
                            Icon = ViewTable.Icon,
                            View = ViewTable.View,
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
                    var _Table = response.data as MenuSubCategory;
                    var _ViewModel = new MenuSubCategoryViewByIdModel {
                        Id = _Table.Id,
                        Code = _Table.Code,
                        Name = _Table.Name,
                        Alias = _Table.Alias,
                        MenuModuleId = _Table.MenuModuleId,
                        MenuModuleName = _Table.MenuModule.Name,
                        MenuCategoryId = _Table.MenuCategoryId,
                        MenuCategoryName = _Table.MenuCategory.Name,
                        Icon = _Table.Icon,
                        View = _Table.View,
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

        public async Task<ApiResponse> ProcessPost(object MenuSubCategoryAddRequest, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            var _MenuSubCategoryRequest = (MenuSubCategoryAddModel)MenuSubCategoryAddRequest;
            if (_manager != null) {
                var _Table = new MenuSubCategory {
                    Code = _MenuSubCategoryRequest.Code,
                    Name = _MenuSubCategoryRequest.Name,
                    Alias = _MenuSubCategoryRequest.Alias,
                    MenuModuleId = _MenuSubCategoryRequest.MenuModuleId,
                    MenuCategoryId = _MenuSubCategoryRequest.MenuCategoryId,
                    //CompanyId = Guid.Parse("5FD03956-8BB0-4BB7-5555-08DB9D1290D4") ,
                    View = _MenuSubCategoryRequest.View,
                    Icon = _MenuSubCategoryRequest.Icon,
                    Type = _MenuSubCategoryRequest.Type,
                    Active = _MenuSubCategoryRequest.Active,
                    //UserIdInsert = _MenuSubCategoryRequest.User
                };
                return await _manager.AddAsync (_Table,_User);
            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessPut(object MenuSubCategoryUpdateRequest, ClaimsPrincipal _User)
        {
             ApiResponse apiResponse = new ApiResponse ();
              var _MenuSubCategoryRequest = (MenuSubCategoryUpdateModel)MenuSubCategoryUpdateRequest;
            if (_manager != null) {
                var _Table = new MenuSubCategory {
                    Id = _MenuSubCategoryRequest.Id,
                    Code = _MenuSubCategoryRequest.Code,
                    Name = _MenuSubCategoryRequest.Name,      
                    Alias = _MenuSubCategoryRequest.Alias,
                    MenuModuleId = _MenuSubCategoryRequest.MenuModuleId,
                    MenuCategoryId = _MenuSubCategoryRequest.MenuCategoryId,
                    //CompanyId = Guid.Parse("5FD03956-8BB0-4BB7-5555-08DB9D1290D4") ,
                    View = _MenuSubCategoryRequest.View,
                    Icon = _MenuSubCategoryRequest.Icon,
                    Type = _MenuSubCategoryRequest.Type,                
                    Active = _MenuSubCategoryRequest.Active,
                    //UserIdUpdate = _MenuSubCategoryRequest.User
                };
                return await _manager.UpdateAsync (_Table,_User);

            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessDelete(Guid _Id , ClaimsPrincipal _User)
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