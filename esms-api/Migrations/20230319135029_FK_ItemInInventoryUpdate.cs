using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    public partial class FK_ItemInInventoryUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "Item",
                table: "Inventory",
                type: "uniqueidentifier",
                maxLength: 250,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(250)",
                oldMaxLength: 250);

            migrationBuilder.CreateIndex(
                name: "IX_Inventory_Item",
                table: "Inventory",
                column: "Item");

            migrationBuilder.AddForeignKey(
                name: "FK_Inventory_Asset_Item",
                table: "Inventory",
                column: "Item",
                principalTable: "Asset",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Inventory_Asset_Item",
                table: "Inventory");

            migrationBuilder.DropIndex(
                name: "IX_Inventory_Item",
                table: "Inventory");

            migrationBuilder.AlterColumn<string>(
                name: "Item",
                table: "Inventory",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldMaxLength: 250);
        }
    }
}
