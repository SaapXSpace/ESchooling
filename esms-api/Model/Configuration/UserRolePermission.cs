using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using API.Models;

namespace API.Models
{
    [Table("UsersPermissions")]
    public partial class UsersPermissions
    {
        [Key]
        public Guid Id { get; set; } = new Guid();

        [Required]
        public bool Show_Permission { get; set; }=false;

        [Required]
        public bool Insert_Permission { get; set; }=false;

        [Required]
        public bool Update_Permission { get; set; }=false;

        [Required]
        public bool Delete_Permission { get; set; }=false;

        [Required]
        public bool Print_Permission { get; set; } =false;

        [Required]
        public bool Check_Permission { get; set; }=false;
        [Required]
        public bool Approve_Permission { get; set; }=false;
        
        [Required]
        public bool Allow_Permission { get; set; }=false;

        [Required]
        public Guid RoleId { get; set; }

        // Navigation Property
        [ForeignKey("RoleId")]
        public UserRole UserRoles { get; set; }

        [Required]
        public Guid MenuId { get; set; }
        // Navigation Property
        [ForeignKey("MenuId")]
        public MenuSubCategory MenuSubCategories { get; set; }

        [Required]
        public Guid UserId { get; set; }
        // Navigation Property
        [ForeignKey("UserId")]
        public User User { get; set; }

        [Required]
        [StringLength(1)]
        public string Type { get; set; }

        [Required]
        public bool Active { get; set; }

        [Required]
        [StringLength(1)]
        public string Action { get; set; }

        public Guid? UserIdInsert { get; set; }

        public DateTime? InsertDate { get; set; } = DateTime.Now;

        public Guid? UserIdUpdate { get; set; }

        public DateTime? UpdateDate { get; set; } = DateTime.Now;

        public Guid? UserIdDelete { get; set; }

        public DateTime? DeleteDate { get; set; } = DateTime.Now;
    }
}