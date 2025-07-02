using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models {
    [Table ("Asset")]
    public class Asset {
        [Key]
        public Guid Id { get; set; } = new Guid ();
        [Required]
        public int Code { get; set; } 
        [Required]
        [StringLength (250)]
        public string? Name { get; set; }
        public Guid Type { get; set; }
        [ForeignKey("Type")]
        public AssetType AssetTypes { get; set; }
        public Guid Location { get; set; }
        [ForeignKey("Location")]
        public Locations Locations { get; set; }
        public string? Description { get; set; }
        public string? Status { get; set; }
        public double? Price { get; set; }
        public DateTime? ProcurementDate { get; set; }
        [Required]
        public bool Active { get; set; }
        public string? Action { get; set; }
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

    public class AssetBaseModel {
        public Guid Id { get; set; } = new Guid ();
        public int Code { get; set; } 
        public string? Name { get; set; }
        public Guid TypeId { get; set; }
        public string? Type { get; set; }
        public Guid LocationId { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
        public double? Price { get; set; }
        public DateTime? ProcurementDate { get; set; }
        public bool Active { get; set; }
        public int? LastCode { get; set; } 
        public Guid? User { get; set; } 

    }
}