using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PerspectiveAPI.Migrations
{
    public partial class slug : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: "1",
                columns: new[] { "Slug", "TimePosted" },
                values: new object[] { "pervyii-post", new DateTime(2022, 7, 19, 13, 4, 58, 960, DateTimeKind.Utc).AddTicks(5977) });

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: "2",
                columns: new[] { "Slug", "TimePosted" },
                values: new object[] { "vtoroii-post", new DateTime(2022, 7, 19, 13, 4, 58, 960, DateTimeKind.Utc).AddTicks(6386) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: "1",
                columns: new[] { "Password", "Salt" },
                values: new object[] { "AQinvNmfummuRGFenlQuSUmbEGAJcJEVfCFJhEoZmSo=", new byte[] { 222, 95, 214, 19, 9, 63, 115, 211, 78, 67, 250, 148, 110, 196, 15, 156 } });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: "2",
                columns: new[] { "Password", "Salt" },
                values: new object[] { "zoc13OoaNLuSlntigT7e21ohl/FhQzSoevPeldseanE=", new byte[] { 182, 31, 96, 175, 15, 1, 108, 51, 114, 77, 146, 240, 96, 113, 45, 115 } });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: "1",
                columns: new[] { "Slug", "TimePosted" },
                values: new object[] { "", new DateTime(2022, 7, 18, 20, 52, 29, 638, DateTimeKind.Utc).AddTicks(5355) });

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: "2",
                columns: new[] { "Slug", "TimePosted" },
                values: new object[] { "post", new DateTime(2022, 7, 18, 20, 52, 29, 638, DateTimeKind.Utc).AddTicks(5365) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: "1",
                columns: new[] { "Password", "Salt" },
                values: new object[] { "0nVoGnjW1MQxrpfzVFdBTI9tfEcxCBLy1Fj+VSiYasU=", new byte[] { 171, 200, 180, 49, 131, 105, 71, 213, 138, 40, 223, 149, 97, 42, 139, 84 } });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: "2",
                columns: new[] { "Password", "Salt" },
                values: new object[] { "RmaY7A7j0RjwdJOJ4aNmCoRLCpmkKXA3+nJmOr4VZfQ=", new byte[] { 48, 58, 18, 9, 215, 27, 241, 208, 194, 63, 62, 99, 26, 7, 132, 102 } });
        }
    }
}
