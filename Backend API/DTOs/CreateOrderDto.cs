namespace IMS.DTOs
{
    public class CreateOrderDto
    {
        public int CustId { get; set; }
        public List<CreateOrderItemDto> Items { get; set; } = new();
    }
}
