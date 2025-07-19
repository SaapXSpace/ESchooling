using API.Layers.ContextLayer;
using API.Manager;
using API.Models;
using Microsoft.EntityFrameworkCore;
using API.Shared;
using API.Views.Shared;
using System.Security.Claims;

namespace API.Processor.Payroll.Setup
{
    public class CompanyProcessor : IProcessor<CompanyBaseModel>
    {
         private AppDBContext _context;
         private IManager _manager;
         public  CompanyProcessor (AppDBContext context, IManager manager) {
            _context = context;
            _manager = manager; 
        }

        public async Task<ApiResponse> ProcessGet(Guid MenuId, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            if (_manager != null) {
                var response = await _manager.GetDataAsync(_User);
                var _Table = response.data as IEnumerable<Company>;
                var apiResponseUser = await SecurityHelper.UserMenuPermissionAsync(MenuId, _User);
                if (apiResponseUser.statusCode.ToString() != StatusCodes.Status200OK.ToString()) { return apiResponseUser; }
                var _UserMenuPermissionAsync = (GetUserPermissionViewModel)apiResponseUser.data;
                if (Convert.ToInt32 (response.statusCode) == 200) {
                    var result = (from ViewTable in _Table select new CompanyViewModel {
                            Id = ViewTable.Id,
                            Code = ViewTable.Code,
                            Name = ViewTable.Name,
                            ShortName = ViewTable.ShortName,
                            LogoImage = Convert.ToBase64String(ViewTable.LogoImage),
                            NTN = ViewTable.NTN,
                            STN = ViewTable.STN,
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
                    var _Table = response.data as Company;
                    var _ViewModel = new CompanyViewByIdModel {
                        Id = _Table.Id,
                        Code = _Table.Code,
                        Name = _Table.Name,
                        ShortName = _Table.ShortName,
                        LogoImage = Convert.ToBase64String(_Table.LogoImage),
                        NTN = _Table.NTN,
                        STN = _Table.STN,
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

        public async Task<ApiResponse> ProcessPost(object companyAddRequest,ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse ();
            var _companyRequest = (CompanyAddModel)companyAddRequest;
            if (_manager != null) {
                byte[] logoBytes = Convert.FromBase64String(_companyRequest.LogoImage.Contains(",") ? _companyRequest.LogoImage.Split(',')[1] :  _companyRequest.LogoImage  );
                var _Table = new Company {
                    Code = _companyRequest.Code,
                    Name = _companyRequest.Name,
                    ShortName = _companyRequest.ShortName,
                    LogoImage = logoBytes,
                    NTN = _companyRequest.NTN,
                    STN = _companyRequest.STN,
                    Type = _companyRequest.Type,
                    Active = _companyRequest.Active,
                    //UserIdInsert = _companyRequest.User
                };
                return await _manager.AddAsync (_Table,_User);
            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessPut(object companyUpdateRequest,ClaimsPrincipal _User)
        {
             ApiResponse apiResponse = new ApiResponse ();
              var _companyRequest = (CompanyUpdateModel)companyUpdateRequest;
            if (_manager != null) {
                byte[] logoBytes = Convert.FromBase64String(_companyRequest.LogoImage.Contains(",") ? _companyRequest.LogoImage.Split(',')[1] :  _companyRequest.LogoImage  );
                var _Table = new Company {
                    Id = _companyRequest.Id,
                    Code = _companyRequest.Code,
                    Name = _companyRequest.Name,      
                    ShortName = _companyRequest.ShortName,  
                    LogoImage = logoBytes,
                    NTN = _companyRequest.NTN,  
                    STN = _companyRequest.STN,  
                    Type = _companyRequest.Type,                
                    Active = _companyRequest.Active,
                    //UserIdUpdate = _companyRequest.User
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