using API.Layers.ContextLayer;
using API.Manager;
using API.Models;
using Microsoft.EntityFrameworkCore;
using API.Shared;
using API.Views.Shared;
using System.Security.Claims;

namespace API.Processor.Payroll.Setup
{
    public class UserProcessor : IProcessor<UsersBaseModel>
    {
         private AppDBContext _context;
         private IManager? _manager;
         public  UserProcessor (AppDBContext context) {
            _context = context;
            _manager = Builder.MakeManagerClass(Enums.ModuleClassName.User, _context); 
        }

        public async Task<ApiResponse> ProcessGet(Guid MenuId, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            if (_manager != null) {
                var response = await _manager.GetDataAsync(_User);
                var _Table = response.data as IEnumerable<User>;
                var apiResponseUser = await SecurityHelper.UserMenuPermissionAsync(MenuId, _User);
                if (apiResponseUser.statusCode.ToString() != StatusCodes.Status200OK.ToString()) { return apiResponseUser; }
                var _UserMenuPermissionAsync = (GetUserPermissionViewModel)apiResponseUser.data;
                if (Convert.ToInt32 (response.statusCode) == 200) {
                    var result = (from ViewTable in _Table select new UsersViewModel {
                            Id = ViewTable.Id,
                            Code = ViewTable.Code,
                            NormalizedName = ViewTable.FirstName + " " + ViewTable.LastName ,
                            Contact = ViewTable.Contact,
                            BranchName = ViewTable.Branches.Name,
                            CNIC = ViewTable.CNIC,
                            Email = ViewTable.Email,
                            Role = ViewTable.UserRole.Role,
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
                    var _Table = response.data as User;
                    var _ViewModel = new UsersViewByIdModel {
                        Id = _Table.Id,
                        Code = _Table.Code,
                        FirstName = _Table.FirstName ,
                        LastName =  _Table.LastName ,
                        BranchesCheck = _Table.BranchesCheck,
                        Contact = _Table.Contact,
                        BranchName = _Table.Branches.Name,
                        BranchId = _Table.BranchId,
                        CNIC = _Table.CNIC,
                        PermitForm = _Table.PermitForm,
                        PermitTo = _Table.PermitTo,
                        HashPassword = SecurityHelper.DecryptString("1234567890123456",_Table.HashPassword),
                        Email = _Table.Email,
                        Role = _Table.UserRole.Role,
                        RoleId = _Table.RoleId,
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

        public async Task<ApiResponse> ProcessPost(object _Usermodel, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            var User = (UsersAddModel) _Usermodel;
            
            if (_manager != null) {
                var _Table = new User {
                    Code = User.Code,
                    FirstName = User.FirstName ,
                    LastName =  User.LastName ,
                    NormalizedName = User.FirstName + " " + User.LastName ,
                    BranchesCheck = User.BranchesCheck,
                    Contact = User.Contact,
                    BranchId = User.BranchId,
                    CNIC = User.CNIC,
                    PermitForm = User.PermitForm,
                    PermitTo = User.PermitTo,
                    HashPassword =  SecurityHelper.EncryptString("1234567890123456",User.HashPassword),
                    Email = User.Email,
                    RoleId = User.RoleId,
                    Type = User.Type,
                    Active = User.Active,
                };
                return await _manager.AddAsync (_Table,_User);
            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessPut(object _Usermodel, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            var User = (UsersUpdateModel) _Usermodel;
            if (_manager != null) {
                var _Table = new User {
                    Id = User.Id,
                     Code = User.Code,
                    FirstName = User.FirstName ,
                    LastName =  User.LastName ,
                    NormalizedName = User.FirstName + " " + User.LastName ,
                    BranchesCheck = User.BranchesCheck,
                    Contact = User.Contact,
                    BranchId = User.BranchId,
                    CNIC = User.CNIC,
                    PermitForm = User.PermitForm,
                    PermitTo = User.PermitTo,
                    HashPassword =  SecurityHelper.EncryptString("1234567890123456",User.HashPassword),
                    Email = User.Email,
                    RoleId = User.RoleId,
                    Type = User.Type,
                    Active = User.Active,
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