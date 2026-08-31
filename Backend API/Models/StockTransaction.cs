using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IMS.Models
{
    public class StockTransaction:BaseEntity
    {
        [Key]
        public int TID { get; set; }
        public int PID { get; set; }
        public string Type { get; set; } = string.Empty;
        public int Qty { get; set; }

        public int? ReferenceID { get; set; }

        [ForeignKey("PID")]
        public Product Product { get; set; } = new();
    }
}
