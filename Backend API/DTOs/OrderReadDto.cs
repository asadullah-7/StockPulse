namespace IMS.DTOs
{
    public class OrderReadDto
    {
        public int OrderID { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public decimal TotalAmount {  get; set; }

        public string Status { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
    }
}
