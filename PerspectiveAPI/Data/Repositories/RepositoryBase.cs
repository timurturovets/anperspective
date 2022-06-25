using System.Linq.Expressions;

using Microsoft.EntityFrameworkCore;

namespace PerspectiveAPI.Data.Repositories;

public class RepositoryBase<T> where T: class
{
    protected readonly AppDbContext Context;
    protected RepositoryBase(AppDbContext context) => Context = context;

    public IEnumerable<T> GetAll()
    {
        return Context.Set<T>().AsNoTracking();
    }

    public T? Get(string id)
    {
        return Context.Find<T>(id);
    }

    public T? Get(string id, params Expression<Func<T, object>>[] includes)
    {
        var query = Context.Set<T>();
        foreach(var include in includes)
        {
            query.Include(include);
        }

        return query.Find(id);
    }

    public T? GetBy(Expression<Func<T, bool>> predicate)
    {
        return Context.Set<T>().FirstOrDefault(predicate);
    }

    public T? GetBy(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includes)
    {
        var query = Context.Set<T>();
        foreach (var include in includes)
        {
            query.Include(include);
        }

        return query.FirstOrDefault(predicate);
    }

    public virtual void Add(T entity)
    {
        Context.Set<T>().Add(entity);
        Context.SaveChanges();
    }
    public virtual void Update(T entity)
    {
        Context.Entry(entity).State = EntityState.Modified;
    }
    public virtual void Delete(T entity)
    {
        Context.Set<T>().Remove(entity);
        Context.SaveChanges();
    }
}