using API.Layers.ContextLayer;
using API.Manager;
using API.Models;
using Microsoft.EntityFrameworkCore;
using API.Shared;
using API.Views.Shared;
using System.Security.Claims;

namespace API.Processor.Payroll.Setup
{
    public class BranchProcessor : IProcessor<BranchBaseModel>
    {
         private AppDBContext _context;
         private IManager _manager;
         public  BranchProcessor (AppDBContext context, IManager manager) {
            _context = context;
            _manager = manager; 
        }

        public async Task<ApiResponse> ProcessGet(Guid MenuId, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            if (_manager != null) {
                var response = await _manager.GetDataAsync(_User);
                var _Table = response.data as IEnumerable<Branch>;
                var apiResponseUser = await SecurityHelper.UserMenuPermissionAsync(MenuId, _User);
                if (apiResponseUser.statusCode.ToString() != StatusCodes.Status200OK.ToString()) { return apiResponseUser; }
                var _UserMenuPermissionAsync = (GetUserPermissionViewModel)apiResponseUser.data;
                if (Convert.ToInt32 (response.statusCode) == 200) {
                    var result = (from ViewTable in _Table select new BranchViewModel {
                            Id = ViewTable.Id,
                            Code = ViewTable.Code,
                            Name = ViewTable.Name,
                            ShortName = ViewTable.ShortName,
                            CompanyName = ViewTable.Companies.Name,
                            Phone = ViewTable.Phone,
                            Mobile = ViewTable.Mobile,
                            Email = ViewTable.Email,
                            Address = ViewTable.Address,
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
                    var _Table = response.data as Branch;
                    var _ViewModel = new BranchViewByIdModel {
                        Id = _Table.Id,
                        Code = _Table.Code,
                        Name = _Table.Name,
                        ShortName = _Table.ShortName,
                        CompanyId = _Table.CompanyId,
                        CompanyName = _Table.Companies.Name,
                        Phone = _Table.Phone,
                        Mobile = _Table.Mobile,
                        Email = _Table.Email,
                        Address = _Table.Address,
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

        public async Task<ApiResponse> ProcessPost(object BranchAddRequest, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            var _BranchRequest = (BranchAddModel)BranchAddRequest;
            if (_manager != null) {
                var _Table = new Branch {
                    Code = _BranchRequest.Code,
                    Name = _BranchRequest.Name,
                    ShortName = _BranchRequest.ShortName,
                    CompanyId = _BranchRequest.CompanyId,
                    Phone = _BranchRequest.Phone,
                    Mobile = _BranchRequest.Mobile,
                    Email = _BranchRequest.Email,
                    Address = _BranchRequest.Address,
                    Type = _BranchRequest.Type,
                    Active = _BranchRequest.Active,
                };
                return await _manager.AddAsync (_Table, _User);
            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessPut(object BranchUpdateRequest, ClaimsPrincipal _User)
        {
             ApiResponse apiResponse = new ApiResponse ();
              var _BranchRequest = (BranchUpdateModel)BranchUpdateRequest;
            if (_manager != null) {
                var _Table = new Branch {
                    Id = _BranchRequest.Id,
                    Code = _BranchRequest.Code,
                    Name = _BranchRequest.Name,      
                    ShortName = _BranchRequest.ShortName,  
                    CompanyId = _BranchRequest.CompanyId,
                    Phone = _BranchRequest.Phone,
                    Mobile = _BranchRequest.Mobile,
                    Email = _BranchRequest.Email,
                    Address = _BranchRequest.Address, 
                    Type = _BranchRequest.Type,                
                    Active = _BranchRequest.Active,
                };
                return await _manager.UpdateAsync (_Table, _User);

            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessDelete(Guid _Id, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            if (_manager != null) {
                return await _manager.DeleteAsync (_Id, _User);
            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        
    }
}