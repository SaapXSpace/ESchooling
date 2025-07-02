using System;
namespace API.Views.Shared
{
    
    public class DashboardCardVireModel {
        public int TotalVisitor { get; set; }
        public int TotalUser { get; set; }
        public int TotalActiveUser { get; set; }
        public int TotalInActiveUser { get; set; }
        public int TotalAsset { get; set; }
        public int TotalActiveAsset { get; set; }
        public int TotalInActiveAsset { get; set; }
    }

    public class DashboardRequestViewModel {
        public string? AssetName { get; set; }
        public string? RequestType { get; set; }
        public string? RequestUser { get; set; }
        public DateTime? RequestDate { get; set; }
        public bool? Approved { get; set; }
        public string? RequestStatus { get; set; }
        public string? Remarks { get; set; }
        public string? ApprovedByName { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public string? AssignUser { get; set; }
    }
}