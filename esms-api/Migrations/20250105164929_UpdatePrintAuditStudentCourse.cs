using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    public partial class UpdatePrintAuditStudentCourse : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "PrintApprovalBy",
                table: "StudentCourses",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PrintApprovalDate",
                table: "StudentCourses",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "PrintStatus",
                table: "StudentCourses",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrintApprovalBy",
                table: "StudentCourses");

            migrationBuilder.DropColumn(
                name: "PrintApprovalDate",
                table: "StudentCourses");

            migrationBuilder.DropColumn(
                name: "PrintStatus",
                table: "StudentCourses");
        }
    }
}
