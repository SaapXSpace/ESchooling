using System.ComponentModel.DataAnnotations;

namespace API.Views.Shared
{
    
    public class CompanyBaseModel {

       public string Code { get; set; }
       
       [Required]
       public string Name { get; set; }

       [Required]
       public string ShortName { get; set; }
       public string LogoImage { get; set; }
       public string? NTN { get; set; }
       public string? STN { get; set; }
       public string Type { get; set; }
       public bool Active { get; set; }

    }

    public class CompanyViewModel : CompanyBaseModel {
       public Guid Id { get; set; }
       public bool PermissionView{ get; set; }
       public bool PermissionAdd{ get; set; }
       public bool PermissionUpdate{ get; set; }
       public bool PermissionDelete{ get; set; }

    }

    public class CompanyViewByIdModel : CompanyBaseModel {
       public Guid Id { get; set; }
    }

    public class CompanyAddModel : CompanyBaseModel {
       public Guid Id { get; set; }
    }
    
    public class CompanyUpdateModel : CompanyBaseModel {
       public Guid Id { get; set; }
    }

     public class CompanyDeleteModel : CompanyBaseModel {
       public Guid Id { get; set; }
    }
}