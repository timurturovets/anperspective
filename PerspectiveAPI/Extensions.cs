using System.Text.RegularExpressions;
using PerspectiveAPI.Services;

namespace PerspectiveAPI;

public static class Extensions
{
    private static readonly Dictionary<char, string> Letters = new()
    {
        {'а', "a"}, {'б', "b"}, {'в', "v"}, {'г', "g"}, {'д', "d"}, {'е', "e"}, {'ё', "yo"},
        {'ж', "zh"}, {'з', "z"}, {'и', "i"}, {'й', "ii"}, {'к', "k"}, {'л', "l"}, {'м', "m"},
        {'н', "n"}, {'о', "o"}, {'п', "p"}, {'р', "r"}, {'с', "s"}, {'т', "t"}, {'у', "u"},
        {'ф', "f"}, {'х', "h"}, {'ц', "c"}, {'ч', "ch"}, {'ш', "sh"}, {'щ', "sh"}, {'ъ', ""},
        {'ы', "y"}, {'ь', ""}, {'э', "e"}, {'ю', "yu"}, {'я', "ya"}
    };

    public static string Slugify(this string text)
    {
        var slug = string.Empty;

        if (text.Length < 1) return slug;
        
        foreach(var character in text.ToLower())
        {
            if (Letters.ContainsKey(character))
            {
                slug += Letters[character];
            }
            else
            {
                slug += character;
            }
        }
        slug = Regex.Replace(slug, @"[^a-zA-Z0-9\s-]", string.Empty);
        slug = Regex.Replace(slug, @"\s+", " ");
        slug = slug.Trim();
        slug = Regex.Replace(slug, @"\s", "-");

        return slug;
    }

    public static ILogger<T> L<T>(this HttpContext context)
        => context.RequestServices.GetRequiredService<ILogger<T>>();

    public static void UseAuthMiddleware(this WebApplication app)
    {
        app.UseMiddleware<AuthMiddleware>();
    }
}