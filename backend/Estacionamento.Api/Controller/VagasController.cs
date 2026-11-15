using Estacionamento.Api.Data;
using Estacionamento.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Estacionamento.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VagasController : ControllerBase
{
    private readonly AppDbContext _context;

    public VagasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Vaga>>> GetVagas()
    {
        return await _context.Vagas.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Vaga>> GetVaga(int id)
    {
        var vaga = await _context.Vagas.FindAsync(id);

        if (vaga == null)
        {
            return NotFound();
        }

        return vaga;
    }

    [HttpPost]
    public async Task<ActionResult<Vaga>> CriarVaga(Vaga vaga)
    {
        _context.Vagas.Add(vaga);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetVaga),
            new { id = vaga.Id },
            vaga);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> AtualizarVaga(int id, Vaga vaga)
    {
        var vagaExistente = await _context.Vagas.FindAsync(id);

        if (vagaExistente == null)
        {
        return NotFound();
        }

        vagaExistente.Codigo = vaga.Codigo;
        vagaExistente.Status = vaga.Status;
        vagaExistente.SetorId = vaga.SetorId;

        await _context.SaveChangesAsync();

         return NoContent();
    }
    [HttpGet("disponiveis")]
    public async Task<ActionResult<IEnumerable<Vaga>>> GetVagasDisponiveis()
    {
        return await _context.Vagas
            .Where(v => v.Status == "Livre")
            .ToListAsync();
    }
    
    [HttpPost("{id}/sensor")]
    public async Task<IActionResult> AtualizarSensor(
        int id,
        [FromBody] AtualizacaoSensorDto dados)
    {
        var vaga = await _context.Vagas.FindAsync(id);

        if (vaga == null)
        {
            return NotFound(new
            {
                mensagem = "Vaga não encontrada."
            });
        }

        vaga.OcupadaPorSensor = dados.Ocupada;
        vaga.UltimaAtualizacaoSensor = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            mensagem = "Sensor atualizado com sucesso.",
            vaga = vaga.Codigo,
            ocupada = vaga.OcupadaPorSensor,
            ultimaAtualizacao = vaga.UltimaAtualizacaoSensor
        });
    }


}