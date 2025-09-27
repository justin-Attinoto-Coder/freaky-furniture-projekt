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

        public CartController(FurnitureDbContext context)
        {
            _context = context;
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
    }
}