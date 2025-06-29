using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactApp1.Server.Entities
{
    public class Users
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [StringLength(50)]
        public string? Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        [StringLength(50)]
        public string? bolum { get; set; }

        [StringLength(20)]
        public string? Role { get; set; }
    }
}
