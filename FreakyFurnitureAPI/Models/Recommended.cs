using System.ComponentModel.DataAnnotations;

namespace FreakyFurnitureAPI.Models
{
    public class Recommended
    {
        public int Id { get; set; }
        
        [Required]
        public int ProductId { get; set; }
        
        // Navigation property
        public Product? Product { get; set; }
    }
}