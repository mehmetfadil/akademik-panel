using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Business.Abstract;
using ReactApp1.Server.Business.Concrete;
using ReactApp1.Server.Entities;
using System.Collections.Generic;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly IScheduleService _scheduleService;

        public ScheduleController()
        {
            _scheduleService = new ScheduleManager();
        }

        [HttpGet("{id}")]
        public ActionResult<Schedule> Get(int id) => _scheduleService.GetScheduleById(id);

        [HttpGet]
        public ActionResult<List<Schedule>> GetAll() => _scheduleService.GetAllSchedules();

        [HttpPost]
        public IActionResult Create([FromBody] Schedule schedule)
        {
            var created = _scheduleService.CreateSchedule(schedule);
            return Ok(created);
        }

        [HttpPut]
        public IActionResult Update([FromBody] Schedule schedule)
        {
            var updated = _scheduleService.UpdateSchedule(schedule);
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _scheduleService.DeleteSchedule(id);
            return NoContent();
        }
    }
}
