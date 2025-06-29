using ReactApp1.Server.Entities;

namespace ReactApp1.Server.DataAcces.Abstract
{
    public interface IUserRepository
    {
        Users GetUsersById(int id);

        Users CreateUser(Users user);

        Users UpdateUser(Users user);

        void DeleteUser(int id);

        Users Login(string email, string password);
    }
}
