using Estacionamento.Api.Controllers;
using Estacionamento.Api.Data;
using Estacionamento.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Estacionamento.Api.Tests;

public class ReservasControllerTests
{
    [Fact]
    public async Task CriarReserva_VagaOcupada_RetornaConflict()
    {
        await using var context = CreateContext();
        context.Vagas.Add(new Vaga { Id = 1, Codigo = "A01", Status = "Ocupada", SetorId = 1 });
        await context.SaveChangesAsync();

        var result = await CreateController(context).CriarReserva(new Reserva
        {
            VagaId = 1,
            Placa = "TESTE01",
            Inicio = DateTime.Now.AddDays(1),
            Fim = DateTime.Now.AddDays(1).AddHours(1)
        });

        Assert.IsType<ConflictObjectResult>(result.Result);
    }

    [Fact]
    public async Task CriarReserva_PeriodoConflitante_RetornaConflict()
    {
        await using var context = CreateContext();
        var inicio = DateTime.Now.AddDays(1).Date.AddHours(14);
        context.Vagas.Add(new Vaga { Id = 2, Codigo = "A02", Status = "Livre", SetorId = 1 });
        context.Reservas.Add(new Reserva
        {
            VagaId = 2,
            Placa = "EXISTE01",
            Inicio = inicio,
            Fim = inicio.AddHours(2),
            Status = "Agendada"
        });
        await context.SaveChangesAsync();

        var result = await CreateController(context).CriarReserva(new Reserva
        {
            VagaId = 2,
            Placa = "TESTE02",
            Inicio = inicio.AddHours(1),
            Fim = inicio.AddHours(3)
        });

        Assert.IsType<ConflictObjectResult>(result.Result);
    }

    [Fact]
    public async Task CriarReserva_VagaInexistente_RetornaBadRequest()
    {
        await using var context = CreateContext();

        var result = await CreateController(context).CriarReserva(new Reserva
        {
            VagaId = 999,
            Placa = "TESTE03",
            Inicio = DateTime.Now.AddDays(1),
            Fim = DateTime.Now.AddDays(1).AddHours(1)
        });

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task CriarReserva_InicioDepoisDoFim_RetornaBadRequest()
    {
        await using var context = CreateContext();
        context.Vagas.Add(new Vaga { Id = 4, Codigo = "A04", Status = "Livre", SetorId = 1 });
        await context.SaveChangesAsync();

        var result = await CreateController(context).CriarReserva(new Reserva
        {
            VagaId = 4,
            Placa = "TESTE04",
            Inicio = DateTime.Now.AddDays(1).AddHours(2),
            Fim = DateTime.Now.AddDays(1).AddHours(1)
        });

        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task CriarReserva_FuturaValida_RetornaCreatedComStatusAgendada()
    {
        await using var context = CreateContext();
        context.Vagas.Add(new Vaga { Id = 3, Codigo = "A03", Status = "Livre", SetorId = 1 });
        await context.SaveChangesAsync();

        var result = await CreateController(context).CriarReserva(new Reserva
        {
            VagaId = 3,
            Placa = "TESTE05",
            Inicio = DateTime.Now.AddDays(2),
            Fim = DateTime.Now.AddDays(2).AddHours(1)
        });

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var reserva = Assert.IsType<Reserva>(created.Value);
        Assert.Equal("Agendada", reserva.Status);
        Assert.Equal("Agendada", (await context.Reservas.SingleAsync()).Status);
    }

    [Fact]
    public async Task CancelarReserva_Futura_RetornaOkEAtualizaStatus()
    {
        await using var context = CreateContext();
        context.Reservas.Add(new Reserva
        {
            Id = 10,
            VagaId = 3,
            Placa = "CANCELA1",
            Inicio = DateTime.Now.AddDays(1),
            Fim = DateTime.Now.AddDays(1).AddHours(1),
            Status = "Agendada"
        });
        await context.SaveChangesAsync();

        var result = await CreateController(context).CancelarReserva(10);

        Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Cancelada", (await context.Reservas.SingleAsync()).Status);
    }

    [Fact]
    public async Task CancelarReserva_Concluida_RetornaBadRequest()
    {
        await using var context = CreateContext();
        context.Reservas.Add(new Reserva
        {
            Id = 11,
            VagaId = 3,
            Placa = "CONCLUI1",
            Inicio = DateTime.Now.AddDays(-2),
            Fim = DateTime.Now.AddDays(-1),
            Status = "Concluida"
        });
        await context.SaveChangesAsync();

        var result = await CreateController(context).CancelarReserva(11);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task CancelarReserva_JaCancelada_RetornaBadRequest()
    {
        await using var context = CreateContext();
        context.Reservas.Add(new Reserva
        {
            Id = 12,
            VagaId = 3,
            Placa = "CANCELA2",
            Inicio = DateTime.Now.AddDays(1),
            Fim = DateTime.Now.AddDays(1).AddHours(1),
            Status = "Cancelada"
        });
        await context.SaveChangesAsync();

        var result = await CreateController(context).CancelarReserva(12);

        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task CancelarReserva_Inexistente_RetornaNotFound()
    {
        await using var context = CreateContext();

        var result = await CreateController(context).CancelarReserva(999);

        Assert.IsType<NotFoundObjectResult>(result);
    }

    private static ReservasController CreateController(AppDbContext context)
    {
        return new ReservasController(context);
    }

    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }
}
