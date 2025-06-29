using ReactApp1.Server.Business.Abstract;
using ReactApp1.Server.DataAcces.Abstract;
using ReactApp1.Server.DataAcces.Concrete;
using ReactApp1.Server.Entities;
using System.Collections.Generic;

namespace ReactApp1.Server.Business.Concrete
{
    public class DepartmentManager : IDepartmentService
    {
        private readonly IDepartmentRepository _departmentRepository;

        public DepartmentManager()
        {
            _departmentRepository = new DepartmentRepository();
        }

        public Department CreateDepartment(Department department) => _departmentRepository.CreateDepartment(department);
        public void DeleteDepartment(int id) => _departmentRepository.DeleteDepartment(id);
        public Department GetDepartmentById(int id) => _departmentRepository.GetDepartmentById(id);
        public List<Department> GetAllDepartments() => _departmentRepository.GetAllDepartments();
        public Department UpdateDepartment(Department department) => _departmentRepository.UpdateDepartment(department);
    }
}
