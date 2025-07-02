using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models {
    [Table ("MenuCategory")]
    public class MenuCategory {

        [Key]
        public Guid Id { get; set; } = new Guid ();

        [Required]
        public string Code { get; set; } 

        [Required]
        [StringLength (250)]
        public string Name { get; set; }

        public string Icon { get; set; }
        
        [Required]
        [StringLength(1)]
        public string Type { get; set; }

        [Required]
        public bool Active { get; set; }

        public string? Action { get; set; }

        public Guid CompanyId { get; set; }
        [ForeignKey("CompanyId")]
        public Company Companies { get; set; }
        
        public Guid? UserIdInsert { get; set; }

        public DateTime? InsertDate { get; set; } 

        public Guid? UserIdUpdate { get; set; }

        public DateTime? UpdateDate { get; set; } 

        public Guid? UserIdDelete { get; set; }

        public DateTime? DeleteDate { get; set; } 

        [NotMapped]
        public int? LastCode { get; set; } 

        [NotMapped]
        public Guid? User { get; set; } 
    }



}