using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FreakyFurnitureAPI.Data;
using FreakyFurnitureAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<FurnitureDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey is missing");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
        };
    });

builder.Services.AddAuthorization();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyHeader()
               .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// IMPORTANT: Add this to serve static files from wwwroot
app.UseStaticFiles();

app.UseCors();
app.UseAuthorization();
app.MapControllers();

// Create database and seed users
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<FurnitureDbContext>();
    
    try
    {
        // Force recreate database to ensure all tables exist
        Console.WriteLine("🔄 Recreating database...");
        context.Database.EnsureDeleted(); // Delete existing database
        context.Database.EnsureCreated(); // Create fresh database with all tables
        Console.WriteLine("✅ Database recreated successfully");
        
        // Now seed the data...
        // Seed admin user if none exists
        if (!context.Users.Any())
        {
            var adminUser = new User
            {
                Username = "admin",
                Password = BCrypt.Net.BCrypt.HashPassword("admin", 10),
                Role = "admin",
                CreatedAt = DateTime.UtcNow
            };
            
            var testUser = new User
            {
                Username = "user",
                Password = BCrypt.Net.BCrypt.HashPassword("password", 10),
                Role = "user",
                CreatedAt = DateTime.UtcNow
            };
            
            context.Users.AddRange(adminUser, testUser);
            context.SaveChanges();
            
            Console.WriteLine("✅ Seed users created successfully:");
            Console.WriteLine("   Admin: admin/admin");
            Console.WriteLine("   User: user/password");
        }
        else
        {
            Console.WriteLine("ℹ️  Users already exist in database");
        }

        // Seed categories if none exist
        if (!context.Categories.Any())
        {
            var categories = new List<Category>
            {
                new Category { Name = "Möbler", UrlSlug = "mobler", Image = "/images/categories/mobler.jpg" },
                new Category { Name = "Förvaring", UrlSlug = "forvaring", Image = "/images/categories/forvaring.jpg" },
                new Category { Name = "Belysning", UrlSlug = "belysning", Image = "/images/categories/belysning.jpg" },
                new Category { Name = "Textilier", UrlSlug = "textilier", Image = "/images/categories/textilier.jpg" },
                new Category { Name = "Dekoration", UrlSlug = "dekoration", Image = "/images/categories/dekoration.jpg" }
            };
            
            context.Categories.AddRange(categories);
            context.SaveChanges();
            Console.WriteLine($"✅ {categories.Count} categories created successfully");
        }

        // Seed products if none exist
        if (!context.Products.Any())
        {
            var moblerCategory = context.Categories.FirstOrDefault(c => c.UrlSlug == "mobler");
            var forvaringCategory = context.Categories.FirstOrDefault(c => c.UrlSlug == "forvaring");
            var belysningCategory = context.Categories.FirstOrDefault(c => c.UrlSlug == "belysning");

            var sampleProducts = new List<Product>
            {
                new Product
                {
                    Name = "Modern Sectional Sofa",
                    Brand = "ComfortHome",
                    Price = 1299.99m,
                    Description = "A spacious and comfortable sectional sofa perfect for modern living rooms",
                    CategoryId = moblerCategory?.Id,
                    Sku = "SOF001",
                    UrlSlug = "modern-sectional-sofa",
                    Image = "/images/products/sectional-sofa.jpg",
                    Size = "Large",
                    Dimensions = "300cm x 200cm x 85cm",
                    Weight = "75kg",
                    Material = "Fabric, Wood Frame",
                    Specifications = "3-seater sectional with chaise lounge",
                    PublishingDate = DateTime.UtcNow.AddDays(-30)
                },
                new Product
                {
                    Name = "Oak Dining Table",
                    Brand = "WoodCraft",
                    Price = 899.99m,
                    Description = "Solid oak dining table that seats up to 6 people comfortably",
                    CategoryId = moblerCategory?.Id,
                    Sku = "TAB001",
                    UrlSlug = "oak-dining-table",
                    Image = "/images/products/oak-table.jpg",
                    Size = "Medium",
                    Dimensions = "180cm x 90cm x 75cm",
                    Weight = "45kg",
                    Material = "Solid Oak Wood",
                    Specifications = "Extendable to 220cm, seats 6-8",
                    PublishingDate = DateTime.UtcNow.AddDays(-25)
                },
                new Product
                {
                    Name = "Storage Cabinet",
                    Brand = "OrganizeIt",
                    Price = 449.99m,
                    Description = "Multi-compartment storage cabinet with modern design",
                    CategoryId = forvaringCategory?.Id,
                    Sku = "CAB001",
                    UrlSlug = "storage-cabinet",
                    Image = "/images/products/storage-cabinet.jpg",
                    Size = "Medium",
                    Dimensions = "120cm x 40cm x 180cm",
                    Weight = "35kg",
                    Material = "MDF, Metal Handles",
                    Specifications = "4 shelves, 2 drawers, adjustable shelving",
                    PublishingDate = DateTime.UtcNow.AddDays(-20)
                },
                new Product
                {
                    Name = "Pendant Light Fixture",
                    Brand = "LightUp",
                    Price = 189.99m,
                    Description = "Elegant pendant light perfect for dining areas",
                    CategoryId = belysningCategory?.Id,
                    Sku = "LIG001",
                    UrlSlug = "pendant-light-fixture",
                    Image = "/images/products/pendant-light.jpg",
                    Size = "Small",
                    Dimensions = "30cm diameter x 25cm height",
                    Weight = "2kg",
                    Material = "Glass, Metal",
                    Specifications = "E27 bulb, max 60W, dimmable",
                    PublishingDate = DateTime.UtcNow.AddDays(-15)
                }
            };
            
            context.Products.AddRange(sampleProducts);
            context.SaveChanges();
            
            Console.WriteLine($"✅ {sampleProducts.Count} sample products created successfully");
        }
        else
        {
            Console.WriteLine("ℹ️  Products already exist in database");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Error seeding database: {ex.Message}");
    }
}

Console.WriteLine("🚀 API Server starting...");
app.Run();
