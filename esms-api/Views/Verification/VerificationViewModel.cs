using System;
namespace API.Views.Shared
{
    
    public class VerificationViewModel {
        public StudentInfoViewModel studentInfo { get; set; }
         public List<CourseInfoViewModel> courseInfo { get; set; }
        
        
    }

    public class StudentInfoViewModel {
        public Guid Id { get; set; }
        
        public string? SSB { get; set; }

        public string? StudentName { get; set; }
        public string? FatherName { get; set; }
        public string? Image { get; set; }
        
        public string? CNIC { get; set; }
        
        public string? Phone { get; set; }
      
    }

    public class CourseInfoViewModel {
      
        public string? CertificateNo { get; set; }     
        public DateTime IssueDate { get; set; }
        public DateTime ExpirtyDate { get; set; }
        public string? CourseName { get; set; }

        // public string? StartDate { get; set; } 
        
        // public string? EndDate { get; set; } 
        
        // public string? Status { get; set; }
    }



    
}