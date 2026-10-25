
using System.ComponentModel.DataAnnotations.Schema;

namespace Estacionamento.Api.Models;

public class Reserva
{
    public int Id { get; set; }

    public int VagaId { get; set; }

    public Vaga? Vaga { get; set; }

    public string Placa { get; set; } = string.Empty;

    public DateTime Inicio { get; set; }

    public DateTime Fim { get; set; }

    public string Status { get; set; } = "Agendada";

    [NotMapped]
    public decimal Valor
    {
        get
        {
            var duracao = Fim - Inicio;

            return Math.Round(
                (decimal)duracao.Ticks /
                TimeSpan.TicksPerHour * 5m,
                2,
                MidpointRounding.AwayFromZero
            );
        }
    }
}
