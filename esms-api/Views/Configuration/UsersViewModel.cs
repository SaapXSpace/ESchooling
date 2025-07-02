using System.ComponentModel.DataAnnotations;

namespace API.Views.Shared
{
    
    public class UsersBaseModel {

        public string Code { get; set; } 
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Contact { get; set; }
        public string CNIC { get; set; }
        public string Email { get; set; }
        public string Type { get; set; }
        public bool BranchesCheck { get; set; }
        public bool Active { get; set; }
        public string? Action { get; set; }

    }

    public class UsersViewModel : UsersBaseModel {
       public Guid Id { get; set; }
       public string NormalizedName { get; set; } = "";
       public string BranchName { get; set; }
       public string Role { get; set; }
       public bool PermissionView{ get; set; }
       public bool PermissionAdd{ get; set; }
       public bool PermissionUpdate{ get; set; }
       public bool PermissionDelete{ get; set; }

    }

    public class UsersViewByIdModel : UsersBaseModel {
       public Guid Id { get; set; }
       public Guid BranchId { get; set; }
        public Guid RoleId { get; set; }
       public string HashPassword { get; set; }
       public string BranchName { get; set; }
       public string Role { get; set; }
       public DateTime PermitForm { get; set; }
       public DateTime PermitTo { get; set; }
       
    }

    public class UsersAddModel : UsersBaseModel {
       public Guid Id { get; set; }
       public string HashPassword { get; set; }
       public DateTime PermitForm { get; set; } 
       public DateTime PermitTo { get; set; }
       public Guid BranchId { get; set; }
       public Guid RoleId { get; set; }
    }
    
    public class UsersUpdateModel : UsersBaseModel {
       public Guid Id { get; set; }
       public string? HashPassword { get; set; }
       public DateTime PermitForm { get; set; }
       public DateTime PermitTo { get; set; }
       public Guid BranchId { get; set; }
       public Guid RoleId { get; set; }
    }

     public class UsersDeleteModel : UsersBaseModel {
       public Guid Id { get; set; }
    }
}