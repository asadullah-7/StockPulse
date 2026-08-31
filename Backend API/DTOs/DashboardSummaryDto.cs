namespace IMS.DTOs
{
    public class DashboardSummaryDto
    {
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public int TotalProducts { get; set; }
        public int TotalCustomers { get; set; }
        public int TotalSuppliers { get; set; }
        public int LowStockProductsCount { get; set; }
        public List<ReccentOrderDto> RecentOrders { get; set; } = new List<ReccentOrderDto>();
    }
}
