using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using IMS.Data;
using IMS.Models;

namespace IMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuppliersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SuppliersController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Suppliers
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.Suppliers.ToListAsync());
        }

        // GET: api/Suppliers/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var supplier = await _context.Suppliers.FindAsync(id);
            if (supplier == null) return NotFound(new { message = $"Supplier with ID {id} not found." });

            return Ok(supplier);
        }

        // POST: api/Suppliers
        [HttpPost]
        public async Task<IActionResult> Create(Supplier supplier)
        {
            _context.Suppliers.Add(supplier);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = supplier.SupplierID }, supplier);
        }

        // PUT: api/Suppliers/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Supplier supplier)
        {
            if (id != supplier.SupplierID) return BadRequest(new { message = "ID mismatch." });

            var existingSupplier = await _context.Suppliers.FindAsync(id);
            if (existingSupplier == null) return NotFound(new { message = $"Supplier with ID {id} not found." });

            existingSupplier.Name = supplier.Name;
            existingSupplier.Phone = supplier.Phone;
            existingSupplier.DealsIn = supplier.DealsIn;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Supplier updated successfully!", supplier = existingSupplier });
        }

        // DELETE: api/Suppliers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var supplier = await _context.Suppliers.FindAsync(id);
            if (supplier == null) return NotFound(new { message = $"Supplier with ID {id} not found." });

            _context.Suppliers.Remove(supplier);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"Supplier with ID {id} deleted successfully." });
        }
    }
}