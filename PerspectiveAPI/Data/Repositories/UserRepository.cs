using PerspectiveAPI.Models.Domain;



namespace PerspectiveAPI.Data.Repositories;

public class UserRepository : RepositoryBase<User>
{
    public UserRepository(AppDbContext context) : base(context){}

    public bool CheckIfNameIsTaken(string name)
    {
        return GetBy(u=>u.UserName == name) is not null;
    }
    
    
}