using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Model.Payroll
{
    [Table("Teacher")]
    public class Teacher
    {
        [Key]
        public Guid TeacherId { get; set; }

        [Required]
        [StringLength(100)]
        public string FullName { get; set; }

        [StringLength(20)]
        public string? Code { get; set; } // Nullable to match DTO

        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(20)]
        public string Phone { get; set; }

        [StringLength(20)]
        public string Cnic { get; set; }

        [StringLength(10)]
        public string Gender { get; set; }

        public DateTime? DateOfBirth { get; set; } // Changed to nullable
        public DateTime? JoiningDate { get; set; } // Changed to nullable
        public DateTime? ExitDate { get; set; } // Already nullable

        [StringLength(10)]
        public string Action { get; set; }

        public DateTime CreatedAt { get; set; }
        public Guid CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; } // Changed to nullable
        public Guid? UpdatedBy { get; set; } // Changed to nullable

        public DateTime? DeletedAt { get; set; } // Changed to nullable
        public Guid? DeletedBy { get; set; } // Changed to nullable

        public bool Active { get; set; } // Changed from int to bool

        [StringLength(20)]
        public string? EmploymentStatus { get; set; } // Changed to nullable

        [StringLength(100)]
        public string? ExitReason { get; set; } // Already nullable

        public string? Picture { get; set; } // Changed to nullable

        [StringLength(50)] // Added length constraint
        public string? RegistrationNumber { get; set; } // NEW: Added to match DTO
    }
}
