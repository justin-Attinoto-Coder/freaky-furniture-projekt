using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FreakyFurnitureAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddProductsAndCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UrlSlug = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Brand = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Price = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Sku = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    PublishingDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UrlSlug = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Size = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Dimensions = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Weight = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Material = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Specifications = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "CreatedAt", "Image", "Name", "UpdatedAt", "UrlSlug" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 9, 27, 16, 37, 58, 526, DateTimeKind.Utc).AddTicks(3457), null, "Sofas", new DateTime(2025, 9, 27, 16, 37, 58, 526, DateTimeKind.Utc).AddTicks(3715), "sofas" },
                    { 2, new DateTime(2025, 9, 27, 16, 37, 58, 526, DateTimeKind.Utc).AddTicks(3953), null, "Chairs", new DateTime(2025, 9, 27, 16, 37, 58, 526, DateTimeKind.Utc).AddTicks(3953), "chairs" },
                    { 3, new DateTime(2025, 9, 27, 16, 37, 58, 526, DateTimeKind.Utc).AddTicks(3955), null, "Tables", new DateTime(2025, 9, 27, 16, 37, 58, 526, DateTimeKind.Utc).AddTicks(3955), "tables" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Password", "Role", "Username" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 9, 27, 16, 37, 58, 755, DateTimeKind.Utc).AddTicks(9245), "$2a$11$xqjaOVVDwIb2SsvJiF9W6uTOwDStGVvfoKo1UewvDB3C4QkxvwQt.", "admin", "admin" },
                    { 2, new DateTime(2025, 9, 27, 16, 37, 58, 902, DateTimeKind.Utc).AddTicks(363), "$2a$11$v7Fb6/GbfJWgW7BAKIxDYeI4fPR6O1C1jhaYZNUTy4g4Ly61I3N9O", "user", "user" }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Brand", "CategoryId", "CreatedAt", "Description", "Dimensions", "Image", "Material", "Name", "Price", "PublishingDate", "Size", "Sku", "Specifications", "UpdatedAt", "UrlSlug", "Weight" },
                values: new object[,]
                {
                    { 1, "FreakyFurniture", 1, new DateTime(2025, 9, 27, 16, 37, 58, 902, DateTimeKind.Utc).AddTicks(7020), "A comfortable modern sofa perfect for any living room.", null, "/images/modern-sofa.jpg", null, "Modern Sofa", 899.99m, null, null, null, null, new DateTime(2025, 9, 27, 16, 37, 58, 902, DateTimeKind.Utc).AddTicks(7365), "modern-sofa", null },
                    { 2, "FreakyFurniture", 2, new DateTime(2025, 9, 27, 16, 37, 58, 902, DateTimeKind.Utc).AddTicks(7696), "Ergonomic office chair with lumbar support.", null, "/images/office-chair.jpg", null, "Office Chair", 299.99m, null, null, null, null, new DateTime(2025, 9, 27, 16, 37, 58, 902, DateTimeKind.Utc).AddTicks(7698), "office-chair", null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_UrlSlug",
                table: "Categories",
                column: "UrlSlug",
                unique: true,
                filter: "[UrlSlug] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_Sku",
                table: "Products",
                column: "Sku",
                unique: true,
                filter: "[Sku] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Products_UrlSlug",
                table: "Products",
                column: "UrlSlug",
                unique: true,
                filter: "[UrlSlug] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
