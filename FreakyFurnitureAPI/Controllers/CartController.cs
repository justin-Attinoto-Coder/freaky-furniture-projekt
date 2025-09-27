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

        // GET /api/cart
        [HttpGet]
        public async Task<ActionResult<List<CartItemDto>>> GetCartItems()
        {
            // For now, return empty array until cart functionality is implemented
            return Ok(new List<CartItemDto>());
        }

        // POST /api/cart
        [HttpPost]
        public async Task<ActionResult<object>> AddCartItem(AddCartItemDto addCartItemDto)
        {
            // For now, return success response until cart functionality is implemented
            return Ok(new { id = 1, message = "Cart item added (placeholder)" });
        }

        // PUT /api/cart/{productId}
        [HttpPut("{productId}")]
        public async Task<IActionResult> UpdateCartItem(int productId, UpdateCartItemDto updateCartItemDto)
        {
            // For now, return success response until cart functionality is implemented
            return NoContent();
        }

        // DELETE /api/cart/{productId}
        [HttpDelete("{productId}")]
        public async Task<IActionResult> DeleteCartItem(int productId)
        {
            // For now, return success response until cart functionality is implemented
            return NoContent();
        }
    }
}