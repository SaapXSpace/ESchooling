using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    public partial class UpdateAsset : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PurchaseDate",
                table: "Asset",
                newName: "ProcurementDate");

            migrationBuilder.AlterColumn<Guid>(
                name: "Type",
                table: "Asset",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "Location",
                table: "Asset",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Asset_Location",
                table: "Asset",
                column: "Location");

            migrationBuilder.CreateIndex(
                name: "IX_Asset_Type",
                table: "Asset",
                column: "Type");

            migrationBuilder.AddForeignKey(
                name: "FK_Asset_AssetType_Type",
                table: "Asset",
                column: "Type",
                principalTable: "AssetType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Asset_Locations_Location",
                table: "Asset",
                column: "Location",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Asset_AssetType_Type",
                table: "Asset");

            migrationBuilder.DropForeignKey(
                name: "FK_Asset_Locations_Location",
                table: "Asset");

            migrationBuilder.DropIndex(
                name: "IX_Asset_Location",
                table: "Asset");

            migrationBuilder.DropIndex(
                name: "IX_Asset_Type",
                table: "Asset");

            migrationBuilder.RenameColumn(
                name: "ProcurementDate",
                table: "Asset",
                newName: "PurchaseDate");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "Asset",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AlterColumn<string>(
                name: "Location",
                table: "Asset",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");
        }
    }
}
