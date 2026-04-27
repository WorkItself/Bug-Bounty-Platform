using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bug_Bounty_Platform.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class RenameIsDeletedToIsHidden : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "BugReports",
                newName: "IsHidden");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "BugReportComments",
                newName: "IsHidden");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "BugReportAttachments",
                newName: "IsHidden");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "BountyPrograms",
                newName: "IsHidden");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsHidden",
                table: "BugReports",
                newName: "IsDeleted");

            migrationBuilder.RenameColumn(
                name: "IsHidden",
                table: "BugReportComments",
                newName: "IsDeleted");

            migrationBuilder.RenameColumn(
                name: "IsHidden",
                table: "BugReportAttachments",
                newName: "IsDeleted");

            migrationBuilder.RenameColumn(
                name: "IsHidden",
                table: "BountyPrograms",
                newName: "IsDeleted");
        }
    }
}
