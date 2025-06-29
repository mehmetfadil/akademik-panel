using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Business.Abstract;
using ReactApp1.Server.Business.Concrete;
using ReactApp1.Server.Entities;
using System.Collections.Generic;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CourseController()
        {
            _courseService = new CourseManager();
        }

        [HttpGet("{id}")]
        public ActionResult<Course> Get(int id) => _courseService.GetCourseById(id);

        [HttpGet]
        public ActionResult<List<Course>> GetAll() => _courseService.GetAllCourses();

        [HttpPost]
        public IActionResult Create([FromBody] Course course)
        {
            var created = _courseService.CreateCourse(course);
            return Ok(created);
        }

        [HttpPut]
        public IActionResult Update([FromBody] Course course)
        {
            var updated = _courseService.UpdateCourse(course);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _courseService.DeleteCourse(id);
            return NoContent();
        }
    }
}
