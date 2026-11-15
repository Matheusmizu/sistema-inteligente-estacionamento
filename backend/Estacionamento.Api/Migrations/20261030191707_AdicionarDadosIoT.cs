using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Estacionamento.Api.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarDadosIoT : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "OcupadaPorSensor",
                table: "Vagas",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "UltimaAtualizacaoSensor",
                table: "Vagas",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OcupadaPorSensor",
                table: "Vagas");

            migrationBuilder.DropColumn(
                name: "UltimaAtualizacaoSensor",
                table: "Vagas");
        }
    }
}
