using System.ComponentModel.DataAnnotations;

namespace API.Views.Shared
{
    
    public class MenuCategoryBaseModel {

      public string Code { get; set; }
       
      [Required]
      public string Name { get; set; }

      [Required]
      public string Icon { get; set; }
       
      public string Type { get; set; }
      public bool Active { get; set; }

    }

    public class MenuCategoryViewModel : MenuCategoryBaseModel {
       public Guid Id { get; set; }
       public bool PermissionView{ get; set; }
       public bool PermissionAdd{ get; set; }
       public bool PermissionUpdate{ get; set; }
       public bool PermissionDelete{ get; set; }

    }

    public class MenuCategoryViewByIdModel : MenuCategoryBaseModel {
       public Guid Id { get; set; }
    }

    public class MenuCategoryAddModel : MenuCategoryBaseModel {
       public Guid Id { get; set; }
       public Guid CompanyId { get; set; }
    }
    
    public class MenuCategoryUpdateModel : MenuCategoryBaseModel {
       public Guid Id { get; set; }
       public Guid CompanyId { get; set; }
    }

     public class MenuCategoryDeleteModel : MenuCategoryBaseModel {
       public Guid Id { get; set; }
    }
}