﻿using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using PerspectiveAPI.Services;

namespace PerspectiveAPI;

public static class Extensions
{
    public static string Slugify(this string text)
    {
        if (text.Length < 1) return string.Empty;

        var slug = text.Normalize(NormalizationForm.FormD);
        slug = string.Concat(slug
            .Where(c => 
                CharUnicodeInfo
                .GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
        );
        slug = slug.Normalize(NormalizationForm.FormC).ToLowerInvariant();
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