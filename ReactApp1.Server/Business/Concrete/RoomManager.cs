using ReactApp1.Server.Business.Abstract;
using ReactApp1.Server.DataAcces.Abstract;
using ReactApp1.Server.DataAcces.Concrete;
using ReactApp1.Server.Entities;
using System.Collections.Generic;

namespace ReactApp1.Server.Business.Concrete
{
    public class RoomManager : IRoomService
    {
        private readonly IRoomRepository _roomRepository;

        public RoomManager()
        {
            _roomRepository = new RoomRepository();
        }

        public Room CreateRoom(Room room) => _roomRepository.CreateRoom(room);
        public void DeleteRoom(int id) => _roomRepository.DeleteRoom(id);
        public Room GetRoomById(int id) => _roomRepository.GetRoomById(id);
        public List<Room> GetAllRooms() => _roomRepository.GetAllRooms();
        public Room UpdateRoom(Room room) => _roomRepository.UpdateRoom(room);
    }
}
