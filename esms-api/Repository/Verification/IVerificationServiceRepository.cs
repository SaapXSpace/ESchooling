using System.Reflection;
using System;
using API.Layers.ContextLayer;
using API.Models;
using API.Shared;
using Microsoft.EntityFrameworkCore;
using API.Views.Shared;
using API.Views.Service;
using System.Security.Claims;

namespace API.Repository {
    public interface IVerificationServiceRepository
    {
        //LOV's
       Task<ApiResponse> GetStudentBySSBForVerification(string _ssb);
       
    }

    public class VerificationServiceRepository : IVerificationServiceRepository
    {
        private readonly AppDBContext _context;

        public VerificationServiceRepository (AppDBContext context) {
            _context = context;
        }

       public async Task<ApiResponse> GetStudentBySSBForVerification(string _ssb)
        {
            var apiResponse = new ApiResponse ();
            try {
                
                StudentInfoViewModel _student = new StudentInfoViewModel();
                List<CourseInfoViewModel> _course = new List<CourseInfoViewModel>();

                //var _studentVerification = await (from studentinfo in _context.StudentProfiles
                //.Where (a => a.Action != Enums.Operations.D.ToString ()  && a.Active == true && (a.SSB == _ssb || a.CNIC.Replace("-","") == _ssb.Replace("-","") || a.Passport == _ssb || a.COC == _ssb))
                //select new StudentInfoViewModel {
                //        Id = studentinfo.Id,
                //        SSB = studentinfo.SSB,
                //        StudentName = studentinfo.FirstName +" "+ studentinfo.LastName  ,
                //        FatherName = studentinfo.FatherName,
                //        CNIC = studentinfo.CNIC,
                //        Image = Convert.ToBase64String(studentinfo.ProfileImage),
                //        Phone = studentinfo.Phone,
                //}).FirstOrDefaultAsync ();

                //if (_studentVerification == null) {
                //        apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                //        apiResponse.message = "Student not found";
                //        return apiResponse;
                //}

                //if (_studentVerification != null)
                //{
                //    var _courseVerification = await (from courseinfo in _context.Certificates.Include(c => c.Courses)
                //    .Where (a => a.Action != Enums.Operations.D.ToString () && a.Students.Id == _studentVerification.Id)
                //    select new CourseInfoViewModel {
                //            CourseName = courseinfo.Courses.Name,
                //            CertificateNo = courseinfo.CertificateNo,
                //            IssueDate = courseinfo.IssueDate,
                //            ExpirtyDate = courseinfo.ExpiryDate,
                //            // StartDate = courseinfo.StartDate,
                //            // EndDate = courseinfo.EndDate,
                //            // Status = ((DateTime.Parse(courseinfo.EndDate)).Date <= DateTime.Now.Date) ? "Complete" : "InProgress"
                //    }).OrderBy (o => o.CourseName).ToListAsync ();

                //    if (_courseVerification == null) {
                //        apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                //        apiResponse.message = "Student not found";
                //        return apiResponse;
                //    }
                    
                //    //if (_courseVerification.Count == 0) {
                //    //    apiResponse.statusCode = StatusCodes.Status404NotFound.ToString ();
                //    //    apiResponse.message = "Student not found";
                //    //    return apiResponse;
                //    //}

                //    _student = _studentVerification;
                //    _course = _courseVerification;
                //}

                var _modelverification = new VerificationViewModel(){
                    studentInfo = _student,
                    courseInfo = _course,
                };

                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.data = _modelverification;
                return apiResponse;

            } catch (Exception e) {

                string innerexp = "";
                if (e.InnerException != null) {
                    innerexp = " Inner Error : " + e.InnerException.ToString ();
                }
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString ();
                apiResponse.message = e.Message.ToString () + innerexp;
                return apiResponse;
            }
        }

    }
}