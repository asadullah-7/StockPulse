 // Audit cols common class
namespace IMS.Models
{
    public class BaseEntity
    {
        public string created_by { get; set; } = "System";
        public DateTime created_at { get; set; } = DateTime.UtcNow;
        public string? updated_by { get; set; } = "System";
        public DateTime? updated_at { get; set; } = DateTime.UtcNow;


    }
}
