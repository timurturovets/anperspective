using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PerspectiveAPI.Migrations
{
    public partial class newEntities : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: "1",
                columns: new[] { "Header", "Slug", "TimePosted" },
                values: new object[] { "Первый пост", "", new DateTime(2022, 7, 18, 20, 52, 29, 638, DateTimeKind.Utc).AddTicks(5355) });

            migrationBuilder.InsertData(
                table: "Posts",
                columns: new[] { "PostId", "AuthorId", "Header", "ImageLocation", "ImagePhysicalPath", "RawHtml", "Slug", "TimePosted" },
                values: new object[] { "2", "1", "Второй post", null, null, "<hr /> <h5>Это реально???</h5> <h1>Да, это реально)</h1>", "post", new DateTime(2022, 7, 18, 20, 52, 29, 638, DateTimeKind.Utc).AddTicks(5365) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: "1",
                columns: new[] { "Password", "Salt" },
                values: new object[] { "0nVoGnjW1MQxrpfzVFdBTI9tfEcxCBLy1Fj+VSiYasU=", new byte[] { 171, 200, 180, 49, 131, 105, 71, 213, 138, 40, 223, 149, 97, 42, 139, 84 } });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "Password", "Role", "Salt", "UserName" },
                values: new object[] { "2", "RmaY7A7j0RjwdJOJ4aNmCoRLCpmkKXA3+nJmOr4VZfQ=", 0, new byte[] { 48, 58, 18, 9, 215, 27, 241, 208, 194, 63, 62, 99, 26, 7, 132, 102 }, "user" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: "2");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: "2");

            migrationBuilder.UpdateData(
                table: "Posts",
                keyColumn: "PostId",
                keyValue: "1",
                columns: new[] { "Header", "Slug", "TimePosted" },
                values: new object[] { "First post", "first-post", new DateTime(2022, 6, 27, 10, 17, 44, 197, DateTimeKind.Utc).AddTicks(9527) });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: "1",
                columns: new[] { "Password", "Salt" },
                values: new object[] { "l3pGm/0Ko0x2QqMoYQ1usREWVhulorpu8kt3VhzKjmw=", new byte[] { 102, 239, 166, 130, 89, 85, 90, 248, 132, 153, 108, 206, 12, 157, 144, 56 } });
        }
    }
}
