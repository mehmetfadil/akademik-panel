using ReactApp1.Server.Entities;

namespace ReactApp1.Server.Business.Abstract
{
    public interface IUserService
    {
        Users GetUsersById(int id);

        Users CreateUser(Users user);

        Users UpdateUser(Users user);

        void DeleteUser(int id);

        public Users Login(string email, string password);
    }
}
