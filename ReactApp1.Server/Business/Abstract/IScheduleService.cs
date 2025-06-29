using ReactApp1.Server.Entities;
using System.Collections.Generic;

namespace ReactApp1.Server.Business.Abstract
{
    public interface IScheduleService
    {
        Schedule GetScheduleById(int id);
        Schedule CreateSchedule(Schedule schedule);
        Schedule UpdateSchedule(Schedule schedule);
        void DeleteSchedule(int id);
        List<Schedule> GetAllSchedules();
    }
}
