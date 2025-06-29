using ReactApp1.Server.DataAcces.Abstract;
using ReactApp1.Server.Entities;
using System.Collections.Generic;
using System.Linq;

namespace ReactApp1.Server.DataAcces.Concrete
{
    public class DepartmentRepository : IDepartmentRepository
    {
        public Department CreateDepartment(Department department)
        {
            using var context = new ProjectDbContext();
            context.Departments.Add(department);
            context.SaveChanges();
            return department;
        }

        public void DeleteDepartment(int id)
        {
            using var context = new ProjectDbContext();
            var dep = context.Departments.Find(id);
            context.Departments.Remove(dep);
            context.SaveChanges();
        }

        public Department GetDepartmentById(int id)
        {
            using var context = new ProjectDbContext();
            return context.Departments.Find(id);
        }

        public List<Department> GetAllDepartments()
        {
            using var context = new ProjectDbContext();
            return context.Departments.ToList();
        }

        public Department UpdateDepartment(Department department)
        {
            using var context = new ProjectDbContext();
            context.Departments.Update(department);
            context.SaveChanges();
            return department;
        }
    }
}
