using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Business.Abstract;
using ReactApp1.Server.Business.Concrete;
using ReactApp1.Server.Entities;
using System.Collections.Generic;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IDepartmentService _departmentService;

        public DepartmentController()
        {
            _departmentService = new DepartmentManager();
        }

        [HttpGet("{id}")]
        public ActionResult<Department> Get(int id) => _departmentService.GetDepartmentById(id);

        [HttpGet]
        public ActionResult<List<Department>> GetAll() => _departmentService.GetAllDepartments();

        [HttpPost]
        public IActionResult Create([FromBody] Department department)
        {
            var created = _departmentService.CreateDepartment(department);
            return Ok(created);
        }

        [HttpPut]
        public IActionResult Update([FromBody] Department department)
        {
            var updated = _departmentService.UpdateDepartment(department);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _departmentService.DeleteDepartment(id);
            return NoContent();
        }
    }
}
