using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    public partial class AddTeacherTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropTable(
            //    name: "BankAccount");

            //migrationBuilder.DropTable(
            //    name: "Certificates");

            //migrationBuilder.DropTable(
            //    name: "Ledger");

            //migrationBuilder.DropTable(
            //    name: "Payment");

            //migrationBuilder.DropTable(
            //    name: "StudentCourses");

            //migrationBuilder.DropTable(
            //    name: "StudentDocuments");

            //migrationBuilder.DropTable(
            //    name: "BankType");

            //migrationBuilder.DropTable(
            //    name: "Currency");

            //migrationBuilder.DropTable(
            //    name: "AccountHead");

            //migrationBuilder.DropTable(
            //    name: "FeeVoucher");

            //migrationBuilder.DropTable(
            //    name: "Courses");

            //migrationBuilder.DropTable(
            //    name: "DocumentType");

            //migrationBuilder.DropTable(
            //    name: "StudentProfile");

            //migrationBuilder.DropTable(
            //    name: "CourseCategory");

            migrationBuilder.CreateTable(
                name: "Teacher",
                columns: table => new
                {
                    TeacherId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CNIC = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    JoiningDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DeletedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Active = table.Column<int>(type: "int", nullable: false),
                    EmploymentStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ExitDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExitReason = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Picture = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teacher", x => x.TeacherId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Teacher");

            migrationBuilder.CreateTable(
                name: "AccountHead",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    InsertDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserIdDelete = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdInsert = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdUpdate = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AccountHead", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BankType",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    InsertDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserIdDelete = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdInsert = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdUpdate = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BankType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CourseCategory",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    InsertDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserIdDelete = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdInsert = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdUpdate = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseCategory", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Currency",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    InsertDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserIdDelete = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdInsert = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdUpdate = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Currency", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DocumentType",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    InsertDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserIdDelete = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdInsert = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdUpdate = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DocumentType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StudentProfile",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    CNIC = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    COC = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    COCHeld = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfBirth = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FatherName = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    InsertDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastName = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Nationality = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    No = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NormalizedName = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Passport = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PlaceOfBirth = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    PostalAddress = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    ProfileImage = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    Rank = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    SSB = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserIdDelete = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdInsert = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdUpdate = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentProfile", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Ledger",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    HeadId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Account = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    Amount = table.Column<double>(type: "float", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    InsertDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Narration = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Payer = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Recipient = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Transaction = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserIdDelete = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdInsert = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdUpdate = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Words = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ledger", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Ledger_AccountHead_HeadId",
                        column: x => x.HeadId,
                        principalTable: "AccountHead",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Ledger_Company_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Company",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseCategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Fees = table.Column<double>(type: "float", nullable: false),
                    InsertDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    ShortName = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserIdDelete = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdInsert = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdUpdate = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Courses_CourseCategory_CourseCategoryId",
                        column: x => x.CourseCategoryId,
                        principalTable: "CourseCategory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BankAccount",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BankTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CurrencyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Account = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Contact = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Fax = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IBAN = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    InsertDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserIdDelete = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdInsert = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdUpdate = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BankAccount", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BankAccount_BankType_BankTypeId",
                        column: x => x.BankTypeId,
                        principalTable: "BankType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BankAccount_Currency_CurrencyId",
                        column: x => x.CurrencyId,
                        principalTable: "Currency",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FeeVoucher",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    ApprovedBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ApprovedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Company = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Discount = table.Column<double>(type: "float", nullable: false),
                    DiscountAmount = table.Column<double>(type: "float", nullable: false),
                    Due = table.Column<bool>(type: "bit", nullable: false),
                    InsertDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Narration = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Request = table.Column<bool>(type: "bit", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Total = table.Column<double>(type: "float", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserIdDelete = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdInsert = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdUpdate = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Words = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeeVoucher", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FeeVoucher_StudentProfile_StudentId",
                        column: x => x.StudentId,
                        principalTable: "StudentProfile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "StudentDocuments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    DocumentTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Image = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    InsertDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Remarks = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserIdDelete = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdInsert = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdUpdate = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentDocuments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentDocuments_DocumentType_DocumentTypeId",
                        column: x => x.DocumentTypeId,
                        principalTable: "DocumentType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StudentDocuments_StudentProfile_StudentId",
                        column: x => x.StudentId,
                        principalTable: "StudentProfile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Certificates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    CertificateNo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExpiryDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    InsertDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IssueDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserIdDelete = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdInsert = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdUpdate = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Certificates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Certificates_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Certificates_StudentProfile_StudentId",
                        column: x => x.StudentId,
                        principalTable: "StudentProfile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "StudentCourses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CourseId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    Certificate = table.Column<bool>(type: "bit", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Discount = table.Column<double>(type: "float", nullable: false),
                    DiscountAmount = table.Column<double>(type: "float", nullable: false),
                    EndDate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Fees = table.Column<double>(type: "float", nullable: false),
                    InsertDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NetFees = table.Column<double>(type: "float", nullable: false),
                    PayStatus = table.Column<bool>(type: "bit", nullable: false),
                    PrintApprovalBy = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    PrintApprovalDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PrintStatus = table.Column<bool>(type: "bit", nullable: false),
                    StartDate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserIdDelete = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdInsert = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdUpdate = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Voucher = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VoucherId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    VoucheringCompany = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentCourses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentCourses_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StudentCourses_StudentProfile_StudentId",
                        column: x => x.StudentId,
                        principalTable: "StudentProfile",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Payment",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    VoucherId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Account = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DeleteDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    InsertDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Narration = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Total = table.Column<double>(type: "float", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserIdDelete = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdInsert = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserIdUpdate = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Words = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Payment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Payment_FeeVoucher_VoucherId",
                        column: x => x.VoucherId,
                        principalTable: "FeeVoucher",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BankAccount_BankTypeId",
                table: "BankAccount",
                column: "BankTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_BankAccount_CurrencyId",
                table: "BankAccount",
                column: "CurrencyId");

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_CourseId",
                table: "Certificates",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_Certificates_StudentId",
                table: "Certificates",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Courses_CourseCategoryId",
                table: "Courses",
                column: "CourseCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_FeeVoucher_StudentId",
                table: "FeeVoucher",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_Ledger_CompanyId",
                table: "Ledger",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Ledger_HeadId",
                table: "Ledger",
                column: "HeadId");

            migrationBuilder.CreateIndex(
                name: "IX_Payment_VoucherId",
                table: "Payment",
                column: "VoucherId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentCourses_CourseId",
                table: "StudentCourses",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentCourses_StudentId",
                table: "StudentCourses",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentDocuments_DocumentTypeId",
                table: "StudentDocuments",
                column: "DocumentTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentDocuments_StudentId",
                table: "StudentDocuments",
                column: "StudentId");
        }
    }
}
