using ReactApp1.Server.DataAcces.Abstract;
using ReactApp1.Server.Entities;
using System.Collections.Generic;
using System.Linq;

namespace ReactApp1.Server.DataAcces.Concrete
{
    public class RoomRepository : IRoomRepository
    {
        public Room CreateRoom(Room room)
        {
            using var context = new ProjectDbContext();
            context.Rooms.Add(room);
            context.SaveChanges();
            return room;
        }

        public void DeleteRoom(int id)
        {
            using var context = new ProjectDbContext();
            var room = context.Rooms.Find(id);
            context.Rooms.Remove(room);
            context.SaveChanges();
        }

        public Room GetRoomById(int id)
        {
            using var context = new ProjectDbContext();
            return context.Rooms.Find(id);
        }

        public List<Room> GetAllRooms()
        {
            using var context = new ProjectDbContext();
            return context.Rooms.ToList();
        }

        public Room UpdateRoom(Room room)
        {
            using var context = new ProjectDbContext();
            context.Rooms.Update(room);
            context.SaveChanges();
            return room;
        }
    }
}
