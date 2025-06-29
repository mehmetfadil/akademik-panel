using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Business.Abstract;
using ReactApp1.Server.Business.Concrete;
using ReactApp1.Server.Entities;
using ReactApp1.Server.DataAcces;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.DataAcces;

namespace ReactApp1.Server.Controllers
{
    


    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserService _userService;


        public UserController()
        {
            _userService = new UserManager();
        }

        [HttpGet("{id}")]
        public Users Get(int id)
        {
            return _userService.GetUsersById(id);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Users user)
        {
            var createdUser = _userService.CreateUser(user);
            return Ok(createdUser);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] Users user)
        {
            var existingUser = _userService.Login(user.Email, user.Password);

            if (existingUser != null)
            {
                return Ok(new { message = "Giriş başarılı", user = existingUser });
            }

            return BadRequest("Email veya şifre hatalı");
        }


        [HttpGet("{id}/courses")]
        public IActionResult GetCoursesByUser(int id)
        {
            using var context = new ProjectDbContext();

            var courses = context.Courses
                .Where(c => c.Id == id)
                .Include(c => c.Schedules)
                .ThenInclude(s => s.Room)
                .Select(c => new
                {
                    c.CourseID,
                    c.CourseName,
                    c.Semester,
                    Schedules = c.Schedules.Select(s => new
                    {
                        s.Day,
                        s.StartTime,
                        s.EndTime,
                        RoomName = s.Room.RoomName
                    }).ToList()
                })
                .ToList();

            return Ok(courses);
        }

        [HttpGet("{id}/department-courses")]
        public IActionResult GetDepartmentCourses(int id)
        {
            using (var context = new ProjectDbContext())
            {
                var user = context.Users.FirstOrDefault(u => u.Id == id);
                if (user == null || string.IsNullOrEmpty(user.bolum))
                    return NotFound();

                var courses = context.Courses
                    .Where(c => c.Department.DepartmanName == user.bolum)
                    .Select(c => new {
                        courseName = c.CourseName,
                        courseSize = c.CourseSize
                    })
                    .ToList();

                return Ok(courses);
            }
        }

        [HttpGet("{id}/department-instructors")]
        public IActionResult GetDepartmentInstructors(int id)
        {
            using (var context = new ProjectDbContext())
            {
                var user = context.Users.FirstOrDefault(u => u.Id == id);
                if (user == null || string.IsNullOrEmpty(user.bolum))
                {
                    
        }

                // Karşılaştırma yapacağımız bölüm adını standart bir formata getiriyoruz.
                var userDepartment = user.bolum.Trim().ToLower();

                var instructors = context.Users
                    // Sorgu içinde de karşılaştırılan veriyi aynı formata getiriyoruz.
                    .Where(u => u.Role == "oe" )
                    .ToList();

                return Ok(instructors);
            }
        }

        [HttpGet("assistants")]
        public IActionResult GetAssistants()
        {
            using (var context = new ProjectDbContext())
            {
                
                var assistants = context.Users
                                        .Where(u => u.Role == "assistants")
                                        .ToList();

                return Ok(assistants);
            }
        }

        [HttpGet("all")]
        public IActionResult GetAllUsers()
        {
            using var context = new ProjectDbContext();
            var users = context.Users.ToList();
            return Ok(users);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] Users updatedUser)
        {
            if (id != updatedUser.Id)
            {
                return BadRequest("Kullanıcı ID uyuşmazlığı.");
            }

            using (var context = new ProjectDbContext())
            {
                // Entity Framework'e bu nesnenin durumunun "Değiştirildi" olduğunu bildiriyoruz.
                // Bu, veritabanından veri çekmeden doğrudan güncelleme yapmanın bir yoludur.
                context.Entry(updatedUser).State = EntityState.Modified;

                try
                {
                    // Değişiklikleri veritabanına kaydet.
                    await context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    // Eğer güncelleme sırasında bir sorun olursa (örn. kullanıcı silinmişse)
                    // ve kullanıcı veritabanında bulunamazsa, NotFound döndür.
                    if (!context.Users.Any(e => e.Id == id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                // İşlem başarılı olursa 204 No Content döndür.
                return NoContent();
            }
        }





    }
}
