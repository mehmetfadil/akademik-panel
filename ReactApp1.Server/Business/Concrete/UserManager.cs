using ReactApp1.Server.Business.Abstract;
using ReactApp1.Server.DataAcces.Abstract;
using ReactApp1.Server.DataAcces.Concrete;
using ReactApp1.Server.Entities;

namespace ReactApp1.Server.Business.Concrete
{

    public class UserManager : IUserService
    {

        private IUserRepository _userRepository;
        public UserManager()
        {
            // burlara şartları yaz
            _userRepository = new UserRepository();
        }

        public Users CreateUser(Users user)
        {
            return _userRepository.CreateUser(user);
        }

        public void DeleteUser(int id)
        {
            _userRepository.DeleteUser(id);
        }

        public Users GetUsersById(int id)
        {
            return _userRepository.GetUsersById(id);
        }

        public Users UpdateUser(Users user)
        {
            return _userRepository.UpdateUser(user);
        }
        public Users Login(string email, string password)
        {
            return _userRepository.Login(email, password);
        }
    }
}
