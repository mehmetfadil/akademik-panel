using ReactApp1.Server.Entities;
using System.Collections.Generic;

namespace ReactApp1.Server.Business.Abstract
{
    public interface ICourseService
    {
        Course GetCourseById(int id);
        Course CreateCourse(Course course);
        Course UpdateCourse(Course course);
        void DeleteCourse(int id);
        List<Course> GetAllCourses();
    }
}
