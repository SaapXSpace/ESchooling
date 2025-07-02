using System.Reflection;
using System;
using API.Layers.ContextLayer;
using API.Models;
using API.Shared;
using Microsoft.EntityFrameworkCore;
using API.Views.Shared;
using API.Views.Service;
using System.Security.Claims;
using API.Manager;

namespace API.Repository {
    public interface IDashboardServiceRepository
    {
        //LOV's
       Task<ApiResponse> GetAdminDashboardCardsCountsAsync(Guid _MenuId,ClaimsPrincipal _User);
       Task<ApiResponse> GetAdminDashboardMonthlyAccountSummaryAsync(DateTime month);
       Task<ApiResponse> GetAdminDashboardCourseSummaryAsync();
       Task<ApiResponse> GetAdminDashboardYearlyCertificatesSummaryAsync(DateTime year);
       Task<ApiResponse> GetLoginAuditStatisticsAsync(DateTime date);
       Task<ApiResponse> GetDailyRecordActivityAsync(DateTime date);
    }

    public class DashboardServiceRepository : IDashboardServiceRepository
    {
        private readonly AppDBContext _context;
        

        public DashboardServiceRepository (AppDBContext context) {
            _context = context;
        }

        public async Task<ApiResponse> GetAdminDashboardCardsCountsAsync(Guid _MenuId,ClaimsPrincipal _User)
        {
            var apiResponse = new ApiResponse ();
            try {
                var apiResponseUser = await SecurityHelper.UserMenuPermissionAsync(_MenuId, _User);
                if (apiResponseUser.statusCode.ToString() != StatusCodes.Status200OK.ToString()) { return apiResponseUser; }
                var _UserMenuPermissionAsync = (GetUserPermissionViewModel)apiResponseUser.data;
                if (_UserMenuPermissionAsync != null && _UserMenuPermissionAsync.View_Permission != true){
                    apiResponse.statusCode = StatusCodes.Status401Unauthorized.ToString ();
                    apiResponse.Permissions = _UserMenuPermissionAsync;
                    return apiResponse;
                }
 
                StudentInfoViewModel _student = new StudentInfoViewModel();
                List<CourseInfoViewModel> _course = new List<CourseInfoViewModel>();

                var totalUser = _context.Users.Count(x => x.Action != Enums.Operations.D.ToString());
                var totalActiveUser = _context.Users.Count(x => x.Active == true && x.Action != Enums.Operations.D.ToString());

                //var totalStudent = _context.StudentProfiles.Count(x => x.Action != Enums.Operations.D.ToString()) ;
                //var totalActiveStudent = _context.StudentProfiles.Count(x => x.Active == true && x.Action != Enums.Operations.D.ToString());

                //var totalCertificates = _context.Certificates.Count(x => x.Action != Enums.Operations.D.ToString());
                //var totalCourses = _context.Courses.Count(x => x.Active == true && x.Action != Enums.Operations.D.ToString());

                //var ledgerdebitSum = _context.Ledgers.Where(l => l.Transaction == "D" && l.InsertDate.Value.Date == DateTime.Today && l.Action != Enums.Operations.D.ToString())
                //.Sum(l => (decimal?)l.Amount) ?? 0;

                //var ledgercreditSum = _context.Ledgers.Where(l => l.Transaction == "C" && l.InsertDate.Value.Date == DateTime.Today && l.Action != Enums.Operations.D.ToString())
                //.Sum(l => (decimal?)l.Amount) ?? 0;

                //var ledgerFeeVouchertotalSum = _context.Payments.Where(p => p.InsertDate.Value.Date == DateTime.Today && p.Action != Enums.Operations.D.ToString())
                //.Sum(p => (decimal?)p.Total) ?? 0;


                // Count Certificate

                //var currentDateCertificate = _context.Certificates.Count(x => x.InsertDate.Value.Date == DateTime.Now.Date && x.Action != Enums.Operations.D.ToString());
                //var secondDateCertificate = _context.Certificates.Count(x => x.Action != Enums.Operations.D.ToString() && x.InsertDate.Value.Date == DateTime.Now.Date.AddDays(-1));
                //var thirdDateCertificate = _context.Certificates.Count(x => x.Action != Enums.Operations.D.ToString() && x.InsertDate.Value.Date == DateTime.Now.Date.AddDays(-2));
                //var forthDateCertificate = _context.Certificates.Count(x => x.Action != Enums.Operations.D.ToString() && x.InsertDate.Value.Date == DateTime.Now.Date.AddDays(-3));

                //var CertificateObj = new {
                //    currentDateValue = currentDateCertificate,
                //    currentDate = DateTime.Now.Date,
                //    secondDateValue = secondDateCertificate,
                //    secondDate = DateTime.Now.Date.AddDays(-1),
                //    ThirdDateValue = thirdDateCertificate,
                //    ThirdDate = DateTime.Now.Date.AddDays(-2),
                //    ForthDateValue = forthDateCertificate,
                //    ForthDate = DateTime.Now.Date.AddDays(-3)

                //};

                var dashboardResponce = new {
                    TotalUser = totalUser,
                    TotalActiveUser = totalActiveUser,
                    //TotalStudent = totalStudent,
                    //TotalActiveStudent = totalActiveStudent,
                    //TotalCertificates = totalCertificates,
                    //TotalCourses = totalCourses,
                    //TodayIncome = ledgerdebitSum + ledgerFeeVouchertotalSum,
                    //TodayExpence = ledgercreditSum,
                    //CertificateCardDetail = CertificateObj
                };

                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.data = dashboardResponce;
                apiResponse.Permissions = _UserMenuPermissionAsync;
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

        public async Task<ApiResponse> GetAdminDashboardMonthlyAccountSummaryAsync(DateTime month)
        {
            var apiResponse = new ApiResponse ();
            try {
                
                List<string> Dates = new List<string>();
                List<string> Income = new List<string>();
                List<string> Expence = new List<string>();
                List<string> Net = new List<string>();

                DateTime firstDayOfMonth = new DateTime(month.Year, month.Month, 1);
                DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

                //var ledgerdebitList = _context.Ledgers.Where(l => l.Transaction == "D" 
                //    && l.InsertDate.Value.Date >= firstDayOfMonth.Date 
                //    && l.InsertDate.Value.Date <= lastDayOfMonth.Date 
                //    && l.InsertDate.Value.Month == firstDayOfMonth.Month
                //    && l.InsertDate.Value.Year == firstDayOfMonth.Year
                //    && l.Action != Enums.Operations.D.ToString()).ToList();

                //var ledgercreditList = _context.Ledgers.Where(l => l.Transaction == "C"
                //    && l.InsertDate.Value.Date >= firstDayOfMonth.Date 
                //    && l.InsertDate.Value.Date <= lastDayOfMonth.Date 
                //    && l.InsertDate.Value.Month == firstDayOfMonth.Month
                //    && l.InsertDate.Value.Year == firstDayOfMonth.Year
                //    && l.Action != Enums.Operations.D.ToString()).ToList();

                //var ledgerFeeVouchertotalList = _context.Payments.Where(l =>
                //    l.InsertDate.Value.Date >= firstDayOfMonth.Date 
                //    && l.InsertDate.Value.Date <= lastDayOfMonth.Date 
                //    && l.InsertDate.Value.Month == firstDayOfMonth.Month
                //    && l.InsertDate.Value.Year == firstDayOfMonth.Year
                //    && l.Action != Enums.Operations.D.ToString()).ToList();

                int daysInMonth = DateTime.DaysInMonth(month.Year, month.Month);
                for (int day = 1; day <= daysInMonth; day++)
                {
                    DateTime NewDates = new DateTime(month.Year, month.Month, day);
                    //var ledgerdebitSum = ledgerdebitList
                    //    .Where(x => x.InsertDate.HasValue && x.InsertDate.Value.Date == NewDates.Date)
                    //    .Sum(l => (decimal?)l.Amount) ?? 0;

                    //var ledgercreditSum = ledgercreditList
                    //    .Where(x => x.InsertDate.HasValue && x.InsertDate.Value.Date == NewDates.Date)
                    //    .Sum(l => (decimal?)l.Amount) ?? 0;

                    //var ledgerFeeVouchertotalSum = ledgerFeeVouchertotalList
                    //    .Where(x => x.InsertDate.HasValue && x.InsertDate.Value.Date == NewDates.Date)
                    //    .Sum(p => (decimal?)p.Total) ?? 0;

                    //var _totalIncom = ledgerdebitSum + ledgerFeeVouchertotalSum;
                    //var _Net = _totalIncom - ledgercreditSum;
                    
                    //Dates.Add(NewDates.ToString("dd-MMMM"));
                    //Income.Add(_totalIncom.ToString());
                    //Expence.Add(ledgercreditSum.ToString());
                    //Net.Add(_Net.ToString());
                }

                var AccountSummaryDashboard = new {
                    Dates = Dates,
                    Income = Income,
                    Expence = Expence,
                    Net = Net
                };
                
                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.data = AccountSummaryDashboard;
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

        public async Task<ApiResponse> GetAdminDashboardCourseSummaryAsync()
        {
            var apiResponse = new ApiResponse ();
            try {
                
               //var query = from studentCourse in _context.StudentCourses
               //     join course in _context.Courses on studentCourse.CourseId equals course.Id
               //     join category in _context.CourseCategories on course.CourseCategoryId equals category.Id
               //     group course by category.Name into g
               //     select new 
               //     {
               //         CategoryName = g.Key,
               //         CoursePercentage = (decimal)g.Count() * 100.0M / (decimal)_context.StudentCourses.Count()
               //     };
       
                //apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                //apiResponse.data = query.OrderByDescending(x => x.CoursePercentage).ToList();;
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
    
        public async Task<ApiResponse> GetAdminDashboardYearlyCertificatesSummaryAsync(DateTime year)
        {
            var apiResponse = new ApiResponse ();
            try {
                
                List<string> Months = new List<string>();
                List<string> CertificatesCount = new List<string>();
                
                DateTime firstDayOfMonth = new DateTime(year.Year, year.Month, 1);
                DateTime lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

                //var CertificateList = _context.Certificates.Where(l => l.Action != Enums.Operations.D.ToString()
                //    && l.InsertDate.Value.Year == firstDayOfMonth.Year
                //    && l.Action != Enums.Operations.D.ToString()).ToList();

                for (int month = 1; month <= 12; month++)
                {
                    DateTime startDate = new DateTime(year.Year, month, 1);
                    DateTime endDate = startDate.AddMonths(1).AddDays(-1);

                   //var CertificateCount = CertificateList
                   //     .Count(x => x.InsertDate.Value.Date >= startDate && x.InsertDate.Value.Date <= endDate
                   //                 && x.InsertDate.Value.Month == startDate.Month
                   //                 && x.InsertDate.Value.Year == startDate.Year);

                    Months.Add(startDate.ToString("MMM"));
                    //CertificatesCount.Add(CertificateCount.ToString());
                }

                var AccountSummaryDashboard = new {
                    Months = Months,
                    CertificatesCount = CertificatesCount,
                };
                
                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.data = AccountSummaryDashboard;
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

        public async Task<ApiResponse> GetLoginAuditStatisticsAsync(DateTime _date)
        {
            var apiResponse = new ApiResponse ();
            try {
                
            var today = _date.Date;
            var subquery = _context.UserLoginAudits
                                   .Where(la => la.LoginDate.Date == today)
                                   .Count();

            subquery = subquery == 0 ? 1 : subquery;
           var query = from user in _context.Users.Where(x => x.Active == true && x.Action != Enums.Operations.D.ToString())
                    join loginAudit in _context.UserLoginAudits
                    on new { UserId = user.Id, Date = today } equals new { UserId = loginAudit.UserId, Date = loginAudit.LoginDate.Date }
                    into userLoginAudits
                    from userLoginAudit in userLoginAudits.DefaultIfEmpty()
                    
                    group userLoginAudit by new { user.Id, user.NormalizedName } into g
                    select new
                    {
                        UserId = g.Key.Id,
                        Name = g.Key.NormalizedName,
                        LoginCount = g.Count(x => x != null),
                        LoginPercentage = Math.Round((double)g.Count(x => x != null) * 100.0 / subquery, 2)
                    };

                
                apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                apiResponse.data = query.OrderByDescending(x => x.LoginCount);
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

        public async Task<ApiResponse> GetDailyRecordActivityAsync(DateTime date)
        {
            var apiResponse = new ApiResponse ();
            try {
                
                    var today = date.Date;
                    var allUsers = _context.Users.Where(y => y.Active == true && y.Action != Enums.Operations.D.ToString()).ToList();

                    //var paymentTransactions = _context.Payments.Where(x => x.InsertDate.Value.Date == today).ToList();
                    //var addTransactions = paymentTransactions.Where(x => x.Action == Enums.Operations.A.ToString()).Select(
                    //    x => new 
                    //    {
                    //        Id = x.Id,
                    //        Table = "Payment",
                    //        Action = "Add",
                    //        User = allUsers.Where(y => y.Id==  x.UserIdInsert).Select(x => x.NormalizedName).FirstOrDefault() ?? "" ,
                    //        Date = x.InsertDate.Value.ToString("dd-MMM-yyyy hh:mm tt")
                    //    })
                    //    .ToList();

                    //var updateTransactions = paymentTransactions.Where(x => x.Action == Enums.Operations.U.ToString()).Select(
                    //    x => new 
                    //    {
                    //        Id = x.Id,
                    //        Table = "Payment",
                    //        Action = "Update",
                    //        User =  allUsers.Where(y => y.Id==  x.UserIdUpdate).Select(x => x.NormalizedName).FirstOrDefault() ?? "" ,
                    //        Date = x.InsertDate.Value.ToString("dd-MMM-yyyy hh:mm tt")
                    //    })
                    //    .ToList();

                    //var deleteTransactions = paymentTransactions.Where(x => x.Action == Enums.Operations.D.ToString()).Select(
                    //    x => new 
                    //    {
                    //        Id = x.Id,
                    //        Table = "Payment",
                    //        Action = "Delete",
                    //        User =  allUsers.Where(y => y.Id==  x.UserIdDelete).Select(x => x.NormalizedName).FirstOrDefault() ?? ""  ,
                    //        Date = x.InsertDate.Value.ToString("dd-MMM-yyyy hh:mm tt")
                    //    })
                    //    .ToList();

                    //var ledgerTransactions = _context.Ledgers.Where(x => x.InsertDate.Value.Date == today).ToList();
                    //var ledgeraddTransactions = ledgerTransactions.Where(x => x.Action == Enums.Operations.A.ToString()).Select(
                    //    x => new 
                    //    {
                    //        Id = x.Id,
                    //        Table = "Ledger",
                    //        Action = "Add",
                    //        User = allUsers.Where(y => y.Id==  x.UserIdInsert).Select(x => x.NormalizedName).FirstOrDefault() ?? "" ,
                    //        Date = x.InsertDate.Value.ToString("dd-MMM-yyyy hh:mm tt")
                    //    })
                    //    .ToList();

                    //var ledgerupdateTransactions = ledgerTransactions.Where(x => x.Action == Enums.Operations.U.ToString()).Select(
                    //    x => new 
                    //    {
                    //        Id = x.Id,
                    //        Table = "Ledger",
                    //        Action = "Update",
                    //        User =  allUsers.Where(y => y.Id==  x.UserIdUpdate).Select(x => x.NormalizedName).FirstOrDefault() ?? "" ,
                    //        Date = x.InsertDate.Value.ToString("dd-MMM-yyyy hh:mm tt")
                    //    })
                    //    .ToList();

                    //var ledgerdeleteTransactions = ledgerTransactions.Where(x => x.Action == Enums.Operations.D.ToString()).Select(
                    //    x => new 
                    //    {
                    //        Id = x.Id,
                    //        Table = "Ledger",
                    //        Action = "Delete",
                    //        User =  allUsers.Where(y => y.Id==  x.UserIdDelete).Select(x => x.NormalizedName).FirstOrDefault() ?? ""  ,
                    //        Date = x.InsertDate.Value.ToString("dd-MMM-yyyy hh:mm tt")
                    //    })
                    //    .ToList();

                    //var query = 
                    //    addTransactions
                    //    .Concat(updateTransactions)
                    //    .Concat(deleteTransactions)
                    //    .Concat(ledgeraddTransactions)
                    //    .Concat(ledgerupdateTransactions)
                    //    .Concat(ledgerdeleteTransactions)
                    //    .ToList();



                    //apiResponse.statusCode = StatusCodes.Status200OK.ToString ();
                    //apiResponse.data = query.OrderByDescending(x => x.Date);
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