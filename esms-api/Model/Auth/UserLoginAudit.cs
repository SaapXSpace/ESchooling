using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models {
    [Table ("UserLoginAudit")]
    public partial class UserLoginAudit {

        [Key]
        public Guid Id { get; set; } = new Guid ();
        
        [Required]
        public string Key { get; set; }

        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public User Users { get; set; }

        public string? Header { get; set; }

        public string? Ip { get; set; }

        public string? PC { get; set; }
        
        [Required]
        public bool Status { get; set; } = false;

        [Required]
        public DateTime LoginDate { get; set; } = Convert.ToDateTime(DateTime.Now.ToString("dd-MMM-yyyy HH:mm:ss"));
        public DateTime LogoutDate { get; set; }
        public Guid? EmployeeId { get; set; }

        [Required]
        public Guid CompanyId { get; set; }
        // Navigation Property
        [ForeignKey("CompanyId")]
        public Company Companies { get; set; }

        [Required]
        public Guid BranchId { get; set; }
        // Navigation Property
        [ForeignKey("BranchId")]
        public Branch Branches { get; set; }
        
    }
}