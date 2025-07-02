namespace API.Views.Shared
{

    public class LoginResponseViewModel {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string BranchName { get; set; }
        public string Role { get; set; }
        public string Contact { get; set; }
    }

    public class UserLoginInfoViewModel {
        public Guid BranchId { get; set; }
        public Guid CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string BranchName { get; set; }
    }
}