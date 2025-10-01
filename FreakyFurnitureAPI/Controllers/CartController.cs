using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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
        private readonly ILogger<CartController> _logger;

        public CartController(FurnitureDbContext context, ILogger<CartController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // ADD THIS: GET /api/cart (what your Angular service is calling)
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetCartItems()
        {
            try
            {
                // For now, return empty cart - you can implement proper cart logic later
                var cartItems = new List<object>();
                
                _logger.LogInformation("Cart items retrieved successfully");
                return Ok(cartItems);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving cart items");
                return StatusCode(500, new { error = "Failed to retrieve cart items" });
            }
        }

        // KEEP THIS: GET /api/cart/{userId}
        [HttpGet("{userId}")]
        public IActionResult GetCartItems(int userId)
        {
            return Ok(new { message = "Cart items retrieved" });
        }

        // POST /api/cart
        [HttpPost]
        public IActionResult AddToCart([FromBody] object cartItem)
        {
            return Ok(new { message = "Item added to cart" });
        }

        // PUT /api/cart/{productId}
        [HttpPut("{productId}")]
        public IActionResult UpdateCartItem(int productId, UpdateCartItemDto updateCartItemDto)
        {
            return NoContent();
        }

        // DELETE /api/cart/{productId}
        [HttpDelete("{productId}")]
        public IActionResult DeleteCartItem(int productId)
        {
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
                    _logger.LogInformation($"Cleared {cartItems.Count} items from cart");
                }

                return Ok(new { 
                    message = "Cart cleared successfully", 
                    itemsRemoved = cartItems.Count 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error clearing cart");
                return StatusCode(500, new { error = "Failed to clear cart" });
            }
        }
    }
}