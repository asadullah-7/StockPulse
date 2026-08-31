using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace IMS.Models
{
    public class Order : BaseEntity
    {
        [Key]
        public int OrderID { get; set; }

        public int CustID { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        public string Status { get; set; } = string.Empty;

        [ForeignKey("CustID")]
        public Customer? Customer { get; set; } // 👈 Fix: Removed '= new()' to stop auto-creating blank customers

        [JsonIgnore]
        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}