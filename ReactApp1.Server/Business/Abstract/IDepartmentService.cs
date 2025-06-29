using ReactApp1.Server.Entities;
using System.Collections.Generic;

namespace ReactApp1.Server.Business.Abstract
{
    public interface IDepartmentService
    {
        Department GetDepartmentById(int id);
        Department CreateDepartment(Department department);
        Department UpdateDepartment(Department department);
        void DeleteDepartment(int id);
        List<Department> GetAllDepartments();
    }
}
