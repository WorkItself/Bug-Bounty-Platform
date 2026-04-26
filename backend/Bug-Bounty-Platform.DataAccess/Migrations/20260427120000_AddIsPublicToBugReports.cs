using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bug_Bounty_Platform.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddIsPublicToBugReports : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPublic",
                table: "BugReports",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPublic",
                table: "BugReports");
        }
    }
}
