using ReactApp1.Server.DataAcces.Abstract;
using ReactApp1.Server.Entities;
using System.Collections.Generic;
using System.Linq;

namespace ReactApp1.Server.DataAcces.Concrete
{
    public class ScheduleRepository : IScheduleRepository
    {
        public Schedule CreateSchedule(Schedule schedule)
        {
            using var context = new ProjectDbContext();
            context.Schedules.Add(schedule);
            context.SaveChanges();
            return schedule;
        }

        public void DeleteSchedule(int id)
        {
            using var context = new ProjectDbContext();
            var sch = context.Schedules.Find(id);
            context.Schedules.Remove(sch);
            context.SaveChanges();
        }

        public Schedule GetScheduleById(int id)
        {
            using var context = new ProjectDbContext();
            return context.Schedules.Find(id);
        }

        public List<Schedule> GetAllSchedules()
        {
            using var context = new ProjectDbContext();
            return context.Schedules.ToList();
        }

        public Schedule UpdateSchedule(Schedule schedule)
        {
            using var context = new ProjectDbContext();
            context.Schedules.Update(schedule);
            context.SaveChanges();
            return schedule;
        }
    }
}
