namespace Estacionamento.Api.Models;

public class Vaga
{
    public int Id { get; set; }

    public string Codigo { get; set; } = string.Empty;

    public string Status { get; set; } = "Livre";

    public int SetorId { get; set; }

    public Setor Setor { get; set; } = null!;
}