using System;
using System.ComponentModel.DataAnnotations;

namespace API.Views.Shared
{
    public class CourseBaseModel
    {
        [Required]
        [StringLength(100)]
        public string CourseName { get; set; }

        [StringLength(255)]
        public string Description { get; set; }

        [Required]
        public int Credits { get; set; }

        [Required]
        public bool Active { get; set; } = true;
    }

    public class CourseViewModel : CourseBaseModel
    {
        public Guid CourseId { get; set; }
        public string Code { get; set; }
    }

    public class CourseViewByIdModel : CourseBaseModel
    {
        public Guid CourseId { get; set; }
        public string Code { get; set; }
    }

    public class CourseAddModel : CourseBaseModel { }

    public class CourseUpdateModel : CourseBaseModel
    {
        public Guid CourseId { get; set; }
    }
}