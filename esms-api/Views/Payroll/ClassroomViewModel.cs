using System;
using System.ComponentModel.DataAnnotations;

namespace API.Views.Shared
{
    public class ClassroomBaseModel
    {

        public string Code { get; set; }

        [Required]
        public string RoomNumber { get; set; }
       
        public string RoomType { get; set; }
       
        public int Capacity { get; set; }
     
        public string Location { get; set; }

     
   
        public bool Active { get; set; }
    }

    public class ClassroomViewModel : ClassroomBaseModel
    {
        public Guid Id { get; set; }

        public DateTime CreatedAt { get; set; }
        public Guid CreatedBy { get; set; }

        public DateTime? UpdatedAt { get; set; }
        public Guid? UpdatedBy { get; set; }

        public DateTime? DeletedAt { get; set; }
        public Guid? DeletedBy { get; set; }

        // Optional: Permissions (if you want to include like Department)
        public bool PermissionView { get; set; }
        public bool PermissionAdd { get; set; }
        public bool PermissionUpdate { get; set; }
        public bool PermissionDelete { get; set; }
    }

    public class ClassroomViewByIdModel : ClassroomBaseModel
    {
        public Guid Id { get; set; }
    }

    public class ClassroomAddModel : ClassroomBaseModel
    {
        public Guid Id { get; set; }

    }

    public class ClassroomUpdateModel : ClassroomBaseModel
    {
        public Guid Id { get; set; }

    }

    public class ClassroomDeleteModel : ClassroomBaseModel
    {
        public Guid Id { get; set; }

    }
}
