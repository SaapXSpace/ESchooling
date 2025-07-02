using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace API.Views.Shared {
    public class UserRolePermissionBaseModel {

    }
    public class UserRolePermissionViewModel : UserRolePermissionBaseModel {
        [Required]
        public String Roles_Id { get; set; }

        [Required]
        public string Roles_Name { get; set; }

    }
    public class UserRolePermissionViewByIdModel : UserRolePermissionBaseModel {

        [Required]
        public String Roles_Id { get; set; }

        [Required]
        public string Roles_Name { get; set; }

        [Required]
        public Guid Menu_Id { get; set; }

        [Required]
        public string Menu_Name { get; set; }

        [Required]
        public bool View_Permission { get; set; }

        [Required]
        public bool Insert_Permission { get; set; }

        [Required]
        public bool Update_Permission { get; set; }

        [Required]
        public bool Delete_Permission { get; set; }
    }
    public class UserRolePermissionAddModel : UserRolePermissionBaseModel {
        public List<UserRolePermissionListModel> UserRolePermissions { get; set; }
    }
    public class UserRolePermissionUpdateModel : UserRolePermissionBaseModel {
        public List<UserRolePermissionListModel> UserRolePermissions { get; set; }
    }
    public class UserRolePermissionDeleteModel : UserRolePermissionBaseModel {
        [Required]
        public String Roles_Id { get; set; }

    }
    public class UserRolePermissionListModel {
        [Required]
        public Guid RolesId { get; set; }

        [Required]
        public Guid MenuId { get; set; }

        [Required]
        public Guid UserId { get; set; }

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
        public bool Approved_Permission { get; set; }

        
        [Required]
        public bool Allow_Permission { get; set; }

    }


    public class GetUserPermissionViewModel
    {
        [Required]
        public Guid MenuId { get; set; }

        [Required]
        public string MenuName { get; set; }
         [Required]
        public string CompanyName { get; set; }
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
        public bool Check_Permission { get; set; }

        [Required]
        public bool Approve_Permission { get; set; }
        
        [Required]
        public bool Print_permission { get; set; }
        
        [Required]
        public bool Allow_permission { get; set; }

        [Required]
        public Guid CompanyId { get; set; }
        [Required]
        public Guid BranchId { get; set; }
        [Required]
        public Guid FinancialYearId { get; set; }
        public DateTime YearStartDate { get; set; }
        public DateTime YearEndDate { get; set; }
        public DateTime PermissionDateFrom { get; set; }
        public DateTime PermissionDateTo { get; set; }

    }
}