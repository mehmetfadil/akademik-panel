using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Schedule
{
    [Key]
    public int? ScheduleID { get; set; }

    public int? CourseID { get; set; }
    [ForeignKey("CourseID")]
    public Course? Course { get; set; }

    [Required]
    [MaxLength(20)]
    public string? Day { get; set; }

    public TimeSpan? StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }

    public int? RoomID { get; set; }
    [ForeignKey("RoomID")]
    public Room? Room { get; set; }
}
