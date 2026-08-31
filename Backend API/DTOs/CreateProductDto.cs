namespace IMS.DTOs
{
    public class CreateProductDto
    {
        // Create / Add Product ke liye
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int QtyInStock { get; set; }
        public int ReOrderThreshold { get; set; }

        public int CatID { get; set; }
        public int BrandID { get; set; }
        public int SupplierID { get; set; }
    }
}

