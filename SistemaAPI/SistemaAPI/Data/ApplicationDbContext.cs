using Microsoft.EntityFrameworkCore;
using SistemaAPI.Models;

namespace SistemaAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Articulo> Articulos { get; set; }
        public DbSet<Produccion> Produccion { get; set; }
    }
}
