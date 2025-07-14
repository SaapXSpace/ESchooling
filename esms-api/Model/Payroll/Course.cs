using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    [Table("Course")]
    public partial class Course
    {
        [Key]
        public Guid CourseId { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(100)]
        public string CourseName { get; set; }

        [Required]
        [StringLength(20)]
        public string Code { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        [Required]
        [Range(1, 10)]
        public int Credits { get; set; }

        [Required]
        public bool Active { get; set; } = true;

        public string? Action { get; set; }

        public DateTime? CreatedAt { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public Guid? UpdatedBy { get; set; }

        public DateTime? DeletedAt { get; set; }

        public Guid? DeletedBy { get; set; }
    }
}