using System;
using System.Security.Claims;
using API.Layers.ContextLayer;
using API.Manager; // Assuming IManager interface is here
using API.Models; // Assuming ApiResponse, StatusCodes are here
using Microsoft.EntityFrameworkCore;
using API.Shared; // Assuming Enums.Operations, SecurityHelper are here
using API.Model.Payroll; // Assuming Teacher entity is here
using API.Views.Payroll; // Assuming TeacherBaseModel, TeacherViewModel, TeacherViewByIdModel, TeacherAddModel, TeacherUpdateModel, TeacherDeleteModel are here
using API.Manager.Payroll; // <--- ADDED THIS USING DIRECTIVE

namespace API.Processor.Payroll
{
    public class TeacherProcessor : IProcessor<TeacherBaseModel>
    {
        private AppDBContext _context;
        private IManager? _manager;

        public TeacherProcessor(AppDBContext context, IManager manager)
        {
            _context = context;
            _manager = manager;
        }

        public async Task<ApiResponse> ProcessGet(Guid MenuId, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();
            if (_manager != null)
            {
                var response = await _manager.GetDataAsync(_User);
                var _Table = response.data as IEnumerable<Teacher>;

                if (Convert.ToInt32(response.statusCode) == 200 && _Table != null)
                {
                    var result = (from ViewTable in _Table
                                  select new TeacherViewModel
                                  {
                                      Code = ViewTable.Code,
                                      TeacherId = ViewTable.TeacherId,
                                      FullName = ViewTable.FullName,
                                      Email = ViewTable.Email,
                                      Phone = ViewTable.Phone,
                                      Gender = ViewTable.Gender,
                                      Active = ViewTable.Active,
                                      EmploymentStatus = ViewTable.EmploymentStatus,
                                      Picture = ViewTable.Picture 
                                  }).ToList();
                    response.data = result;
                }
                return response;
            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Manager not initialized or Invalid Class.";
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
                    if (_Table != null)
                    {
                        var _ViewModel = new TeacherViewByIdModel
                        {
                            TeacherId = _Table.TeacherId,
                            FullName = _Table.FullName,
                            Code = _Table.Code, 
                            Email = _Table.Email,
                            Phone = _Table.Phone,
                            Cnic = _Table.Cnic,
                            Gender = _Table.Gender,
                            DateOfBirth = _Table.DateOfBirth,
                            JoiningDate = _Table.JoiningDate,
                            EmploymentStatus = _Table.EmploymentStatus,
                            ExitDate = _Table.ExitDate,
                            ExitReason = _Table.ExitReason,
                            Picture = _Table.Picture, 
                            Active = _Table.Active
                        };
                        response.data = _ViewModel;
                    }
                }
                return response;
            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Manager not initialized or Invalid Class.";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessPost(object _Teacher, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();

            var Teacher = _Teacher as TeacherAddModel;
            if (Teacher == null)
            {
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = "Invalid Class: Expected TeacherAddModel.";
                return apiResponse;
            }

            if (_manager is TeacherManager teacherManager)
            {
                var lastTeacherWithCode = await _context.Teachers
                    .Where(t => t.Code != null && t.Code.StartsWith("TEA-") && t.Action != Enums.Operations.D.ToString())
                    .ToListAsync(); 

                int lastNumericCode = 0;
                if (lastTeacherWithCode.Any())
                {
                    lastNumericCode = lastTeacherWithCode
                        .Select(t => {
                            string codePart = t.Code.Replace("TEA-", "");
                            int.TryParse(codePart, out int numericCode);
                            return numericCode;
                        })
                        .Max();
                }

                int newNumericCode = lastNumericCode + 1;
                string generatedCode = $"TEA-{newNumericCode:D4}"; // 4-digit padded code (e.g., TEA-0001)
                // --- End: Improved Code Generation Logic ---

                // Assign the generated code to the Teacher object
                Teacher.Code = generatedCode;

                // Pass the TeacherAddModel directly to the manager's AddAsync method
                return await teacherManager.AddAsync(Teacher, _User);
            }

            apiResponse.statusCode = StatusCodes.Status500InternalServerError.ToString();
            apiResponse.message = "Manager not initialized or is not a TeacherManager.";
            return apiResponse;
        }

        public async Task<ApiResponse> ProcessPut(object _Teacher, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();
            var TeacherUpdateModel = _Teacher as TeacherUpdateModel; // Cast to the specific Update Model

            if (TeacherUpdateModel == null)
            {
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = "Invalid Class: Expected TeacherUpdateModel.";
                return apiResponse;
            }

            if (_manager is TeacherManager teacherManager) // Safely cast to TeacherManager
            {
                // Pass the TeacherUpdateModel directly to the manager.
                return await teacherManager.UpdateAsync(TeacherUpdateModel, _User);
            }
            else
            {
                apiResponse.statusCode = StatusCodes.Status500InternalServerError.ToString();
                apiResponse.message = "Manager not initialized or is not a TeacherManager.";
                return apiResponse;
            }
        }

        public async Task<ApiResponse> ProcessDelete(Guid _Id, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();
            if (_manager != null)
            {
                return await _manager.DeleteAsync(_Id, _User);
            }
            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Manager not initialized or Invalid Class.";
            return apiResponse;
        }
    }
}
