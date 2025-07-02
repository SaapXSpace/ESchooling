using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models {
    [Table ("Inventory")]
    public class Inventory {
        [Key]
        public Guid Id { get; set; } = new Guid ();
        [Required]
        public int Code { get; set; } 
        [Required]
        [StringLength (250)]
        //public string? Item { get; set; }

        public Guid Item { get; set; }
        [ForeignKey("Item")]
        public Asset Assets { get; set; }

        public string? Supplier { get; set; }
        public string? Description { get; set; }
        public string? Location { get; set; }
        public string? Status { get; set; }
        public int Qty { get; set; }
        public double? Price { get; set; }
        public double? Total { get; set; }
        public DateTime? PurchaseDate { get; set; }
        [Required]
        public bool Active { get; set; }
        public string? Action { get; set; }
        public Guid? UserIdInsert { get; set; }
        public DateTime? InsertDate { get; set; } = DateTime.Now;
        public Guid? UserIdUpdate { get; set; }
        public DateTime? UpdateDate { get; set; } = DateTime.Now;
        public Guid? UserIdDelete { get; set; }
        public DateTime? DeleteDate { get; set; } = DateTime.Now;

    }

    public class InventoryBaseModel {
        public Guid Id { get; set; } = new Guid ();
        public int Code { get; set; } 
        public Guid Item { get; set; }
        public string? ItemName { get; set; }
        public string? Supplier { get; set; }
        public string? Description { get; set; }
        public string? Location { get; set; }
        public string? Status { get; set; }
        public int Qty { get; set; }
        public double? Price { get; set; }
        public double? Total { get; set; }
        public DateTime? PurchaseDate { get; set; }
        [Required]
        public bool Active { get; set; }
        public string? Action { get; set; }
        public Guid? UserIdInsert { get; set; }
        public DateTime? InsertDate { get; set; } = DateTime.Now;
        public Guid? UserIdUpdate { get; set; }
        public DateTime? UpdateDate { get; set; } = DateTime.Now;
        public Guid? UserIdDelete { get; set; }
        public DateTime? DeleteDate { get; set; } = DateTime.Now;
        public int? LastCode { get; set; } 
        
        public Guid? User { get; set; } 

    }
}