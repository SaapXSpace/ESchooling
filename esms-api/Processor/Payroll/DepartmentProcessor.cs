using API.Layers.ContextLayer;
using API.Manager;
using API.Models;
using Microsoft.EntityFrameworkCore;
using API.Shared;
using API.Views.Shared;
using System.Security.Claims;

namespace API.Processor.Admin
{
    public class DepartmentProcessor : IProcessor<DepartmentBaseModel>
    {
         private AppDBContext _context;
         private IManager? _manager;
         public  DepartmentProcessor (AppDBContext context) {
            _context = context;
            _manager = Builder.MakeManagerClass(Enums.ModuleClassName.Department, _context); 
        }

        public async Task<ApiResponse> ProcessGet(Guid MenuId, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            if (_manager != null) {
                var response = await _manager.GetDataAsync(_User);
                 var _Table = response.data as IEnumerable<Department>;
                var apiResponseUser = await SecurityHelper.UserMenuPermissionAsync(MenuId, _User);
                if (apiResponseUser.statusCode.ToString() != StatusCodes.Status200OK.ToString()) { return apiResponseUser; }
                var _UserMenuPermissionAsync = (GetUserPermissionViewModel)apiResponseUser.data;
                if (Convert.ToInt32 (response.statusCode) == 200) {
                   
                    var result = (from ViewTable in _Table select new DepartmentViewModel {
                            Id = ViewTable.Id,
                            Code = ViewTable.Code,
                            Name = ViewTable.Name,
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
                    var _Table = response.data as Department;
                    var _ViewModel = new DepartmentViewByIdModel {
                        Id = _Table.Id,
                        Code = _Table.Code,
                        Name = _Table.Name,
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

        public async Task<ApiResponse> ProcessPost(object _Department, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            var Department = (DepartmentAddModel)_Department;
            if (_manager != null) {
                var _Table = new Department {
                    Code = Department.Code,
                    Name = Department.Name,
                    Active = Department.Active,
                    Type = Department.Type,
                };
                return await _manager.AddAsync (_Table,_User);
            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessPut(object _Department, ClaimsPrincipal _User)
        {
             ApiResponse apiResponse = new ApiResponse ();
              var Department = (DepartmentUpdateModel)_Department;
            if (_manager != null) {
                var _Table = new Department {
                    Id = Department.Id,
                    Code = Department.Code,
                    Name = Department.Name,                    
                    Active = Department.Active,
                    Type = Department.Type,
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