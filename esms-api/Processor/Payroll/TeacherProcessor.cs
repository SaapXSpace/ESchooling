using API.Layers.ContextLayer;
using API.Manager;
using API.Models;
using Microsoft.EntityFrameworkCore;
using API.Shared;
using API.Views.Shared;
using System.Security.Claims;
using API.Model.Payroll;
using API.Views.Payroll;

namespace API.Processor.Payroll
{
    public class TeacherProcessor : IProcessor<TeacherBaseModel>
    {
        private AppDBContext _context;
        private IManager? _manager;
        public TeacherProcessor(AppDBContext context)
        {
            _context = context;
            _manager = Builder.MakeManagerClass(Enums.ModuleClassName.Teacher, _context);
        }
        public async Task<ApiResponse> ProcessGet(Guid MenuId, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();
            if (_manager != null)
            {
                var response = await _manager.GetDataAsync(_User);
                var _Table = response.data as IEnumerable<Teacher>;
                var apiResponseUser = await SecurityHelper.UserMenuPermissionAsync(MenuId, _User);
                if (apiResponseUser.statusCode.ToString() != StatusCodes.Status200OK.ToString()) { return apiResponseUser; }
                var _UserMenuPermissionAsync = (GetUserPermissionViewModel)apiResponseUser.data;
                if (Convert.ToInt32(response.statusCode) == 200)
                {

                    var result = (from ViewTable in _Table
                                  select new TeacherViewModel
                                  { 
                                      TeacherId = ViewTable.TeacherId,
                                      FullName = ViewTable.FullName,
                                      Email = ViewTable.Email,
                                      Phone = ViewTable.Phone,
                                      Gender = ViewTable.Gender,
                                      Active = ViewTable.Active, 
                                      EmploymentStatus = ViewTable.EmploymentStatus

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
                    var _Table = response.data as Teacher;
                    var _ViewModel = new TeacherViewByIdModel
                    {
                        TeacherId = _Table.TeacherId,
                        FullName = _Table.FullName,
                        Email = _Table.Email,
                        Phone = _Table.Phone,
                        Gender = _Table.Gender
                    };
                    response.data = _ViewModel;
                }
                return response;
            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessPost(object _Teacher, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();
            var Teacher = (TeacherAddModel)_Teacher;
            if (_manager != null)
            {
                var _Table = new Teacher
                {
                    FullName = Teacher.FullName,
                    Email = Teacher.Email,
                    Phone = Teacher.Phone,
                    Gender = Teacher.Gender,
                    Active = Teacher.Active,
                    EmploymentStatus = Teacher.EmploymentStatus
                };
                return await _manager.AddAsync(_Table, _User);
            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessPut(object _Teacher, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();
            var Teacher = (TeacherUpdateModel)_Teacher;
            if (_manager != null)
            {
                var _Table = new Teacher
                {
                    TeacherId = Teacher.TeacherId,
                    FullName = Teacher.FullName,
                    Email = Teacher.Email,
                    Phone = Teacher.Phone,
                    Gender = Teacher.Gender,
                    Active = Teacher.Active,
                    UpdatedAt = DateTime.Now,

                    EmploymentStatus = Teacher.EmploymentStatus
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

