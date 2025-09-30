using System.ComponentModel.DataAnnotations;

namespace FreakyFurnitureAPI.Models
{
    public class PaymentDetails
    {
        public int Id { get; set; }
        
        [Required]
        public string CardHolderName { get; set; } = string.Empty;
        
        [Required]
        public string CardNumber { get; set; } = string.Empty; // Should be encrypted in production
        
        [Required]
        public string ExpiryDate { get; set; } = string.Empty;
        
        [Required]
        public string Cvv { get; set; } = string.Empty; // Should be encrypted in production
    }
}