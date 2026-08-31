namespace IMS.DTOs
{
    public class LowStockProductDto
    {
        public int PID { get; set; }
        public string Name { get; set; } = string.Empty;
        public int QtyInStock { get; set; }
        public int ReOrderThreshold { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string SupplierName { get; set; } = string.Empty;
    }
}
