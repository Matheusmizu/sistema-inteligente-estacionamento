
namespace Estacionamento.Api.Models;

public class Vaga
{
    public int Id { get; set; }

    public string Codigo { get; set; } = string.Empty;

    public string Status { get; set; } = "Livre";

    // Estado físico identificado pelo sensor IoT
    public bool OcupadaPorSensor { get; set; } = false;

    // Data e hora da última atualização do sensor
    public DateTime? UltimaAtualizacaoSensor { get; set; }

    public int SetorId { get; set; }

    public Setor? Setor { get; set; }
}
