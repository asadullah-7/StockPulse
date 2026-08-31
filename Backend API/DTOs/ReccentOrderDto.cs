namespace IMS.DTOs
{
    public class ReccentOrderDto
    {
        public int OrderID { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public DateTime OrderDate { get; set; }
    }
}
