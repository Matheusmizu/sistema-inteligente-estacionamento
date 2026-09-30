namespace Estacionamento.Api.Models;

public class Setor
{
    public int Id { get; set; }

    public string Nome { get; set; } = string.Empty;

    public List<Vaga> Vagas { get; set; } = new();
}