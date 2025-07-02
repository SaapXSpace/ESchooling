using System.ComponentModel.DataAnnotations;

namespace API.Views.Shared
{
    
    public class BranchBaseModel {

       public string Code { get; set; }
       
       [Required]
       public string Name { get; set; }

       [Required]
       public string ShortName { get; set; }
       public string Phone { get; set; }
       public string Mobile { get; set; }
       public string Email { get; set; }
       public string Address { get; set; }
       public string Type { get; set; }
       public bool Active { get; set; }

    }

    public class BranchViewModel : BranchBaseModel {
       public Guid Id { get; set; }
       public string CompanyName{ get; set; }
       
       public bool PermissionView{ get; set; }
       public bool PermissionAdd{ get; set; }
       public bool PermissionUpdate{ get; set; }
       public bool PermissionDelete{ get; set; }

    }

    public class BranchViewByIdModel : BranchBaseModel {
       public Guid Id { get; set; }
       public Guid CompanyId { get; set; }
       public string CompanyName{ get; set; }
    }

    public class BranchAddModel : BranchBaseModel {
       public Guid Id { get; set; }
       public Guid CompanyId { get; set; }
    }
    
    public class BranchUpdateModel : BranchBaseModel {
       public Guid Id { get; set; }
       public Guid CompanyId { get; set; }
    }

     public class BranchDeleteModel : BranchBaseModel {
       public Guid Id { get; set; }
    }
}