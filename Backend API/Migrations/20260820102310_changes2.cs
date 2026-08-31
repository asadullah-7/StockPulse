using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IMS.Migrations
{
    /// <inheritdoc />
    public partial class changes2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Brands_brandID",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Categories_catID",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Suppliers_supplierID",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "supplierID",
                table: "Suppliers",
                newName: "SupplierID");

            migrationBuilder.RenameColumn(
                name: "supplierID",
                table: "Products",
                newName: "SupplierID");

            migrationBuilder.RenameColumn(
                name: "catID",
                table: "Products",
                newName: "CatID");

            migrationBuilder.RenameColumn(
                name: "brandID",
                table: "Products",
                newName: "BrandID");

            migrationBuilder.RenameIndex(
                name: "IX_Products_supplierID",
                table: "Products",
                newName: "IX_Products_SupplierID");

            migrationBuilder.RenameIndex(
                name: "IX_Products_catID",
                table: "Products",
                newName: "IX_Products_CatID");

            migrationBuilder.RenameIndex(
                name: "IX_Products_brandID",
                table: "Products",
                newName: "IX_Products_BrandID");

            migrationBuilder.RenameColumn(
                name: "catName",
                table: "Categories",
                newName: "CatName");

            migrationBuilder.RenameColumn(
                name: "catDescription",
                table: "Categories",
                newName: "CatDescription");

            migrationBuilder.RenameColumn(
                name: "catID",
                table: "Categories",
                newName: "CatID");

            migrationBuilder.RenameColumn(
                name: "brandID",
                table: "Brands",
                newName: "BrandID");

            migrationBuilder.AddColumn<int>(
                name: "ReOrderThreshold",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Brands_BrandID",
                table: "Products",
                column: "BrandID",
                principalTable: "Brands",
                principalColumn: "BrandID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Categories_CatID",
                table: "Products",
                column: "CatID",
                principalTable: "Categories",
                principalColumn: "CatID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Suppliers_SupplierID",
                table: "Products",
                column: "SupplierID",
                principalTable: "Suppliers",
                principalColumn: "SupplierID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Products_Brands_BrandID",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Categories_CatID",
                table: "Products");

            migrationBuilder.DropForeignKey(
                name: "FK_Products_Suppliers_SupplierID",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ReOrderThreshold",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "SupplierID",
                table: "Suppliers",
                newName: "supplierID");

            migrationBuilder.RenameColumn(
                name: "SupplierID",
                table: "Products",
                newName: "supplierID");

            migrationBuilder.RenameColumn(
                name: "CatID",
                table: "Products",
                newName: "catID");

            migrationBuilder.RenameColumn(
                name: "BrandID",
                table: "Products",
                newName: "brandID");

            migrationBuilder.RenameIndex(
                name: "IX_Products_SupplierID",
                table: "Products",
                newName: "IX_Products_supplierID");

            migrationBuilder.RenameIndex(
                name: "IX_Products_CatID",
                table: "Products",
                newName: "IX_Products_catID");

            migrationBuilder.RenameIndex(
                name: "IX_Products_BrandID",
                table: "Products",
                newName: "IX_Products_brandID");

            migrationBuilder.RenameColumn(
                name: "CatName",
                table: "Categories",
                newName: "catName");

            migrationBuilder.RenameColumn(
                name: "CatDescription",
                table: "Categories",
                newName: "catDescription");

            migrationBuilder.RenameColumn(
                name: "CatID",
                table: "Categories",
                newName: "catID");

            migrationBuilder.RenameColumn(
                name: "BrandID",
                table: "Brands",
                newName: "brandID");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Brands_brandID",
                table: "Products",
                column: "brandID",
                principalTable: "Brands",
                principalColumn: "brandID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Categories_catID",
                table: "Products",
                column: "catID",
                principalTable: "Categories",
                principalColumn: "catID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Suppliers_supplierID",
                table: "Products",
                column: "supplierID",
                principalTable: "Suppliers",
                principalColumn: "supplierID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
