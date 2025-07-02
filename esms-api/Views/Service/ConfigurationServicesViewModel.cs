using System.Reflection;
using System.ComponentModel.DataAnnotations;

namespace API.Views.Service
{
    public class MenuInitializerServicesViewModel {

        public Guid MenuId { get; set; }
        public string MenuName { get; set; }
        public string MenuAlias { get; set; }
        public string MenuIcon { get; set; }
        public string MenuURL { get; set; }
        public bool MenuView { get; set; }
        public Guid MenuCategoryId { get; set; }
        public string MenuCategoryName { get; set; }
        public string MenuCategoryIcon { get; set; }
        public Guid ModuleId { get; set; }
        public string ModuleName { get; set; }
        public string ModuleIcon { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
    }

     public class MenuPermissionPayLoadServicesModel {
        public Guid RoleId { get; set; }
        public Guid UserId { get; set; }

     }

     public class MenuPermissionViewModel {
        [Required]
        public Guid ModuleId { get; set; }

        [Required]
        public string ModuleName { get; set; }

        [Required]
        public string CategoryName { get; set; }

        [Required]
        public Guid MenuId { get; set; }

        [Required]
        public string MenuName { get; set; }

        [Required]
        public string MenuAlias { get; set; }

        [Required]
        public bool View_Permission { get; set; }

        [Required]
        public bool Insert_Permission { get; set; }

        [Required]
        public bool Update_Permission { get; set; }

        [Required]
        public bool Delete_Permission { get; set; }

        [Required]
        public bool Print_Permission { get; set; }

        [Required]
        public bool Check_Permission { get; set; }

        [Required]
        public bool Approve_Permission { get; set; }
        [Required]
        public bool Allow_Permission { get; set; }

    }

    public class MenuPermissionViewRoleModel  {
        [Required]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<MenuPermissionViewModel> menuPerViews { get; set; }

    }
}