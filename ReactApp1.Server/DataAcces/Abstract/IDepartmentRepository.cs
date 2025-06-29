using ReactApp1.Server.Entities;
using System.Collections.Generic;

namespace ReactApp1.Server.DataAcces.Abstract
{
    public interface IDepartmentRepository
    {
        Department GetDepartmentById(int id);
        Department CreateDepartment(Department department);
        Department UpdateDepartment(Department department);
        void DeleteDepartment(int id);
        List<Department> GetAllDepartments();
    }
}
