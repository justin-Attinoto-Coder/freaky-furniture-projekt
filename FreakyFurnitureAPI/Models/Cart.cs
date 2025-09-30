using System.ComponentModel.DataAnnotations;

namespace FreakyFurnitureAPI.Models
{
    public class Cart
    {
        public int Id { get; set; }
        
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
        
        // Navigation property
        public Product? Product { get; set; }
    }
}