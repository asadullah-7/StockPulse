using IMS.Data;
using IMS.DTOs;
using IMS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/Orders
        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.Customer)
                .OrderByDescending(o => o.created_at)
                .Select(o => new ReccentOrderDto
                {
                    OrderID = o.OrderID,
                    CustomerName = (o.Customer != null && !string.IsNullOrEmpty(o.Customer.Name))
                                   ? o.Customer.Name
                                   : "Walk-in Customer",
                    TotalAmount = o.TotalAmount,
                    OrderDate = o.created_at
                })
                .ToListAsync();

            return Ok(orders);
        }

        // 2. POST: api/Orders
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var customerExists = await _context.Customers.AnyAsync(c => c.CustID == dto.CustId);
                if (!customerExists)
                {
                    return BadRequest(new { message = $"Customer with ID {dto.CustId} does not exist." });
                }

                decimal calculatedTotal = 0;
                var orderItems = new List<OrderItem>();

                foreach (var item in dto.Items)
                {
                    var product = await _context.Products.FindAsync(item.PID);
                    if (product == null)
                        return BadRequest(new { message = $"Product ID {item.PID} not found." });

                    if (product.QtyInStock < item.Quantity)
                        return BadRequest(new { message = $"Insufficient stock for product '{product.Name}'." });

                    product.QtyInStock -= item.Quantity;

                    decimal itemSubTotal = product.Price * item.Quantity;
                    calculatedTotal += itemSubTotal;

                    orderItems.Add(new OrderItem
                    {
                        PID = item.PID,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price,
                        SubTotal = itemSubTotal
                    });
                }

                // Explicit Foreign Key Mapping Only
                var order = new Order
                {
                    CustID = dto.CustId,
                    created_at = DateTime.Now,
                    TotalAmount = calculatedTotal,
                    OrderItems = orderItems,
                    Customer = null // 👈 Strictly preventing EF Core graph insertion
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Order created successfully!", orderId = order.OrderID });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error processing order.", details = ex.Message });
            }
        }

        // 3. DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderItems)
                    .FirstOrDefaultAsync(o => o.OrderID == id);

                if (order == null) return NotFound(new { message = "Order not found." });

                foreach (var item in order.OrderItems)
                {
                    var product = await _context.Products.FindAsync(item.PID);
                    if (product != null)
                    {
                        product.QtyInStock += item.Quantity;
                    }
                }

                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = $"Order #{id} deleted and stock restored." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error deleting order.", details = ex.Message });
            }
        }
    }
}