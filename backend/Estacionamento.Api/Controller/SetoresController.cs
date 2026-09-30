using Estacionamento.Api.Data;
using Estacionamento.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Estacionamento.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SetoresController : ControllerBase
{
    private readonly AppDbContext _context;

    public SetoresController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Setor>>> GetSetores()
    {
        return await _context.Setores.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Setor>> GetSetor(int id)
    {
        var setor = await _context.Setores.FindAsync(id);

        if (setor == null)
        {
            return NotFound();
        }

        return setor;
    }

    [HttpPost]
    public async Task<ActionResult<Setor>> CriarSetor(Setor setor)
    {
        _context.Setores.Add(setor);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetSetor),
            new { id = setor.Id },
            setor);
    }
}
