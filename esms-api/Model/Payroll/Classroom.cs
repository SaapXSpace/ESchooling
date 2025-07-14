using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    [Table("Classroom")]
    public partial class Classroom
    {
        [Key]
        public Guid Id { get; set; } = new Guid();

        [Required]
        public string Code { get; set; } 



        [Required]
        [StringLength(20)]
        public string RoomNumber { get; set; }

        [Required]
        [StringLength(50)]
        public string RoomType { get; set; }

        [Required]
        public int Capacity { get; set; }

        [Required]
        [StringLength(100)]
        public string Location { get; set; }

        public string? Action { get; set; }

        [Required]
        public bool Active { get; set; }

        public DateTime? CreatedAt { get; set; }

        public Guid? CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public Guid? UpdatedBy { get; set; }

        public DateTime? DeletedAt { get; set; }

        public Guid? DeletedBy { get; set; }


        // Optional non-mapped fields
        [NotMapped]
        public int? LastCode { get; set; }

        [NotMapped]
        public Guid? User { get; set; }
    }
}
