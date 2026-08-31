namespace IMS.DTOs
{
    public class StockTransactionReadDto
    {
        public int TID { get; set; }
        public int PID { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // e.g., "sale", "purchase"
        public int Qty { get; set; }
        public int? ReferenceID { get; set; }
        public DateTime TransactionDate { get; set; }
    }
}
