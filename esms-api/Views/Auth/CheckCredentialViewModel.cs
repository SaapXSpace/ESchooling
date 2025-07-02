using System.ComponentModel.DataAnnotations;

namespace API.Views.Shared
{
    
    public class LoginPayloadViewModel {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
        
        public string? Ip { get; set; }
        
        public string? Header { get; set; }
        

    }
}