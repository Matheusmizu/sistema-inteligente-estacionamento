
using Estacionamento.Api.Data;
using Estacionamento.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Estacionamento.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservasController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReservasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Reserva>>> GetReservas()
    {
        await AtualizarReservasConcluidas();

        return await _context.Reservas
            .Include(r => r.Vaga)
            .ThenInclude(v => v!.Setor)
            .Select(r => new Reserva
            {
                Id = r.Id,
                VagaId = r.VagaId,
                Placa = r.Placa,
                Inicio = r.Inicio,
                Fim = r.Fim,
                Status = r.Status,
                Vaga = r.Vaga == null ? null : new Vaga
                {
                    Id = r.Vaga.Id,
                    Codigo = r.Vaga.Codigo,
                    Status = r.Vaga.Status,
                    SetorId = r.Vaga.SetorId,
                    Setor = r.Vaga.Setor == null ? null : new Setor
                    {
                        Id = r.Vaga.Setor.Id,
                        Nome = r.Vaga.Setor.Nome
                    }
                }
            })
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Reserva>> GetReserva(int id)
    {
        await AtualizarReservasConcluidas();

        var reserva = await _context.Reservas
            .Include(r => r.Vaga)
            .ThenInclude(v => v!.Setor)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (reserva == null)
        {
            return NotFound();
        }

        return reserva;
    }

    [HttpPost]
    public async Task<ActionResult<Reserva>> CriarReserva(Reserva reserva)
    {
        var vaga = await _context.Vagas.FindAsync(reserva.VagaId);

        if (vaga == null)
        {
            return BadRequest("A vaga informada não existe.");
        }

        if (vaga.Status == "Ocupada")
        {
            return Conflict(
                "Não é possível reservar uma vaga que está ocupada."
            );
        }

        if (reserva.Inicio >= reserva.Fim)
        {
            return BadRequest(
                "O horário de início deve ser anterior ao horário de fim."
            );
        }

        if (reserva.Inicio <= DateTime.Now)
        {
            return BadRequest(
                "O horário de início da reserva deve ser futuro."
            );
        }

        var reservaConflitante = await _context.Reservas
            .AnyAsync(r =>
                r.VagaId == reserva.VagaId &&
                r.Status != "Concluida" &&
                r.Status != "Cancelada" &&
                reserva.Inicio < r.Fim &&
                reserva.Fim > r.Inicio);

        if (reservaConflitante)
        {
            return Conflict(
                "A vaga já possui uma reserva nesse período."
            );
        }

        reserva.Status = "Agendada";

        _context.Reservas.Add(reserva);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetReserva),
            new { id = reserva.Id },
            reserva
        );
    }

    [HttpGet("disponiveis")]
    public async Task<ActionResult<IEnumerable<Vaga>>> GetVagasDisponiveis(
        [FromQuery] DateTime inicio,
        [FromQuery] DateTime fim)
    {
        if (inicio >= fim)
        {
            return BadRequest(
                "O horário de início deve ser anterior ao horário de fim."
            );
        }

        if (inicio <= DateTime.Now)
        {
            return BadRequest(
                "Consulte a disponibilidade para um horário futuro."
            );
        }

        var vagasDisponiveis = await _context.Vagas
            .Where(v => v.Status == "Livre")
            .Where(v => !_context.Reservas.Any(r =>
                r.VagaId == v.Id &&
                r.Status != "Concluida" &&
                r.Status != "Cancelada" &&
                inicio < r.Fim &&
                fim > r.Inicio))
            .ToListAsync();

        return Ok(vagasDisponiveis);
    }

    private async Task AtualizarReservasConcluidas()
    {
        var agora = DateTime.Now;

        var reservasVencidas = await _context.Reservas
            .Where(r =>
                r.Fim <= agora &&
                r.Status != "Concluida" &&
                r.Status != "Cancelada")
            .ToListAsync();

        foreach (var reserva in reservasVencidas)
        {
            reserva.Status = "Concluida";
        }

        if (reservasVencidas.Count > 0)
        {
            await _context.SaveChangesAsync();
        }
    }
    [HttpPut("{id}/cancelar")]
    public async Task<IActionResult> CancelarReserva(int id)
    {
        var reserva = await _context.Reservas.FindAsync(id);

        if (reserva == null)
        {
            return NotFound("Reserva não encontrada.");
        }

        if (reserva.Status == "Concluida")
        {
            return BadRequest(
            "Não é possível cancelar uma reserva concluída."
            );
        }

        if (reserva.Status == "Cancelada")
        {
            return BadRequest(
            "Esta reserva já foi cancelada."
            );
        }

        if (reserva.Inicio <= DateTime.Now)
        {
            return BadRequest(
            "Só é possível cancelar uma reserva antes do horário de início."
            );
        }

        reserva.Status = "Cancelada";
        await _context.SaveChangesAsync();
        return Ok(new
        {
            mensagem = "Reserva cancelada com sucesso.",
            reservaId = reserva.Id,
            status = reserva.Status
        });
    }
}
