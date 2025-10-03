using System.ComponentModel.DataAnnotations;

namespace FreakyFurnitureAPI.Models
{
    public class Cart
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; } // ADD THIS LINE
        
        [Required]
        public int ProductId { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public decimal Price { get; set; }
        
        [Required]
        public int Quantity { get; set; }
        
        [Required]
        public string ImageURL { get; set; } = string.Empty;
        
        [Required]
        public string Brand { get; set; } = string.Empty;
        
        public string UrlSlug { get; set; } = string.Empty; // ADD THIS TOO
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // ADD THIS FOR TRACKING
        
        // Navigation properties
        public Product? Product { get; set; }
        public User? User { get; set; } // ADD THIS IF YOU HAVE A USER MODEL
    }
}