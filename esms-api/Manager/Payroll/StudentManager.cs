using System;
using System.Security.Claims;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using API.Models;
using API.Shared;
using API.Layers.ContextLayer;
using System.Text.RegularExpressions;

namespace API.Manager.Payroll.Setup
{
    public class StudentManager : IManager
    {
        private readonly AppDBContext _context;
        private readonly IWebHostEnvironment _env;

        public StudentManager(AppDBContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        public async Task<ApiResponse> GetDataAsync(ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse();
            try
            {
                var list = await _context.Students
                    .Where(s => s.Action != Enums.Operations.D.ToString())
                    .OrderBy(s => s.FullName)
                    .ToListAsync();

                if (list == null || !list.Any())
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "Record Not Found";
                    return apiResponse;
                }

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.data = list;
                return apiResponse;
            }
            catch (Exception ex)
            {
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = ex.Message + (ex.InnerException != null ? " Inner Error: " + ex.InnerException : "");
                return apiResponse;
            }
        }

        public async Task<ApiResponse> GetDataByIdAsync(Guid id, ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse();
            try
            {
                var student = await _context.Students
                    .Where(s => s.Id == id && s.Action != Enums.Operations.D.ToString())
                    .FirstOrDefaultAsync();

                if (student == null)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.data = student;
                return apiResponse;
            }
            catch (Exception ex)
            {
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = ex.Message + (ex.InnerException != null ? " Inner Error: " + ex.InnerException : "");
                return apiResponse;
            }
        }

        public async Task<ApiResponse> AddAsync(object model, ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse();
            try
            {
                var userId = _User.Claims.FirstOrDefault(c => c.Type == Enums.Misc.UserId.ToString())?.Value;
                var _model = (Student)model;

                // ✅ Auto-generate Code like STU-00001, STU-00002, ...
                var lastCode = _context.Students
                    .Where(s => s.Code.StartsWith("STU-"))
                    .OrderByDescending(s => s.Code)
                    .Select(s => s.Code)
                    .FirstOrDefault();

                int nextCodeNumber = 1;

                if (!string.IsNullOrEmpty(lastCode) && int.TryParse(lastCode.Replace("STU-", ""), out int parsedCode))
                {
                    nextCodeNumber = parsedCode + 1;
                }

                _model.Code = $"STU-{nextCodeNumber:D5}"; // e.g., STU-00001

                _model.UserIdInsert = Guid.Parse(userId);
                _model.InsertDate = DateTime.Now;
                _model.Action = Enums.Operations.A.ToString();

                await _context.Students.AddAsync(_model);

                if (!string.IsNullOrEmpty(_model.Picture) && _model.Picture.StartsWith("data:image/jpeg"))
                {
                    var base64Data = Regex.Replace(_model.Picture, @"^data:image\/jpeg;base64,", "", RegexOptions.IgnoreCase);
                    var imageBytes = Convert.FromBase64String(base64Data);

                    var regNo = _model.RegistrationNumber;
                    var fileName = $"{regNo}.jpg";
                    var savePath = Path.Combine(_env.WebRootPath, "img", fileName);

                    File.WriteAllBytes(savePath, imageBytes);

                    // Save image path for front-end rendering
                    _model.Picture = $"/img/{fileName}";
                }
                else
                {
                    _model.Picture = null; // Optional: set to null if nothing provided
                }

                await _context.SaveChangesAsync();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.message = "Record Saved: " + _model.FullName;
                return apiResponse;
            }
            catch (Exception ex)
            {
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = ex.Message + (ex.InnerException != null ? " Inner Error: " + ex.InnerException : "");
                return apiResponse;
            }
        }


        public async Task<ApiResponse> UpdateAsync(object model, ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse();
            try
            {
                var userId = _User.Claims.FirstOrDefault(c => c.Type == Enums.Misc.UserId.ToString())?.Value;
                var _model = (Student)model;

                var existing = await _context.Students.FirstOrDefaultAsync(s => s.Id == _model.Id && s.Action != Enums.Operations.D.ToString());
                if (existing == null)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }

                //Only update image if a new one was sent as base64
                if (!string.IsNullOrEmpty(_model.Picture) && _model.Picture.StartsWith("data:image/jpeg"))
                {
                    try
                    {
                        var base64Data = Regex.Replace(_model.Picture, @"^data:image\/jpeg;base64,", "", RegexOptions.IgnoreCase);
                        var imageBytes = Convert.FromBase64String(base64Data);

                        var regNo = _model.RegistrationNumber?.Trim();
                        if (string.IsNullOrWhiteSpace(regNo))
                            throw new Exception("RegistrationNumber is required to save image.");

                        var fileName = $"{regNo}.jpg";
                        var savePath = Path.Combine(_env.WebRootPath, "img", fileName);

                        File.WriteAllBytes(savePath, imageBytes);

                        existing.Picture = $"/img/{fileName}";
                    }
                    catch (Exception imgEx)
                    {
                        return new ApiResponse
                        {
                            statusCode = StatusCodes.Status400BadRequest.ToString(),
                            message = "Image processing failed. " + imgEx.Message
                        };
                    }
                }

                
                existing.FullName = _model.FullName;
                existing.Email = _model.Email;
                existing.Phone = _model.Phone;
                existing.Gender = _model.Gender;
                existing.DateOfBirth = _model.DateOfBirth;
                existing.RegistrationNumber = _model.RegistrationNumber;
                existing.EnrollmentDate = _model.EnrollmentDate;
                existing.EnrollmentStatus = _model.EnrollmentStatus;
                existing.ExitDate = _model.ExitDate;
                existing.ExitReason = _model.ExitReason;
                existing.Active = _model.Active;

                existing.UserIdUpdate = Guid.Parse(userId);
                existing.Action = Enums.Operations.E.ToString();
                existing.UpdateDate = DateTime.Now;

                await _context.SaveChangesAsync();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.message = "Record Updated: " + existing.FullName;
                return apiResponse;
            }
            catch (Exception ex)
            {
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = ex.Message + (ex.InnerException != null ? " Inner Error: " + ex.InnerException : "");
                return apiResponse;
            }
        }


        public async Task<ApiResponse> DeleteAsync(Guid id, ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse();
            try
            {
                var userId = _User.Claims.FirstOrDefault(c => c.Type == Enums.Misc.UserId.ToString())?.Value;
                var student = await _context.Students.FirstOrDefaultAsync(s => s.Id == id && s.Action != Enums.Operations.D.ToString());

                if (student == null)
                {
                    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString();
                    apiResponse.message = "Record not found";
                    return apiResponse;
                }

                student.UserIdDelete = Guid.Parse(userId);
                student.Action = Enums.Operations.D.ToString();
                student.DeleteDate = DateTime.Now;

                await _context.SaveChangesAsync();

                apiResponse.statusCode = StatusCodes.Status200OK.ToString();
                apiResponse.message = "Record Deleted: " + student.FullName;
                return apiResponse;
            }
            catch (Exception ex)
            {
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = ex.Message + (ex.InnerException != null ? " Inner Error: " + ex.InnerException : "");
                return apiResponse;
            }
        }

        private string GenerateRandomDigits(int length)
        {
            var random = new Random();
            return string.Concat(Enumerable.Range(0, length).Select(_ => random.Next(0, 10)));
        }
    }
}