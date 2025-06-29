using ReactApp1.Server.Entities;
using System.Collections.Generic;

namespace ReactApp1.Server.DataAcces.Abstract
{
    public interface ICourseRepository
    {
        Course GetCourseById(int id);
        Course CreateCourse(Course course);
        Course UpdateCourse(Course course);
        void DeleteCourse(int id);
        List<Course> GetAllCourses();
    }
}
