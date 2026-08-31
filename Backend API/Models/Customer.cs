using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace IMS.Models
{
    public class Customer: BaseEntity
    {
        [Key]
        public int CustID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;

        [JsonIgnore]
        public List<Order> Orders { get; set; } = new();
    }
}
