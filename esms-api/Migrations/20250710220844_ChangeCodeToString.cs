using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    public partial class ChangeCodeToString : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CNIC",
                table: "Teacher",
                newName: "Cnic");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Teacher",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Cnic",
                table: "Teacher",
                newName: "CNIC");

            migrationBuilder.AlterColumn<int>(
                name: "Code",
                table: "Teacher",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20);
        }
    }
}
