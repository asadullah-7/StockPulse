namespace IMS.DTOs
{
    // Read operations ke liye
    public class ProductReadDto
    {
        public int PID { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int QtyInStock { get; set; }
        public int ReOrderThreshold { get; set; }

        public string CategoryName { get; set; } = string.Empty;
        public string BrandName { get; set; } = string.Empty;
        public string SupplierName { get; set; } = string.Empty;
    }

    
}