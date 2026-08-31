using IMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/Reports/SalesReport?fromDate=2026-01-01&toDate=2026-12-31
        [HttpGet("SalesReport")]
        public async Task<IActionResult> GetSalesReport([FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
        {
            var query = _context.Orders
                .Include(o => o.Customer)
                .AsQueryable();

            if (fromDate.HasValue) query = query.Where(o => o.created_at >= fromDate.Value);
            if (toDate.HasValue) query = query.Where(o => o.created_at <= toDate.Value);

            var report = await query
                .Select(o => new
                {
                    o.OrderID,
                    o.created_at,
                    CustomerName = o.Customer != null ? o.Customer.Name : "Walk-in Customer",
                    o.TotalAmount
                })
                .ToListAsync();

            var totalSalesValue = report.Sum(r => r.TotalAmount);

            return Ok(new
            {
                TotalOrders = report.Count,
                TotalSalesValue = totalSalesValue,
                Orders = report
            });
        }

        // 2. GET: api/Reports/LowStockReport
        [HttpGet("LowStockReport")]
        public async Task<IActionResult> GetLowStockReport()
        {
            var lowStockItems = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .Where(p => p.QtyInStock <= p.ReOrderThreshold)
                .Select(p => new
                {
                    p.PID,
                    p.Name,
                    p.QtyInStock,
                    p.ReOrderThreshold,
                    CategoryName = p.Category != null ? p.Category.CatName : string.Empty,
                    BrandName = p.Brand != null ? p.Brand.Name : string.Empty
                })
                .ToListAsync();

            return Ok(lowStockItems);
        }

        // 3. GET: api/Reports/TopSellingProducts
        [HttpGet("TopSellingProducts")]
        public async Task<IActionResult> GetTopSellingProducts([FromQuery] int top = 5)
        {
            var topProducts = await _context.OrderItems
                .Include(oi => oi.Product)
                .GroupBy(oi => new { oi.PID, oi.Product.Name })
                .Select(g => new
                {
                    ProductID = g.Key.PID,
                    ProductName = g.Key.Name,
                    TotalQuantitySold = g.Sum(x => x.Quantity),
                    TotalRevenue = g.Sum(x => x.Quantity * x.UnitPrice)
                })
                .OrderByDescending(x => x.TotalQuantitySold)
                .Take(top)
                .ToListAsync();

            return Ok(topProducts);
        }
    }
}