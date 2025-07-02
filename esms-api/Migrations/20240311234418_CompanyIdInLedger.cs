using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    public partial class CompanyIdInLedger : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CompanyId",
                table: "Ledger",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Ledger_CompanyId",
                table: "Ledger",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ledger_Company_CompanyId",
                table: "Ledger",
                column: "CompanyId",
                principalTable: "Company",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ledger_Company_CompanyId",
                table: "Ledger");

            migrationBuilder.DropIndex(
                name: "IX_Ledger_CompanyId",
                table: "Ledger");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Ledger");
        }
    }
}
