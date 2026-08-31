using IMS.Data;
using IMS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CustomersController(AppDbContext context) => _context = context;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _context.Customers.ToListAsync());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound(new { message = $"Customer with {id} not found!" });

            return Ok(customer);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Customer customer)
        {
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = customer.CustID }, customer);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Customer customer)
        {
            if (id != customer.CustID) return BadRequest(new { message = "Id not found!!" });

            var existingCustomer = await _context.Customers.FindAsync(id);
            if (existingCustomer == null) return NotFound(new { message = $"Customer with id {id} not found" });

            existingCustomer.Name = customer.Name;
            existingCustomer.Phone = customer.Phone;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Customer updated successfully!" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null) return BadRequest(new { message = $"Customer with id {id} not found!!" });

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();
            return Ok(new { messge = "Customer deleted successfully!!" });
        }
    }
}