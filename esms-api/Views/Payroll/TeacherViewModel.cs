using System;
using System.ComponentModel.DataAnnotations;

namespace API.Views.Payroll
{
    public class TeacherBaseModel
    {
        [Required]
        [StringLength(100)]
        public string FullName { get; set; }

        [StringLength(20)]
        public string? Code { get; set; } 

        [Required] 
        [StringLength(100)]
        [EmailAddress]
        public string Email { get; set; }

        [Required] 
        [StringLength(20)]
        public string Phone { get; set; }

        [Required] 
        [StringLength(20)]
        public string Cnic { get; set; }

        [Required] 
        [StringLength(10)]
        public string Gender { get; set; }

        public DateTime? DateOfBirth { get; set; } 
        public DateTime? JoiningDate { get; set; } 
        public DateTime? ExitDate { get; set; }

        public bool Active { get; set; } 

        [StringLength(20)]
        public string? EmploymentStatus { get; set; }

        [StringLength(100)]
        public string? ExitReason { get; set; }

        public string? Picture { get; set; } 

        [StringLength(50)] 
        public string? RegistrationNumber { get; set; } 
    }

    public class TeacherViewModel : TeacherBaseModel
    {
        public Guid TeacherId { get; set; }
        public bool PermissionView { get; set; }
        public bool PermissionAdd { get; set; }
        public bool PermissionUpdate { get; set; }
        public bool PermissionDelete { get; set; }
    }

    public class TeacherViewByIdModel : TeacherBaseModel
    {
        public Guid TeacherId { get; set; }
    }

    public class TeacherAddModel : TeacherBaseModel
    {
        // Removed TeacherId as it's generated on the server for new additions
    }

    public class TeacherUpdateModel : TeacherBaseModel
    {
        [Required] 
        public Guid TeacherId { get; set; }
    }

    public class TeacherDeleteModel : TeacherBaseModel
    {
        [Required] 
        public Guid TeacherId { get; set; }
    }
}
