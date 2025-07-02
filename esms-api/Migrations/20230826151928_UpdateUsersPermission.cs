using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    public partial class UpdateUsersPermission : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserRolePermission");

            migrationBuilder.CreateTable(
                name: "UsersPermissions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Show_Permission = table.Column<bool>(type: "bit", nullable: false),
                    Insert_Permission = table.Column<bool>(type: "bit", nullable: false),
                    Update_Permission = table.Column<bool>(type: "bit", nullable: false),
                    Delete_Permission = table.Column<bool>(type: "bit", nullable: false),
                    Print_Permission = table.Column<bool>(type: "bit", nullable: false),
                    Check_Permission = table.Column<bool>(type: "bit", nullable: false),
                    Approve_Permission = table.Column<bool>(type: "bit", nullable: false),
                    RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MenuId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    UserIdInsert = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    InsertDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserIdUpdate = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserIdDelete = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsersPermissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UsersPermissions_MenuSubCategory_MenuId",
                        column: x => x.MenuId,
                        principalTable: "MenuSubCategory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UsersPermissions_User_UserId",
                        column: x => x.UserId,
                        principalTable: "User",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UsersPermissions_UserRole_RoleId",
                        column: x => x.RoleId,
                        principalTable: "UserRole",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UsersPermissions_MenuId",
                table: "UsersPermissions",
                column: "MenuId");

            migrationBuilder.CreateIndex(
                name: "IX_UsersPermissions_RoleId",
                table: "UsersPermissions",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_UsersPermissions_UserId",
                table: "UsersPermissions",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UsersPermissions");

            migrationBuilder.CreateTable(
                name: "UserRolePermission",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MenuId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RoleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    Approve_Permission = table.Column<bool>(type: "bit", nullable: false),
                    Check_Permission = table.Column<bool>(type: "bit", nullable: false),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Delete_Permission = table.Column<bool>(type: "bit", nullable: false),
                    InsertDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Insert_Permission = table.Column<bool>(type: "bit", nullable: false),
                    Print_Permission = table.Column<bool>(type: "bit", nullable: false),
                    Show_Permission = table.Column<bool>(type: "bit", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Update_Permission = table.Column<bool>(type: "bit", nullable: false),
                    UserIdDelete = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdInsert = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdUpdate = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRolePermission", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserRolePermission_MenuSubCategory_MenuId",
                        column: x => x.MenuId,
                        principalTable: "MenuSubCategory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserRolePermission_UserRole_RoleId",
                        column: x => x.RoleId,
                        principalTable: "UserRole",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserRolePermission_MenuId",
                table: "UserRolePermission",
                column: "MenuId");

            migrationBuilder.CreateIndex(
                name: "IX_UserRolePermission_RoleId",
                table: "UserRolePermission",
                column: "RoleId");
        }
    }
}
