using System.ComponentModel.DataAnnotations;

namespace API.Views.Shared
{
    public class DesignationBaseModel
    {
        [Required]
        public string name { get; set; }

        public string Description { get; set; }

        public string Type { get; set; }

        public bool Active { get; set; }
    }

    public class DesignationViewModel : DesignationBaseModel
    {
        public Guid Id { get; set; }
        public bool PermissionView { get; set; }
        public bool PermissionAdd { get; set; }
        public bool PermissionUpdate { get; set; }
        public bool PermissionDelete { get; set; }
    }

    public class DesignationViewByIdModel : DesignationBaseModel
    {
        public Guid Id { get; set; }
    }

    public class DesignationAddModel : DesignationBaseModel
    {
        public Guid Id { get; set; }
        public Guid CompanyId { get; set; }
    }

    public class DesignationUpdateModel : DesignationBaseModel
    {
        public Guid Id { get; set; }
        public Guid CompanyId { get; set; }
    }

    public class DesignationDeleteModel : DesignationBaseModel
    {
        public Guid Id { get; set; }
    }
}
