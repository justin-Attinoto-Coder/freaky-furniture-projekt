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
    public class ShippingDetailsController : ControllerBase
    {
        private readonly FurnitureDbContext _context;
        private readonly ILogger<ShippingDetailsController> _logger;

        public ShippingDetailsController(FurnitureDbContext context, ILogger<ShippingDetailsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // POST /api/shipping-details
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddShippingDetails([FromBody] ShippingDetails shippingDetails)
        {
            try
            {
                _logger.LogInformation("Adding shipping details: {@ShippingDetails}", shippingDetails);

                if (!ModelState.IsValid)
                {
                    return BadRequest(new { error = "Invalid shipping details data", details = ModelState });
                }

                _context.ShippingDetails.Add(shippingDetails);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Shipping details saved successfully with ID: {Id}", shippingDetails.Id);
                return Ok(new { message = "Shipping details saved successfully", shippingDetailsId = shippingDetails.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving shipping details");
                return StatusCode(500, new { error = "Failed to save shipping details" });
            }
        }

        // GET /api/shipping-details
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetShippingDetails()
        {
            try
            {
                var shippingDetails = await _context.ShippingDetails.ToListAsync();
                return Ok(shippingDetails);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving shipping details");
                return StatusCode(500, new { error = "Failed to retrieve shipping details" });
            }
        }
    }
}