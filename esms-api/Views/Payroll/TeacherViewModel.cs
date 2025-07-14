using System;
using System.ComponentModel.DataAnnotations; // Ensure this is included

namespace API.Views.Payroll
{
    public class TeacherBaseModel
    {
        [Required]
        [StringLength(100)]
        public string FullName { get; set; }

        [StringLength(20)]
        public string? Code { get; set; } // Nullable, as it's often auto-generated or optional

        [Required] // Assuming Email is always required
        [StringLength(100)]
        [EmailAddress] // Added for basic email format validation
        public string Email { get; set; }

        [Required] // Assuming Phone is always required
        [StringLength(20)]
        public string Phone { get; set; }

        [Required] // Assuming CNIC is always required
        [StringLength(20)]
        public string Cnic { get; set; }

        [Required] // Assuming Gender is always required
        [StringLength(10)]
        public string Gender { get; set; }

        public DateTime? DateOfBirth { get; set; } // Changed to nullable DateTime
        public DateTime? JoiningDate { get; set; } // Changed to nullable DateTime
        public DateTime? ExitDate { get; set; }

        public bool Active { get; set; } // FIXED: Changed from int to bool

        [StringLength(20)]
        public string? EmploymentStatus { get; set; }

        [StringLength(100)]
        public string? ExitReason { get; set; }

        public string? Picture { get; set; } // Nullable string for picture URL

        [StringLength(50)] // Added a length constraint
        public string? RegistrationNumber { get; set; } // Added for the regNo used in picture naming
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
        [Required] // TeacherId is required for updates
        public Guid TeacherId { get; set; }
    }

    public class TeacherDeleteModel : TeacherBaseModel
    {
        [Required] // TeacherId is required for deletes
        public Guid TeacherId { get; set; }
    }
}
