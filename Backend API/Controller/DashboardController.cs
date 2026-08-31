using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IMS.Data;
using IMS.DTOs;

namespace IMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Dashboard/Summary
        [HttpGet("Summary")]
        public async Task<ActionResult<DashboardSummaryDto>> GetSummary()
        {
            // 1. Total Revenue (Sum of all orders total amount)
            var totalRevenue = await _context.Orders
                .SumAsync(o => (decimal?)o.TotalAmount) ?? 0;

            // 2. Total Counts
            var totalOrders = await _context.Orders.CountAsync();
            var totalProducts = await _context.Products.CountAsync();
            var totalCustomers = await _context.Customers.CountAsync();
            var totalSuppliers = await _context.Suppliers.CountAsync();

            // 3. Low Stock Count (Products below or equal to their threshold)
            var lowStockCount = await _context.Products
                .Where(p => p.QtyInStock <= p.ReOrderThreshold)
                .CountAsync();

            // 4. Top 5 Recent Orders
            var recentOrders = await _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.created_at)
                .Take(5)
                .Select(o => new ReccentOrderDto
                {
                    OrderID = o.OrderID,
                    CustomerName = o.Customer != null ? o.Customer.Name : "Walk-in Customer",
                    TotalAmount = o.TotalAmount,
                    OrderDate = o.created_at
                })
                .ToListAsync();

            var summary = new DashboardSummaryDto
            {
                TotalRevenue = totalRevenue,
                TotalOrders = totalOrders,
                TotalProducts = totalProducts,
                TotalCustomers = totalCustomers,
                TotalSuppliers = totalSuppliers,
                LowStockProductsCount = lowStockCount,
                RecentOrders = recentOrders
            };

            return Ok(summary);
        }
    }
}