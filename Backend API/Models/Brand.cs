using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace IMS.Models
{
    public class Brand:BaseEntity
    {
        [Key]
        public int BrandID { get; set; }
        public string Name { get; set; } = string.Empty;

        [JsonIgnore]
        public List<Product> Products { get; set; } = new();
    }
}
