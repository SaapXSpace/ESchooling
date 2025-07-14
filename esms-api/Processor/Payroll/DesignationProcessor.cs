using API.Layers.ContextLayer;
using API.Manager;
using API.Models;
using API.Shared;
using API.Views.Shared;
using System.Security.Claims;

namespace API.Processor.Admin
{
    public class DesignationProcessor : IProcessor<DesignationBaseModel>
    {
        private readonly AppDBContext _context;
        private readonly IManager? _manager;

        public DesignationProcessor(AppDBContext context)
        {
            _context = context;
            _manager = Builder.MakeManagerClass(Enums.ModuleClassName.Designation, _context);
        }

        public async Task<ApiResponse> ProcessGet(Guid MenuId, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();

            if (_manager != null)
            {
                var response = await _manager.GetDataAsync(_User);
                var _Table = response.data as IEnumerable<Designation>;

                var apiResponseUser = await SecurityHelper.UserMenuPermissionAsync(MenuId, _User);
                if (apiResponseUser.statusCode.ToString() != StatusCodes.Status200OK.ToString()) return apiResponseUser;

                var _UserMenuPermissionAsync = (GetUserPermissionViewModel)apiResponseUser.data;
                if (Convert.ToInt32(response.statusCode) == 200)
                {
                    var result = (from ViewTable in _Table
                                  select new DesignationViewModel
                                  {
                                      Id = ViewTable.Id,
                                      name = ViewTable.name,
                                      Description = ViewTable.Description,
                                      Active = ViewTable.Active,
                                      Type = ViewTable.Type,
                                  }).ToList();

                    response.data = result;
                }

                response.Permissions = _UserMenuPermissionAsync;
                return response;
            }

            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessGetById(Guid _Id, Guid _MenuId, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();

            if (_manager != null)
            {
                var response = await _manager.GetDataByIdAsync(_Id, _User);

                if (Convert.ToInt32(response.statusCode) == 200)
                {
                    var _Table = response.data as Designation;
                    var _ViewModel = new DesignationViewByIdModel
                    {
                        Id = _Table.Id,
                        name = _Table.name,
                        Description = _Table.Description,
                        Active = _Table.Active,
                        Type = _Table.Type
                    };
                    response.data = _ViewModel;
                }

                return response;
            }

            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessPost(object _Designation, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();

            var Designation = (DesignationAddModel)_Designation;

            if (_manager != null)
            {
                var _Table = new Designation
                {
                    Id = Designation.Id,
                    name = Designation.name,
                    Description = Designation.Description,
                    Active = Designation.Active,
                    Type = Designation.Type
                };

                return await _manager.AddAsync(_Table, _User);
            }

            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessPut(object _Designation, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();

            var Designation = (DesignationUpdateModel)_Designation;

            if (_manager != null)
            {
                var _Table = new Designation
                {
                    Id = Designation.Id,
                    name = Designation.name,
                    Description = Designation.Description,
                    Active = Designation.Active,
                    Type = Designation.Type
                };

                return await _manager.UpdateAsync(_Table, _User);
            }

            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessDelete(Guid _Id, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();

            if (_manager != null)
            {
                return await _manager.DeleteAsync(_Id, _User);
            }

            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }
    }
}
