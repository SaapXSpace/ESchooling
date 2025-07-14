using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    [Table("Designation")]
    public partial class Designation
    {
        [Key]
        public Guid Id { get; set; } = new Guid();

        [Required]
        public string name { get; set; }

        [StringLength(250)]
        public string Description { get; set; }

        [Required]
        [StringLength(1)]
        public string Type { get; set; }

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
        public Guid? User { get; set; }

        public string? Code { get; set; }

    }
}
