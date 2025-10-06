using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using FreakyFurnitureAPI.Data;
using FreakyFurnitureAPI.Models;
using System.Security.Claims;

namespace FreakyFurnitureAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly FurnitureDbContext _context;
        private readonly ILogger<CustomersController> _logger;

        public CustomersController(FurnitureDbContext context, ILogger<CustomersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST /api/customers
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddCustomer([FromBody] Customer customer)
        {
            try
            {
                _logger.LogInformation("Adding customer: {@Customer}", customer);

                if (!ModelState.IsValid)
                {
                    return BadRequest(new { error = "Invalid customer data", details = ModelState });
                }

                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Customer added successfully with ID: {Id}", customer.Id);
                return Ok(new { message = "Customer information saved successfully", customerId = customer.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding customer");
                return StatusCode(500, new { error = "Failed to save customer information" });
            }
        }

        // GET /api/customers
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetCustomers()
        {
            try
            {
                var customers = await _context.Customers.ToListAsync();
                return Ok(customers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving customers");
                return StatusCode(500, new { error = "Failed to retrieve customers" });
            }
        }
    }
}