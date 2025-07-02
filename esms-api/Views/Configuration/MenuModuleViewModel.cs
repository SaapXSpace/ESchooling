using System.ComponentModel.DataAnnotations;

namespace API.Views.Shared
{
    
    public class MenuModuleBaseModel {

      public string Code { get; set; }
       
      [Required]
      public string Name { get; set; }

      [Required]
      public string Icon { get; set; }
       
      public string Type { get; set; }
      public bool Active { get; set; }

    }

    public class MenuModuleViewModel : MenuModuleBaseModel {
       public Guid Id { get; set; }
       public bool PermissionView{ get; set; }
       public bool PermissionAdd{ get; set; }
       public bool PermissionUpdate{ get; set; }
       public bool PermissionDelete{ get; set; }

    }

    public class MenuModuleViewByIdModel : MenuModuleBaseModel {
       public Guid Id { get; set; }
    }

    public class MenuModuleAddModel : MenuModuleBaseModel {
       public Guid Id { get; set; }
       public Guid CompanyId { get; set; }
    }
    
    public class MenuModuleUpdateModel : MenuModuleBaseModel {
       public Guid Id { get; set; }
       public Guid CompanyId { get; set; }
    }

     public class MenuModuleDeleteModel : MenuModuleBaseModel {
       public Guid Id { get; set; }
    }
}