using System.ComponentModel.DataAnnotations;


namespace API.Views.Payroll
{
    public class TeacherBaseModel
    {
        [Required]
        [StringLength(100)]
        public string FullName { get; set; }
        [StringLength(100)]
        public string Email { get; set; }

        [StringLength(20)]
        public string Phone { get; set; }
        [StringLength(20)]
        public string CNIC { get; set; }

        [StringLength(10)]
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime JoiningDate { get; set; }

        [StringLength(10)]
        public int Active { get; set; }

        [StringLength(20)]
        public string EmploymentStatus { get; set; }
        public DateTime? ExitDate { get; set; }
        [StringLength(100)]
        public string? ExitReason { get; set; }
        public string Picture { get; set; }


    }
    public class TeacherViewModel: TeacherBaseModel
    {
        public Guid TeacherId { get; set; }
        public bool PermissionView { get; set; }
        public bool PermissionAdd { get; set; }
        public bool PermissionUpdate { get; set; }
        public bool PermissionDelete { get; set; }
    }
    public class TeacherViewByIdModel: TeacherBaseModel
    {
        public Guid TeacherId { get; set; }
    }
    public class TeacherAddModel : TeacherBaseModel
    {
        public Guid TeacherId { get; set; }
        public Guid CompanyId { get; set; }

    }
    public class TeacherUpdateModel : TeacherBaseModel
    {
        public Guid TeacherId { get; set; }
        public Guid CompanyId { get; set; }
        

    }
    public class TeacherDeleteModel : TeacherBaseModel
    {
        public Guid TeacherId { get; set; }

    }
}
