using System.ComponentModel.DataAnnotations;

namespace API.Views.Shared
{
    
    public class MenuSubCategoryBaseModel {

       public string Code { get; set; }

       [Required]
       public string Name { get; set; }

       [Required]
       public string Alias { get; set; }
       public string Icon { get; set; }
       public string Type { get; set; }
       public bool Active { get; set; }
       public bool View { get; set; }

    }

    public class MenuSubCategoryViewModel : MenuSubCategoryBaseModel {
       public Guid Id { get; set; }
       public string MenuModuleName { get; set; }
       public string MenuCategoryName { get; set; }
       
       public bool PermissionView{ get; set; }
       public bool PermissionAdd{ get; set; }
       public bool PermissionUpdate{ get; set; }
       public bool PermissionDelete{ get; set; }

    }

    public class MenuSubCategoryViewByIdModel : MenuSubCategoryBaseModel {
       public Guid Id { get; set; }
       public Guid MenuModuleId { get; set; }
       public Guid MenuCategoryId { get; set; }
       public string MenuModuleName { get; set; }
       public string MenuCategoryName { get; set; }
    }

    public class MenuSubCategoryAddModel : MenuSubCategoryBaseModel {
       public Guid Id { get; set; }
       public Guid MenuModuleId { get; set; }
       public Guid MenuCategoryId { get; set; }
       
       public Guid CompanyId { get; set; }
    }
    
    public class MenuSubCategoryUpdateModel : MenuSubCategoryBaseModel {
       public Guid Id { get; set; }
       public Guid MenuModuleId { get; set; }
       public Guid MenuCategoryId { get; set; }
       public Guid CompanyId { get; set; }
    }

     public class MenuSubCategoryDeleteModel : MenuSubCategoryBaseModel {
       public Guid Id { get; set; }
    }
}