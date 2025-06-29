using ReactApp1.Server.Entities;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class Department
{
    [Key]
    public int DepartmanID { get; set; }

    [Required]
    [MaxLength(100)]
    public string DepartmanName { get; set; }

    public ICollection<Course> Courses { get; set; }
    public ICollection<Room> Rooms { get; set; }
}
