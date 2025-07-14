// ✅ STEP 4: PROCESSOR (StudentProcessor.cs)
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using API.Models;
using API.Views.Shared;
using API.Shared;
using API.Layers.ContextLayer;
using API.Manager;

namespace API.Processor.Admin
{
    public class StudentProcessor : IProcessor<StudentBaseModel>
    {
        private readonly AppDBContext _context;
        private readonly IManager? _manager;

        public StudentProcessor(AppDBContext context)
        {
            _context = context;
            _manager = Builder.MakeManagerClass(Enums.ModuleClassName.Student, _context);
        }

        public async Task<ApiResponse> ProcessGet(Guid MenuId, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();

            if (_manager != null)
            {
                var response = await _manager.GetDataAsync(_User);
                var _Table = response.data as IEnumerable<Student>;

                var apiResponseUser = await SecurityHelper.UserMenuPermissionAsync(MenuId, _User);
                if (apiResponseUser.statusCode.ToString() != StatusCodes.Status200OK.ToString()) return apiResponseUser;
                var _UserMenuPermissionAsync = (GetUserPermissionViewModel)apiResponseUser.data;

                if (Convert.ToInt32(response.statusCode) == 200)
                {
                    var result = (from s in _Table
                                  select new StudentViewModel
                                  {
                                      Id = s.Id,
                                      Code = s.Code,
                                      FullName = s.FullName,
                                      Email = s.Email,
                                      Phone = s.Phone,
                                      Gender = s.Gender,
                                      DateOfBirth = s.DateOfBirth,
                                      RegistrationNumber = s.RegistrationNumber,
                                      EnrollmentDate = s.EnrollmentDate,
                                      EnrollmentStatus = s.EnrollmentStatus,
                                      ExitDate = s.ExitDate,
                                      ExitReason = s.ExitReason,
                                      Picture = s.Picture,
                                      Active = s.Active
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
                    var s = response.data as Student;
                    var viewModel = new StudentViewByIdModel
                    {
                        Id = s.Id,
                        Code = s.Code,
                        FullName = s.FullName,
                        Email = s.Email,
                        Phone = s.Phone,
                        Gender = s.Gender,
                        DateOfBirth = s.DateOfBirth,
                        RegistrationNumber = s.RegistrationNumber,
                        EnrollmentDate = s.EnrollmentDate,
                        EnrollmentStatus = s.EnrollmentStatus,
                        ExitDate = s.ExitDate,
                        ExitReason = s.ExitReason,
                        Picture = s.Picture,
                        Active = s.Active
                    };
                    response.data = viewModel;
                }
                return response;
            }

            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessPost(object _Student, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();
            var s = (StudentAddModel)_Student;

            if (_manager != null)
            {
                var model = new Student
                {
                    FullName = s.FullName,
                    Email = s.Email,
                    Phone = s.Phone,
                    Gender = s.Gender,
                    DateOfBirth = s.DateOfBirth,
                    RegistrationNumber = s.RegistrationNumber,
                    EnrollmentDate = s.EnrollmentDate,
                    EnrollmentStatus = s.EnrollmentStatus,
                    ExitDate = s.ExitDate,
                    ExitReason = s.ExitReason,
                    Picture = s.Picture,
                    Active = s.Active
                };
                return await _manager.AddAsync(model, _User);
            }

            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Invalid Class";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessPut(object _Student, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();
            var s = (StudentUpdateModel)_Student;

            if (_manager != null)
            {
                var model = new Student
                {
                    Id = s.Id,
                    FullName = s.FullName,
                    Email = s.Email,
                    Phone = s.Phone,
                    Gender = s.Gender,
                    DateOfBirth = s.DateOfBirth,
                    RegistrationNumber = s.RegistrationNumber,
                    EnrollmentDate = s.EnrollmentDate,
                    EnrollmentStatus = s.EnrollmentStatus,
                    ExitDate = s.ExitDate,
                    ExitReason = s.ExitReason,
                    Picture = s.Picture,
                    Active = s.Active
                };
                return await _manager.UpdateAsync(model, _User);
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
