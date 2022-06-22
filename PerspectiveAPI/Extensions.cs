using System.Text;
using System.Text.RegularExpressions;

namespace PerspectiveAPI;

public static class Extensions
{
    public static IApplicationBuilder UseAuthMiddleware(this IApplicationBuilder app)
    {
        app.UseMiddleware<AuthMiddleware>();
        return app;
    }

    public static string Slugify(this string text)
    {
        if (text.Length < 1) return string.Empty;
        
        var slug = text.ToLowerInvariant();
        var bytes = Encoding.GetEncoding("Cyrillic").GetBytes(slug);
        slug = Encoding.ASCII.GetString(bytes);
            
        slug = Regex.Replace(slug, @"\s", "-", RegexOptions.Compiled);
        slug = Regex.Replace(slug, @"([^a-z0-9\s-_])", "$1", RegexOptions.Compiled);
        slug = slug.Trim('-', '_');
        slug = Regex.Replace(slug, @"([-_]){2,}", "$1", RegexOptions.Compiled);
            
        return slug;
    }
}