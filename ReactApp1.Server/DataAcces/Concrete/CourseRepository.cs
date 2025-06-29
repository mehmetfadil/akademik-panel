using ReactApp1.Server.DataAcces.Abstract;
using ReactApp1.Server.Entities;
using System.Collections.Generic;
using System.Linq;

namespace ReactApp1.Server.DataAcces.Concrete
{
    public class CourseRepository : ICourseRepository
    {
        public Course CreateCourse(Course course)
        {
            using var context = new ProjectDbContext();
            context.Courses.Add(course);
            context.SaveChanges();
            return course;
        }

        public void DeleteCourse(int id)
        {
            using var context = new ProjectDbContext();
            var course = context.Courses.Find(id);
            context.Courses.Remove(course);
            context.SaveChanges();
        }

        public Course GetCourseById(int id)
        {
            using var context = new ProjectDbContext();
            return context.Courses.Find(id);
        }

        public List<Course> GetAllCourses()
        {
            using var context = new ProjectDbContext();
            return context.Courses.ToList();
        }

        public Course UpdateCourse(Course course)
        {
            using var context = new ProjectDbContext();
            context.Courses.Update(course);
            context.SaveChanges();
            return course;
        }
    }
}
