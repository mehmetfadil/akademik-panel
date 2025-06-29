using ReactApp1.Server.Business.Abstract;
using ReactApp1.Server.DataAcces.Abstract;
using ReactApp1.Server.DataAcces.Concrete;
using ReactApp1.Server.Entities;
using System.Collections.Generic;

namespace ReactApp1.Server.Business.Concrete
{
    public class CourseManager : ICourseService
    {
        private readonly ICourseRepository _courseRepository;

        public CourseManager()
        {
            _courseRepository = new CourseRepository();
        }

        public Course CreateCourse(Course course) => _courseRepository.CreateCourse(course);
        public void DeleteCourse(int id) => _courseRepository.DeleteCourse(id);
        public Course GetCourseById(int id) => _courseRepository.GetCourseById(id);
        public List<Course> GetAllCourses() => _courseRepository.GetAllCourses();
        public Course UpdateCourse(Course course) => _courseRepository.UpdateCourse(course);
    }
}
