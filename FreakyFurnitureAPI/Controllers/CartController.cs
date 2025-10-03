using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using FreakyFurnitureAPI.Data;
using FreakyFurnitureAPI.DTOs;
using FreakyFurnitureAPI.Models;
using System.Security.Claims;

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

        // GET /api/cart
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetCartItems()
        {
            try
            {
                var userId = GetCurrentUserId();
                _logger.LogInformation($"Getting cart items for user {userId}");

                var cartItems = await _context.Cart
                    .Where(c => c.UserId == userId)
                    .Include(c => c.Product)
                    .Select(c => new
                    {
                        id = c.Id,
                        productId = c.ProductId,
                        name = c.Name, // Use cart name or product name
                        price = c.Price,
                        quantity = c.Quantity,
                        imageURL = c.ImageURL,
                        brand = c.Brand,
                        urlSlug = c.UrlSlug
                    })
                    .ToListAsync();

                _logger.LogInformation($"Found {cartItems.Count} cart items for user {userId}");
                return Ok(cartItems);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving cart items");
                return StatusCode(500, new { error = "Failed to retrieve cart items" });
            }
        }

        // POST /api/cart
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> AddToCart([FromBody] AddCartItemRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                _logger.LogInformation($"Adding cart item for user {userId}: Product {request.ProductId}");

                // Check if product exists
                var product = await _context.Products.FindAsync(request.ProductId);
                if (product == null)
                {
                    return BadRequest(new { error = "Product not found" });
                }

                // Check if item already exists in cart
                var existingItem = await _context.Cart
                    .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == request.ProductId);

                if (existingItem != null)
                {
                    // Update quantity
                    existingItem.Quantity += request.Quantity;
                    _logger.LogInformation($"Updated existing cart item quantity to {existingItem.Quantity}");
                }
                else
                {
                    // Add new item
                    var cartItem = new Cart
                    {
                        UserId = userId,
                        ProductId = request.ProductId,
                        Name = request.Name,
                        Price = request.Price,
                        Quantity = request.Quantity,
                        ImageURL = request.ImageURL,
                        Brand = request.Brand,
                        UrlSlug = request.UrlSlug
                    };
                    _context.Cart.Add(cartItem);
                    _logger.LogInformation($"Added new cart item for product {request.ProductId}");
                }

                await _context.SaveChangesAsync();
                
                return Ok(new { message = "Item added to cart" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding cart item");
                return StatusCode(500, new { error = "Failed to add cart item" });
            }
        }

        // PUT /api/cart/{productId}
        [HttpPut("{productId}")]
        [Authorize]
        public async Task<IActionResult> UpdateCartItem(int productId, [FromBody] UpdateCartItemRequest request)
        {
            try
            {
                var userId = GetCurrentUserId();
                var cartItem = await _context.Cart
                    .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

                if (cartItem == null)
                {
                    return NotFound(new { error = "Cart item not found" });
                }

                if (request.Quantity <= 0)
                {
                    _context.Cart.Remove(cartItem);
                }
                else
                {
                    cartItem.Quantity = request.Quantity;
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Cart item updated" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating cart item");
                return StatusCode(500, new { error = "Failed to update cart item" });
            }
        }

        // DELETE /api/cart/{productId}
        [HttpDelete("{productId}")]
        [Authorize]
        public async Task<IActionResult> DeleteCartItem(int productId)
        {
            try
            {
                var userId = GetCurrentUserId();
                var cartItem = await _context.Cart
                    .FirstOrDefaultAsync(c => c.UserId == userId && c.ProductId == productId);

                if (cartItem == null)
                {
                    return NotFound(new { error = "Cart item not found" });
                }

                _context.Cart.Remove(cartItem);
                await _context.SaveChangesAsync();
                
                return Ok(new { message = "Cart item deleted" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting cart item");
                return StatusCode(500, new { error = "Failed to delete cart item" });
            }
        }

        // DELETE /api/cart/clear
        [HttpDelete("clear")]
        [Authorize]
        public async Task<IActionResult> ClearCart()
        {
            try
            {
                var userId = GetCurrentUserId();
                var cartItems = await _context.Cart
                    .Where(c => c.UserId == userId)
                    .ToListAsync();
                
                if (cartItems.Any())
                {
                    _context.Cart.RemoveRange(cartItems);
                    await _context.SaveChangesAsync();
                    _logger.LogInformation($"Cleared {cartItems.Count} items from cart for user {userId}");
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

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim ?? "1"); // Default to user 1 for testing
        }
    }

    // Request models
    public class AddCartItemRequest
    {
        public int ProductId { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string ImageURL { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string UrlSlug { get; set; } = string.Empty;
    }

    public class UpdateCartItemRequest
    {
        public int Quantity { get; set; }
    }
}