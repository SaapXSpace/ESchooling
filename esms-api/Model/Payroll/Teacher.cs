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
        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(20)]
        public string Phone { get; set; }
        [StringLength(20)]
        public string CNIC{ get; set; }

        [StringLength(10)]
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime JoiningDate { get; set; }

        [StringLength(10)]
        public string Action { get; set; }
        public DateTime CreatedAt { get; set; }
        public Guid CreatedBy { get; set; }

        public DateTime UpdatedAt { get; set; }
        public Guid UpdatedBy { get; set; }

        public DateTime DeletedAt { get; set; }
        public Guid DeletedBy { get; set; }
        public int Active { get; set; }

        [StringLength(20)]
        public string EmploymentStatus { get; set; }
        public DateTime? ExitDate { get; set; }
        [StringLength(100)]
        public string? ExitReason { get; set; }
        public string Picture { get; set; }




    }

}
