using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace IMS.Models
{
    public class Product:BaseEntity
    {
        [Key]
        public int PID { get; set; }
        public string Name { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public int ReOrderThreshold { get; set; }
        public int QtyInStock { get; set; }

        // Foreign keys
        public int CatID { get; set; }
        public int BrandID { get; set; }
        public int SupplierID { get; set; }

        [ForeignKey("CatID")]
        public Category Category { get; set; } = null!;
        [ForeignKey("BrandID")]
        public Brand Brand { get; set; } = null!;
        [ForeignKey("SupplierID")]
        public Supplier Supplier { get; set; } = null!;

        [JsonIgnore]
        public List<OrderItem> OrderItems { get; set; } = new();
        [JsonIgnore]
        public List<StockTransaction> StockTransactions { get; set; } = new();


    }
}
