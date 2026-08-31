using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace IMS.Models
{
    public class Category:BaseEntity
    {
        [Key]
        public int CatID { get; set; }
        public string CatName { get; set; } = string.Empty;

        public string CatDescription { get; set; } = string.Empty;

        [JsonIgnore]
        public List<Product> Products { get; set; } = new();
    }
}
