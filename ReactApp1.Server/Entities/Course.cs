using ReactApp1.Server.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Course
{
    [Key]
    public int CourseID { get; set; }

    [Required]
    [MaxLength(100)]
    public string CourseName { get; set; }

    public int DepartmanID { get; set; }
    [ForeignKey("DepartmanID")]
    public Department Department { get; set; }

    public int Semester { get; set; }

    public int Id { get; set; } // Users foreign key
    [ForeignKey("Id")]
    public Users User { get; set; }

    public int CourseSize { get; set; }

    public ICollection<Schedule> Schedules { get; set; }
}
