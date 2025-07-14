using System.ComponentModel.DataAnnotations;

namespace API.Views.Shared
{
    public class StudentBaseModel
    {
        public string? Code { get; set; }

        [Required]
        public string FullName { get; set; }

        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? RegistrationNumber { get; set; }
        public DateTime? EnrollmentDate { get; set; }
        public string? EnrollmentStatus { get; set; }
        public DateTime? ExitDate { get; set; }
        public string? ExitReason { get; set; }
        public string? Picture { get; set; }
        public bool Active { get; set; }
    }

    public class StudentViewModel : StudentBaseModel
    {
        public Guid Id { get; set; }

        public bool PermissionView { get; set; }
        public bool PermissionAdd { get; set; }
        public bool PermissionUpdate { get; set; }
        public bool PermissionDelete { get; set; }
    }

    public class StudentViewByIdModel : StudentBaseModel
    {
        public Guid Id { get; set; }
    }

    public class StudentAddModel : StudentBaseModel
    {
        public Guid Id { get; set; }
        public Guid CompanyId { get; set; }
    }

    public class StudentUpdateModel : StudentBaseModel
    {
        public Guid Id { get; set; }
        public Guid CompanyId { get; set; }
    }

    public class StudentDeleteModel : StudentBaseModel
    {
        public Guid Id { get; set; }
    }
}
