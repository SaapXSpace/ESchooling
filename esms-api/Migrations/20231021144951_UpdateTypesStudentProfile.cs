using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    public partial class UpdateTypesStudentProfile : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DocPath",
                table: "StudentDocuments");

            migrationBuilder.AlterColumn<byte[]>(
                name: "ProfileImage",
                table: "StudentProfile",
                type: "varbinary(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<byte[]>(
                name: "Image",
                table: "StudentDocuments",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Image",
                table: "StudentDocuments");

            migrationBuilder.AlterColumn<string>(
                name: "ProfileImage",
                table: "StudentProfile",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(byte[]),
                oldType: "varbinary(max)");

            migrationBuilder.AddColumn<string>(
                name: "DocPath",
                table: "StudentDocuments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
