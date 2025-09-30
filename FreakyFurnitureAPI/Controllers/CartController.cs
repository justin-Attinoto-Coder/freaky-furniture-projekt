using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FreakyFurnitureAPI.Data;
using FreakyFurnitureAPI.DTOs;
using FreakyFurnitureAPI.Models;

namespace FreakyFurnitureAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly FurnitureDbContext _context;
        private readonly ILogger<CartController> _logger; // Add this line

        public CartController(FurnitureDbContext context, ILogger<CartController> logger) // Add logger parameter
        {
            _context = context;
            _logger = logger; // Add this line
        }

        // GET /api/cart/{userId}
        [HttpGet("{userId}")]
        public IActionResult GetCartItems(int userId)
        {
            // If no database calls, remove async/Task
            return Ok(new { message = "Cart items retrieved" });
        }

        // POST /api/cart
        [HttpPost]
        public IActionResult AddToCart([FromBody] object cartItem)
        {
            // If no database calls, remove async/Task
            return Ok(new { message = "Item added to cart" });
        }

        // PUT /api/cart/{productId}
        [HttpPut("{productId}")]
        public IActionResult UpdateCartItem(int productId, UpdateCartItemDto updateCartItemDto)
        {
            // For now, return success response until cart functionality is implemented
            return NoContent();
        }

        // DELETE /api/cart/{productId}
        [HttpDelete("{productId}")]
        public IActionResult DeleteCartItem(int productId)
        {
            // For now, return success response until cart functionality is implemented
            return NoContent();
        }

        // DELETE /api/cart/clear
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            try
            {
                var cartItems = await _context.Cart.ToListAsync();
                if (cartItems.Any())
                {
                    _context.Cart.RemoveRange(cartItems);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Cleared {cartItems.Count} items from cart"); // Now this will work
                }

                return Ok(new { 
                    message = "Cart cleared successfully", 
                    itemsRemoved = cartItems.Count 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing cart"); // Now this will work
                return StatusCode(500, new { error = "Failed to clear cart" });
            }
        }
    }
}