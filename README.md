# Dashboard Interativo do GitHub

Um dashboard elegante e totalmente configurável para visualizar atividades, dados e estatísticas diretamente do GitHub. Feito com HTML, CSS puro e Vanilla JavaScript, com um foco profundo em design e experiência do usuário. Relatório de implementação: [relatorio.md](relatorio.md).

## 🚀 Funcionalidades

- **Ampla Gama de Cards**:
  - **Perfil do Usuário**: Exibe a biografia e os números de seguidores e repositórios.
  - **Seguidores**: Apresenta os últimos seguidores de um perfil com link direto.
  - **Commits Recentes**: Uma listagem formatada dos commits mais recentes em um repositório.
  - **Issues e Pull Requests**: Acompanhe o status e título das últimas solicitações no projeto.
  - **Releases**: Lista as versões (tags) mais recentes lançadas.
  - **Colaboradores**: Mostra quem são os contribuidores de um projeto específico.
  - **Estatísticas do Projeto**: Um gráfico em linha visualizando o volume de commits ao longo das últimas 52 semanas.
- **Design Moderno (Dark Mode)**: Tema escuro nativo implementado com efeitos de vidro (Glassmorphism), paleta de cores equilibrada e tipografia moderna (*Outfit*).
- **Arraste e Solte (Drag & Drop)**: Reposicione os cards no seu dashboard facilmente clicando em seus cabeçalhos e movendo-os pela tela.
- **Persistência Local**: Todos os cards que você adiciona e suas configurações de layout são salvos no armazenamento local do navegador (`localStorage`).
- **Sistema de Cache**: Para evitar atingir rapidamente os limites de taxa de acesso da API pública do GitHub, os resultados de cada card recebem cache por 5 minutos.
- **Atualização sob Demanda**: Cada card armazena e exibe a data da última sincronização, e inclui um botão próprio para forçar a atualização dos dados a qualquer instante.

## 🛠 Tecnologias Utilizadas

O projeto não depende de Node.js, Webpack ou ferramentas de build pesadas. Funciona diretamente a partir de arquivos estáticos no seu navegador:

- **HTML5 e Vanilla CSS3**
- **JavaScript Moderno (ES6+)**
- [SortableJS](https://sortablejs.github.io/Sortable/) (via CDN) - Para lidar com o arraste dos cards do grid.
- [Chart.js](https://www.chartjs.org/) (via CDN) - Para a renderização do gráfico de commits de forma dinâmica.
- [Phosphor Icons](https://phosphoricons.com/) (via CDN) - Coleção de ícones bonitos e leves para a interface.
- [GitHub REST API](https://docs.github.com/pt/rest) - Ponto de acesso em tempo real aos dados da comunidade.

## ⚙️ Como Usar

1. Faça o clone do repositório para sua máquina:
   ```bash
   git clone https://github.com/SEU-USUARIO/dashboard-github.git
   ```
2. Abra o diretório onde o código foi baixado.
3. Dê um duplo clique no arquivo `dashboard.html` para abri-lo no seu navegador (nenhum servidor local é necessário).

### Adicionando Cards
1. Clique no botão **"+ Adicionar Card"** no cabeçalho.
2. Selecione o **Tipo de Card** desejado.
3. Se você escolheu opções de usuário (como Perfil), insira apenas o nome de usuário (ex: `torvalds`).
4. Se você escolheu opções de repositório (como Commits, Gráficos ou Issues), insira o nome completo seguindo o padrão `dono/repositório` (ex: `facebook/react`).
5. Clique em **Adicionar**. O card surgirá na tela e já começará a buscar as informações no GitHub.

### Atualizando e Removendo
Todos os cards têm ícones utilitários no canto direito superior:
- 🔄 **Atualizar**: Ignora o tempo de cache e faz uma nova requisição na API em tempo real para o card.
- 🗑 **Remover**: Apaga o card do dashboard permanentemente.

## ⚠️ Limite da API
O projeto utiliza requisições não autenticadas na API do GitHub. Portanto, há um limite estabelecido de **60 requisições por hora** para o seu endereço IP. Se os cards derem erro avisando limite excedido, será necessário aguardar um pouco.

## 📝 Licença
[MIT](LICENSE)
