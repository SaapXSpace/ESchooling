namespace API.Views.Service
{
    public class ListOfViewServicesModel {
        public Guid Id { get; set; }
        public string? Name { get; set; }
    }

    public class CourseListOfViewServicesModel {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public double Fees { get; set; }
    }

    public class VoucherListOfViewServicesModel {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public double Fees { get; set; }
        public string Words { get; set; }
    }
}