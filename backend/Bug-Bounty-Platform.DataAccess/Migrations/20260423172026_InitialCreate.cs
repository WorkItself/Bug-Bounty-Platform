using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Bug_Bounty_Platform.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BountyPrograms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProgramName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ProgramDescription = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ProgramScope = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    MinReward = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    MaxReward = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    OwnerId = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BountyPrograms", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BugReportAttachments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BugReportId = table.Column<int>(type: "integer", nullable: false),
                    FileName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    StoragePath = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    ContentType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    FileSizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BugReportAttachments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BugReportComments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BugReportId = table.Column<int>(type: "integer", nullable: false),
                    AuthorId = table.Column<int>(type: "integer", nullable: false),
                    Content = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    IsInternal = table.Column<bool>(type: "boolean", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BugReportComments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BugReports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    Severity = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ProgramId = table.Column<int>(type: "integer", nullable: false),
                    ReporterId = table.Column<int>(type: "integer", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BugReports", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FirstName = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    LastName = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    UserName = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Email = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    Password = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Phone = table.Column<string>(type: "character varying(15)", maxLength: 15, nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: false),
                    RegisteredOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BountyPrograms");

            migrationBuilder.DropTable(
                name: "BugReportAttachments");

            migrationBuilder.DropTable(
                name: "BugReportComments");

            migrationBuilder.DropTable(
                name: "BugReports");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
