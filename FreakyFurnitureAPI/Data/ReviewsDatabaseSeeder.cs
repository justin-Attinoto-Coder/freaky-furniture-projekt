using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;
using FreakyFurnitureAPI.Models;

namespace FreakyFurnitureAPI.Data
{
    public static class ReviewsDatabaseSeeder
    {
        public static void Seed(FurnitureDbContext context, ILogger logger)
        {
            // Only seed if there are products and no reviews
            if (!context.Products.Any() || context.Reviews.Any())
            {
                logger.LogInformation("ℹ️  Skipping review seeding: products missing or reviews already exist.");
                return;
            }

            var products = context.Products.ToList();
            var random = new Random();
            var reviewTexts = new[]
            {
                "Amazing quality!", "Very comfortable.", "Would buy again.", "Highly recommended.",
                "Not as expected.", "Great value for money.", "Stylish and modern.", "Fast delivery."
            };
            var reviewerNames = new[] { "Alice", "Bob", "Charlie", "Diana", "Eve", "Frank" };

            var reviews = new List<Review>();
            foreach (var product in products)
            {
                for (int i = 0; i < 4; i++)
                {
                    reviews.Add(new Review
                    {
                        ProductId = product.Id,
                        Rating = random.Next(3, 6), // Ratings 3-5
                        ReviewText = reviewTexts[random.Next(reviewTexts.Length)],
                        ReviewerName = reviewerNames[random.Next(reviewerNames.Length)],
                        CreatedAt = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                        IsSeeded = true
                    });
                }
            }
            context.Reviews.AddRange(reviews);
            context.SaveChanges();
            logger.LogInformation($"✅ {reviews.Count} reviews seeded for products");
        }
    }
}
