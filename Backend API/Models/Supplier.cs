using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace IMS.Models
{
    public class Supplier:BaseEntity
    {
        [Key]
        public int SupplierID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string DealsIn { get; set; } = string.Empty; 
        [JsonIgnore]
        public List<Product> Products { get; set; } = new();
    
    }
}
