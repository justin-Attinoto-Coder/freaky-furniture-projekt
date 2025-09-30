using System.ComponentModel.DataAnnotations;

namespace FreakyFurnitureAPI.Models
{
    public class Customer
    {
        public int Id { get; set; }
        
        [Required]
        public string FullName { get; set; } = string.Empty;
        
        [Required]
        public string PhoneNumber { get; set; } = string.Empty;
        
        [Required]
        public string Province { get; set; } = string.Empty;
        
        [Required]
        public string City { get; set; } = string.Empty;
        
        [Required]
        public string StreetAddress { get; set; } = string.Empty;
        
        [Required]
        public string PostalCode { get; set; } = string.Empty;
    }
}