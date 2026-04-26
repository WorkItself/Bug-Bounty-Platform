using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bug_Bounty_Platform.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class SeverityRewards : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvatarUrl",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "TaxId",
                table: "CompanyProfiles");

            migrationBuilder.DropColumn(
                name: "MaxReward",
                table: "BountyPrograms");

            migrationBuilder.DropColumn(
                name: "MinReward",
                table: "BountyPrograms");

            migrationBuilder.AddColumn<decimal>(
                name: "RewardCritical",
                table: "BountyPrograms",
                type: "numeric(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RewardHigh",
                table: "BountyPrograms",
                type: "numeric(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RewardInformational",
                table: "BountyPrograms",
                type: "numeric(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RewardLow",
                table: "BountyPrograms",
                type: "numeric(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RewardMedium",
                table: "BountyPrograms",
                type: "numeric(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RewardCritical",
                table: "BountyPrograms");

            migrationBuilder.DropColumn(
                name: "RewardHigh",
                table: "BountyPrograms");

            migrationBuilder.DropColumn(
                name: "RewardInformational",
                table: "BountyPrograms");

            migrationBuilder.DropColumn(
                name: "RewardLow",
                table: "BountyPrograms");

            migrationBuilder.DropColumn(
                name: "RewardMedium",
                table: "BountyPrograms");

            migrationBuilder.AddColumn<string>(
                name: "AvatarUrl",
                table: "Users",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxId",
                table: "CompanyProfiles",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MaxReward",
                table: "BountyPrograms",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "MinReward",
                table: "BountyPrograms",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
