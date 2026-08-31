using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IMS.Models
{
    public class OrderItem:BaseEntity
    {
        [Key]
        public int OrderItemID { get; set; }
        public int OrderID { get; set; }
        public int PID { get; set; }
        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal SubTotal { get; set; }

        [ForeignKey("OrderID")]
        public Order Order { get; set; } = null!;
        
        [ForeignKey("PID")]
        public Product Product { get; set; } = null!;
    }
}
