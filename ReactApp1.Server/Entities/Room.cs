using ReactApp1.Server.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Room
{
    [Key]
    public int? RoomID { get; set; }

    [Required]
    [MaxLength(50)]
    public string? RoomName { get; set; }

    public int? Capacity { get; set; }

    public int? DepartmanID { get; set; }
    [ForeignKey("DepartmanID")]
    public Department? Department { get; set; }

    public ICollection<Schedule>? Schedules { get; set; }
}
