using System.Collections.Generic;
using ReactApp1.Server.Entities;

namespace ReactApp1.Server.DataAcces.Abstract
{
    public interface IRoomRepository
    {
        Room GetRoomById(int id);
        Room CreateRoom(Room room);
        Room UpdateRoom(Room room);
        void DeleteRoom(int id);
        List<Room> GetAllRooms();
    }
}
