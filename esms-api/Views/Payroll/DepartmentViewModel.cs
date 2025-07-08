using System.ComponentModel.DataAnnotations;

namespace API.Views.Shared
{
    
    public class DepartmentBaseModel {
      public string Code { get; set; }
      [Required]
      public string Name { get; set; }  
      public string Type { get; set; }     
      public bool Active { get; set; }

    }

    public class DepartmentViewModel : DepartmentBaseModel {
       public Guid Id { get; set; }
       public bool PermissionView{ get; set; }
       public bool PermissionAdd{ get; set; }
       public bool PermissionUpdate{ get; set; }
       public bool PermissionDelete{ get; set; }

    }

    public class DepartmentViewByIdModel : DepartmentBaseModel {
       public Guid Id { get; set; }
    }

    public class DepartmentAddModel : DepartmentBaseModel {
       public Guid Id { get; set; }
       public Guid CompanyId { get; set; }
    }
    
    public class DepartmentUpdateModel : DepartmentBaseModel {
       public Guid Id { get; set; }
       public Guid CompanyId { get; set; }
    }

     public class DepartmentDeleteModel : DepartmentBaseModel {
       public Guid Id { get; set; }
    }
}   