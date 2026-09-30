using Estacionamento.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Estacionamento.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Setor> Setores { get; set; }

    public DbSet<Vaga> Vagas { get; set; }
}