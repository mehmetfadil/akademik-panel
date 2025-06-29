using ReactApp1.Server.Business.Abstract;
using ReactApp1.Server.DataAcces.Abstract;
using ReactApp1.Server.DataAcces.Concrete;
using ReactApp1.Server.Entities;
using System.Collections.Generic;

namespace ReactApp1.Server.Business.Concrete
{
    public class ScheduleManager : IScheduleService
    {
        private readonly IScheduleRepository _scheduleRepository;

        public ScheduleManager()
        {
            _scheduleRepository = new ScheduleRepository();
        }

        public Schedule CreateSchedule(Schedule schedule) => _scheduleRepository.CreateSchedule(schedule);
        public void DeleteSchedule(int id) => _scheduleRepository.DeleteSchedule(id);
        public Schedule GetScheduleById(int id) => _scheduleRepository.GetScheduleById(id);
        public List<Schedule> GetAllSchedules() => _scheduleRepository.GetAllSchedules();
        public Schedule UpdateSchedule(Schedule schedule) => _scheduleRepository.UpdateSchedule(schedule);
    }
}
