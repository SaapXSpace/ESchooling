using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    [Table("Student")]
    public partial class Student
    {

        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        
        public string? Code { get; set; }

        [Required]
        [StringLength(100)]
        public string FullName { get; set; }

        [StringLength(100)]
        public string? Email { get; set; }

        [StringLength(20)]
        public string? Phone { get; set; }

        [StringLength(10)]
        public string? Gender { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [StringLength(30)]
        public string? RegistrationNumber { get; set; }

        public DateTime? EnrollmentDate { get; set; }

        [StringLength(20)]
        public string? EnrollmentStatus { get; set; }

        public DateTime? ExitDate { get; set; }

        [StringLength(100)]
        public string? ExitReason { get; set; }

        public string? Picture { get; set; }

        public bool Active { get; set; }

        public string? Action { get; set; }

        public Guid? UserIdInsert { get; set; }
        public DateTime? InsertDate { get; set; }

        public Guid? UserIdUpdate { get; set; }
        public DateTime? UpdateDate { get; set; }

        public Guid? UserIdDelete { get; set; }
        public DateTime? DeleteDate { get; set; }

        [NotMapped]
        public int? LastCode { get; set; }

        [NotMapped]
        public Guid? User { get; set; }
    }
}
