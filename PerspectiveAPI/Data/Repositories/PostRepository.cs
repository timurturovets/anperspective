﻿using Microsoft.EntityFrameworkCore;
using PerspectiveAPI.Models.Domain;

namespace PerspectiveAPI.Data.Repositories;

public class PostRepository : RepositoryBase<Post>
{
    public PostRepository(AppDbContext context) : base(context) { }

    public override void Delete(Post post)
    {
        post.DeleteImage();
        Context.Entry(post).State = EntityState.Deleted;
        Context.SaveChanges();
    }
}