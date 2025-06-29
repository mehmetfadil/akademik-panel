using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Entities;

namespace ReactApp1.Server.DataAcces
{
    public class ProjectDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlServer("Server = MEHMET; Database = OBS; Trusted_Connection=True; TrustServerCertificate=True;");
        }

        public DbSet<Users> Users { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Schedule> Schedules { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasKey(u => u.Id);
            });

            modelBuilder.Entity<Department>(entity =>
            {
                entity.HasKey(d => d.DepartmanID);
            });

            modelBuilder.Entity<Room>(entity =>
            {
                entity.HasKey(r => r.RoomID);
            });

            modelBuilder.Entity<Course>(entity =>
            {
                entity.HasKey(c => c.CourseID);
            });

            modelBuilder.Entity<Schedule>(entity =>
            {
                entity.HasKey(s => s.ScheduleID);

                entity.HasOne(s => s.Course)
                      .WithMany(c => c.Schedules)
                      .HasForeignKey(s => s.CourseID)
                      .OnDelete(DeleteBehavior.Restrict); // CASCADE yerine Restrict

                entity.HasOne(s => s.Room)
                      .WithMany(r => r.Schedules)
                      .HasForeignKey(s => s.RoomID)
                      .OnDelete(DeleteBehavior.Restrict); // CASCADE yerine Restrict
            });
        }

    }
}
