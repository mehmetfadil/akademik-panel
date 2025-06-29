using System.Collections.Generic;
using ReactApp1.Server.Entities;

namespace ReactApp1.Server.Business.Abstract
{
    public interface IRoomService
    {
        Room GetRoomById(int id);
        Room CreateRoom(Room room);
        Room UpdateRoom(Room room);
        void DeleteRoom(int id);
        List<Room> GetAllRooms();
    }
}
