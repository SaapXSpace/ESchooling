namespace API.Views.Shared
{

    public class UserLoginViewModel {
        public String User { get; set; }
        public String Role { get; set; }
        public String Department { get; set; }
        public string? IP { get; set; }
        public string? Mac { get; set; }
        public string? PC { get; set; }
        public DateTime? Date { get; set; }
    }
}