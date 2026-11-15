
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  CarFront,
  CheckCircle2,
  Code2,
  Cpu,
  Github,
  LayoutDashboard,
  MapPin,
  Radio,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/apresentacao")({
  component: Apresentacao,
  head: () => ({
    meta: [
      { title: "Vaga Certa | Estacionamento Inteligente" },
      {
        name: "description",
        content:
          "Conheça o Vaga Certa, um sistema inteligente de gerenciamento de vagas de estacionamento.",
      },
    ],
  }),
});

function Apresentacao() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Cabeçalho */}
      <header className="bg-hero text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <a href="#inicio" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground">
              <CarFront className="h-6 w-6" />
            </span>
            <span className="font-display text-xl font-bold">
              Vaga Certa
            </span>
          </a>

          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#projeto" className="hover:text-accent">O projeto</a>
            <a href="#funcionalidades" className="hover:text-accent">Funcionalidades</a>
            <a href="#tecnologias" className="hover:text-accent">Tecnologias</a>
            <a href="#equipe" className="hover:text-accent">Equipe</a>
          </nav>

        </div>
        <div className="lane-stripes h-1" />
      </header>

      {/* Apresentação inicial */}
      <section id="inicio" className="bg-hero text-primary-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="mb-4 inline-block rounded-full border border-white/20 px-4 py-2 text-sm">
              Mobilidade e tecnologia
            </span>

            <h1 className="mb-6 font-display text-4xl font-bold leading-tight md:text-5xl">
              Encontre sua vaga.
              <span className="block text-accent">Ganhe tempo no seu dia.</span>
            </h1>

            <p className="mb-8 max-w-xl text-base leading-relaxed text-primary-foreground/80 md:text-lg">
              O Vaga Certa é uma proposta de estacionamento inteligente
              que integra reservas digitais, consulta de disponibilidade
              e monitoramento de vagas por sensores.
            </p>

            <div className="flex flex-wrap gap-3">

              <a
                href="#projeto"
                className="rounded-lg border border-white/30 px-5 py-3 font-medium transition hover:bg-white/10"
              >
                Saiba mais
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img
              src="/images/estacionamento-ilustrativo.png"
              alt="Imagem ilustrativa de um estacionamento inteligente"
              className="h-full min-h-64 w-full object-cover"
            />
            <p className="bg-black/40 px-4 py-2 text-xs text-white/80">
              Imagem ilustrativa da proposta do projeto.
            </p>
          </div>
        </div>
      </section>

      {/* Sobre o projeto */}
      <section id="projeto" className="mx-auto max-w-6xl px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-semibold text-primary">Conheça o projeto</span>
          <h2 className="mb-5 mt-2 font-display text-3xl font-bold md:text-4xl">
            Uma forma mais inteligente de gerenciar estacionamentos
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Encontrar vagas disponíveis pode consumir tempo e causar
            dificuldades na circulação dos estacionamentos. O Vaga Certa
            busca facilitar esse processo por meio de uma plataforma
            digital integrada a uma proposta de monitoramento por sensores.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-7 shadow-sm">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary">
              <CarFront className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-bold">O desafio</h3>
            <p className="leading-relaxed text-muted-foreground">
              A dificuldade de identificar vagas disponíveis pode gerar
              perda de tempo e tornar a experiência de estacionamento
              menos prática.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-7 shadow-sm">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="mb-3 text-xl font-bold">Nossa proposta</h3>
            <p className="leading-relaxed text-muted-foreground">
              Oferecer uma plataforma para consultar a disponibilidade,
              reservar vagas por período e acompanhar a ocupação por setor.
            </p>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <span className="font-semibold text-primary">O que o sistema oferece</span>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              Principais funcionalidades
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: CalendarCheck,
                title: "Reserva de vagas",
                description: "Agendamento de vagas com data e horário.",
              },
              {
                icon: LayoutDashboard,
                title: "Painel de disponibilidade",
                description: "Visualização das vagas livres e ocupadas por setor.",
              },
              {
                icon: Radio,
                title: "Monitoramento por sensores",
                description: "Simulação de sensores para identificar a ocupação.",
              },
              {
                icon: CarFront,
                title: "Gestão de reservas",
                description: "Consulta e cancelamento de reservas realizadas.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border bg-card p-6 shadow-sm"
              >
                <item.icon className="mb-5 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-bold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Demonstração do sistema */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-10 text-center">
          <span className="font-semibold text-primary">Na prática</span>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
            Conheça o Vaga Certa em funcionamento
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Confira algumas telas e demonstrações desenvolvidas pela equipe.
          </p>
        </div>

        <div className="grid items-start gap-10 md:grid-cols-2">
          <div>
            <img
              src="/images/painel-vaga-certa.png"
              alt="Captura real do painel de disponibilidade do Vaga Certa"
              className="w-full rounded-xl border shadow-lg"
            />
            <h3 className="mt-5 text-xl font-bold">Painel do sistema</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              A aplicação apresenta o total de vagas, a quantidade disponível
              e a situação de cada setor, além de permitir consultar vagas
              para um período desejado.
            </p>
          </div>

          <div>
            <img
              src="/images/simulacao-sensores.png"
              alt="Simulação do circuito com ESP32, sensores ultrassônicos e display LCD"
              className="w-full rounded-xl border shadow-lg"
            />
            <h3 className="mt-5 text-xl font-bold">Simulação dos sensores</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              A parte de IoT utiliza sensores ultrassônicos conectados a um
              ESP32 para simular a identificação da ocupação das vagas,
              com informações exibidas em um display LCD.
            </p>
          </div>
        </div>
      </section>

      {/* Tecnologias */}
      <section id="tecnologias" className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <span className="font-semibold text-primary">Desenvolvimento</span>
            <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
              Tecnologias utilizadas
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Code2, name: "React e TypeScript", detail: "Interface web" },
              { icon: Cpu, name: ".NET 8", detail: "Backend e API" },
              { icon: LayoutDashboard, name: "SQL Server", detail: "Banco de dados" },
              { icon: Radio, name: "ESP32 e sensores", detail: "Simulação IoT" },
            ].map((tech) => (
              <div
                key={tech.name}
                className="rounded-xl border bg-card p-6 text-center"
              >
                <tech.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                <h3 className="font-bold">{tech.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{tech.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe e repositório */}
      <section id="equipe" className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-2xl bg-hero px-6 py-12 text-center text-primary-foreground md:px-12">
          <Users className="mx-auto mb-5 h-10 w-10 text-accent" />
          <h2 className="font-display text-3xl font-bold">
            Desenvolvido por Ecotech
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-primary-foreground/80">
            O Vaga Certa é um projeto acadêmico desenvolvido em equipe,
            integrando conhecimentos de desenvolvimento de software,
            banco de dados e Internet das Coisas.
          </p>

          <a
            href="https://github.com/Matheusmizu/sistema-inteligente-estacionamento"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-bold text-accent-foreground transition hover:opacity-90"
          >
            <Github className="h-5 w-5" />
            Acessar repositório
          </a>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="border-t bg-card py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center text-sm text-muted-foreground md:flex-row">
          <span className="font-bold text-foreground">Vaga Certa</span>
          <span>Projeto acadêmico — Mobilidade e Urbanização</span>
        </div>
      </footer>
    </main>
  );
}
