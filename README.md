# 🚗 Sistema Inteligente de Gestão de Estacionamento

Projeto desenvolvido para a disciplina **UPX – Usina de Projetos Experimentais IV**, com foco no tema **Mobilidade e Urbanização**.

## 📌 Sobre o projeto

O Sistema Inteligente de Gestão de Estacionamento tem como objetivo utilizar tecnologia para melhorar a organização das vagas e contribuir para uma mobilidade urbana mais eficiente.

A solução contará com sensores responsáveis por identificar a ocupação das vagas em tempo real, integrados a um sistema web que permitirá aos usuários consultar a disponibilidade de vagas, selecionar uma vaga específica, realizar reservas e consultar o valor estimado a ser pago.

O estacionamento também contará com um painel na entrada indicando a quantidade de vagas disponíveis em cada setor ou corredor. Dessa forma, o motorista poderá ser direcionado para uma região com disponibilidade, reduzindo o tempo gasto procurando uma vaga.

O projeto será desenvolvido e apresentado por meio de uma maquete funcional, representando o funcionamento do estacionamento e sua integração com o sistema.

## 🎯 Objetivo

Desenvolver uma solução tecnológica capaz de auxiliar na gestão de estacionamentos, facilitando a localização e reserva de vagas e contribuindo para uma utilização mais eficiente do espaço.

## ⚙️ Funcionalidades 

- Consulta de vagas disponíveis;
- Consulta por data e horário;
- Seleção de vaga específica;
- Reserva de vagas;
- Consulta do valor estimado;
- Monitoramento da ocupação das vagas;
- Painel de disponibilidade por setor/corredor;
- Dashboard administrativo;
- Indicadores de ocupação e utilização;
- Integração com sensores para identificação das vagas.

## 🌎 ODS relacionadas

### ODS 11 — Cidades e Comunidades Sustentáveis

Contribuir para uma utilização mais eficiente dos espaços urbanos e para a melhoria da mobilidade.

### ODS 9 — Indústria, Inovação e Infraestrutura

Aplicação de sensores, IoT, automação e sistemas computacionais em uma solução tecnológica.

### ODS 13 — Ação Contra a Mudança Global do Clima

Redução potencial de deslocamentos desnecessários dentro do estacionamento, contribuindo para a diminuição do consumo de combustível e das emissões associadas.

🛠️ Tecnologias utilizadas

Backend

- C#
- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server

Frontend

- React
- TypeScript
- Vite
- TanStack Router

IoT e integração

- ESP32
- Wokwi
- Sensores ultrassônicos HC-SR04
- LCD 1602 I2C
- Cloudflare Tunnel

Ferramentas

- Git e GitHub
- Visual Studio Code
- SQL Server Management Studio
- Swagger

📋 Pré-requisitos

Antes de começar, instale:

- "Git" (https://git-scm.com/)
- ".NET SDK 8" (https://dotnet.microsoft.com/download/dotnet/8.0)
- "Node.js" (https://nodejs.org/)
- "SQL Server" (https://www.microsoft.com/sql-server/sql-server-downloads)
- "Visual Studio Code" (https://code.visualstudio.com/)

Para utilizar a simulação IoT, também será necessário ter acesso ao "Wokwi" (https://wokwi.com/).

📥 Como baixar o projeto

Abra o terminal e execute:

git clone https://github.com/Matheusmizu/sistema-inteligente-estacionamento.git

Entre na pasta do projeto:

cd sistema-inteligente-estacionamento

🗄️ Configuração do banco de dados

O projeto utiliza SQL Server.

Abra o arquivo "appsettings.json", localizado em:

"backend/Estacionamento.Api/appsettings.json"

Configure a conexão com o SQL Server de acordo com a sua instalação.

Exemplo de conexão local utilizando autenticação do Windows:

"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=EstacionamentoDb;Trusted_Connection=True;TrustServerCertificate=True;"
}

Instale a ferramenta do Entity Framework Core, caso ainda não tenha:

dotnet tool install --global dotnet-ef --version 8.0.4

Entre na pasta da API:

cd backend/Estacionamento.Api

Aplique as migrations para criar o banco de dados:

dotnet ef database update

▶️ Como executar o backend

Ainda na pasta "backend/Estacionamento.Api", execute:

dotnet restore
dotnet run

A API estará disponível em:

"http://localhost:5254"

O Swagger poderá ser acessado em:

"http://localhost:5254/swagger"

🌐 Como executar o frontend

Abra outro terminal e entre na pasta "frontend":

cd frontend

Instale as dependências:

npm install

Inicie o projeto:

npm run dev

O terminal mostrará o endereço local para acessar a aplicação pelo navegador.

Importante: mantenha o backend e o frontend em execução enquanto estiver utilizando o sistema.

📡 Integração IoT — Wokwi

O projeto utiliza o Wokwi para simular o funcionamento dos sensores conectados ao ESP32.

A simulação permite identificar quando uma vaga está ocupada ou livre e enviar essa informação para a API.

Para permitir que o ESP32 simulado acesse a API local, é necessário utilizar um túnel público, como o Cloudflare Tunnel.

Exemplo de inicialização:

cloudflared tunnel --url http://localhost:5254

O Cloudflare fornecerá um endereço público temporário.

Esse endereço deverá ser atualizado no código do ESP32 utilizado no Wokwi sempre que um novo túnel for criado.

Atenção: o túnel precisa permanecer aberto durante a simulação. O backend também deve continuar em execução.

👨‍💻 Desenvolvido por

Projeto acadêmico desenvolvido pela equipe EcoTech.

Repositório: "GitHub — Vaga Certa" (https://github.com/Matheusmizu/sistema-inteligente-estacionamento)
