using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    public partial class AddColumnHeadIdInLedger : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "HeadId",
                table: "Ledger",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Ledger_HeadId",
                table: "Ledger",
                column: "HeadId");

            migrationBuilder.AddForeignKey(
                name: "FK_Ledger_AccountHead_HeadId",
                table: "Ledger",
                column: "HeadId",
                principalTable: "AccountHead",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ledger_AccountHead_HeadId",
                table: "Ledger");

            migrationBuilder.DropIndex(
                name: "IX_Ledger_HeadId",
                table: "Ledger");

            migrationBuilder.DropColumn(
                name: "HeadId",
                table: "Ledger");
        }
    }
}
