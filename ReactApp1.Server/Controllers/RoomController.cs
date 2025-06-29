using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Business.Abstract;
using ReactApp1.Server.Business.Concrete;
using ReactApp1.Server.DataAcces;
using ReactApp1.Server.Entities;
using System.Collections.Generic;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _roomService;

        public RoomController()
        {
            _roomService = new RoomManager();
        }

        [HttpGet("{id}")]
        public ActionResult<Room> Get(int id) => _roomService.GetRoomById(id);

        [HttpGet]
        public ActionResult<List<Room>> GetAll() => _roomService.GetAllRooms();

        [HttpPost]
        public IActionResult Create([FromBody] Room room)
        {
            var created = _roomService.CreateRoom(room);
            return Ok(created);
        }

        [HttpPut]
        public IActionResult Update([FromBody] Room room)
        {
            var updated = _roomService.UpdateRoom(room);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _roomService.DeleteRoom(id);
            return NoContent();
        }


        [HttpGet("{id}/courses")]
        public IActionResult GetCoursesForRoom(int id)
        {
            using (var context = new ProjectDbContext())
            {
                var coursesInRoom = context.Schedules
                    // Güvenlik önlemi olarak Course'u olmayan kayıtları filtreliyoruz
                    .Where(s => s.RoomID == id && s.Course != null)
                    .Select(s => new {
                        s.Course.CourseID,
                        s.Course.CourseName,
                        s.Course.Semester,
                        s.Course.CourseSize,
                        s.Day,
                        // StartTime ve EndTime'ı formatlamadan, doğrudan TimeSpan olarak seçiyoruz.
                        // JSON'a çevrilirken bu "hh:mm:ss" formatında bir string olacaktır.
                        s.StartTime,
                        s.EndTime
                    })
                    .Distinct()
                    .ToList();

                return Ok(coursesInRoom);
            }
        }


    }
}
