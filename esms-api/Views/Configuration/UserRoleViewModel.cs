using System.ComponentModel.DataAnnotations;

namespace API.Views.Shared
{
    
    public class UserRoleBaseModel {
      public string Code { get; set; }
      [Required]
      public string Role { get; set; }  
      public string Type { get; set; }     
      public bool Active { get; set; }

    }

    public class UserRoleViewModel : UserRoleBaseModel {
       public Guid Id { get; set; }
       public bool PermissionView{ get; set; }
       public bool PermissionAdd{ get; set; }
       public bool PermissionUpdate{ get; set; }
       public bool PermissionDelete{ get; set; }

    }

    public class UserRoleViewByIdModel : UserRoleBaseModel {
       public Guid Id { get; set; }
    }

    public class UserRoleAddModel : UserRoleBaseModel {
       public Guid Id { get; set; }
       public Guid CompanyId { get; set; }
    }
    
    public class UserRoleUpdateModel : UserRoleBaseModel {
       public Guid Id { get; set; }
       public Guid CompanyId { get; set; }
    }

     public class UserRoleDeleteModel : UserRoleBaseModel {
       public Guid Id { get; set; }
    }
}