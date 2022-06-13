using System.Linq.Expressions;

using Microsoft.EntityFrameworkCore;

namespace PerspectiveAPI.Data.Repositories;

public class RepositoryBase<T> where T: class
{
    private readonly AppDbContext _context;
    protected RepositoryBase(AppDbContext context) => _context = context;

    public IEnumerable<T> GetAll()
    {
        return _context.Set<T>().AsNoTracking();
    }

    public T? Get(string id)
    {
        return _context.Find<T>(id);
    }

    public T? Get(string id, params Expression<Func<T, object>>[] includes)
    {
        var query = _context.Set<T>();
        foreach(var include in includes)
        {
            query.Include(include);
        }

        return query.Find(id);
    }

    public T? GetBy(Expression<Func<T, bool>> predicate)
    {
        return _context.Set<T>().FirstOrDefault(predicate);
    }

    public T? GetBy(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includes)
    {
        var query = _context.Set<T>();
        foreach (var include in includes)
        {
            query.Include(include);
        }

        return query.FirstOrDefault(predicate);
    }

    public void Delete(T entity)
    {
        _context.Set<T>().Remove(entity);
        _context.SaveChanges();
    }

    public void Update(T entity)
    {
        _context.Entry(entity).State = EntityState.Modified;
    }
}