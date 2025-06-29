using ReactApp1.Server.DataAcces.Abstract;
using ReactApp1.Server.Entities;

namespace ReactApp1.Server.DataAcces.Concrete
{
    public class UserRepository : IUserRepository
    {
        public Users CreateUser(Users user)
        {
            using (var projectDbContext = new ProjectDbContext())
            {
                projectDbContext.Users.Add(user);
                projectDbContext.SaveChanges();
                return user;

            }
        }

        public void DeleteUser(int id)
        {
            using (var projectDbContext = new ProjectDbContext())
            {
                var deletedUser = GetUsersById(id);

                projectDbContext.Users.Remove(deletedUser);
                projectDbContext.SaveChanges();

            }
        }

        public Users GetUsersById(int id)
        {
            using (var projectDbContext = new ProjectDbContext())
            {
                return projectDbContext.Users.Find(id);
            }
        }

        public Users UpdateUser(Users user)
        {
            using (var projectDbContext = new ProjectDbContext())
            {
                projectDbContext.Users.Update(user);
                return user;
            }
        }

        public Users Login(string email, string password)
        {
            using (var projectDbContext = new ProjectDbContext())
            {
                // Email ve password'a göre kullanıcıyı bulma
                return projectDbContext.Users
                    .FirstOrDefault(u => u.Email == email && u.Password == password);
            }
        }

    }
}
