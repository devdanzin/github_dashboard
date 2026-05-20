# Relatório da criação de dashboard para o GitHub

### Prompt utilizado
> Vamos criar uma página HTML: um dashboard interativo para o GitHub. Esse dashboard deve ser editável e configurável (contendo campos texto para que o usuário insira dados como repositório ou usuário do GitHub sobre o qual as informações devem ser buscadas) e permitir ao usuário adicionar e excluir cards de diversos tipos (informações sobre um usuário incluindo links de redes sociais, commits recents em um repositório, issues recentes em um repositório, PRs recentes em um repositório, seguidores de um usuário, lista de releases recentes de um projeto, estatísticas de um projeto em forma de gráficos, lista de colaboradores de um projeto, e o que mais você julgar que pode ser interessante exibir em um dashboard). Deve haver um seletor de tipo de card e depois do tipo selecionado deve haver um formulário para que o usuário insira os dados necessários para o card. O dashboard deve ter um mecanismo de persistência local: uma vez que o usuário edite e configure, sempre deve ter os mesmos cards depois. Os cards devem ter um sistema de cache para evitar fazer requisições demais ao GitHub, e cada card deve mostrar a data e horário da última atualização, tendo um botão para permitir atualizar manualmente o card. Cada card deve ter tamanho, formato e estilo adequados às informações que apresenta. Os cards devem ser reposicionáveis pelo usuário, ou seja, o usuário deve poder arrastar e soltar os cards para reorganizar o dashboard. Use estilo escuro para a página, com um título "Dashboard do GitHub" e exibindo data e horário. Se forem necessários bibliotecas externas de JS ou CSS, faça o download e as utilize ou use CDNs.

### Resultados

**Com o Sonnet 4.6 (Thinking)**: diversos erros "The model's generation exceeded the maximum output token limit", o agente tentou contornar esses erros de diversas formas, sem sucesso, por mais de 10 minutos.

**Com o Gemini 3.1 Pro (High)**: gerou o dashboard sem erros, contendo os arquivos `dashboard.html`, `dashboard.js` e `dashboard.css`.

### Resposta do Gemini 3.1 Pro (High):

> Criei o dashboard do GitHub conforme solicitado. Ele foi implementado no arquivo `dashboard.html`, e utiliza os arquivos `dashboard.css` (para o estilo escuro e responsivo) e `dashboard.js` (para a lógica, chamadas à API e persistência).
> 
> Você pode abrir o arquivo `dashboard.html` no seu navegador para testá-lo. Aqui está um resumo das funcionalidades implementadas:
> 
> 1. **Estilo Escuro e Moderno**: A página usa um layout escuro vibrante com tipografia moderna e elementos responsivos em vidro (glassmorphism). O título e a data atual (que é atualizada em tempo real) são exibidos no cabeçalho.
> 2. **Sistema de Grid Arrastável**: Implementado usando `SortableJS`. Você pode clicar no cabeçalho de qualquer card para arrastá-lo e soltá-lo em uma nova posição. O layout se ajusta automaticamente e a ordem é salva.
> 3. **Múltiplos Tipos de Cards**: O dashboard possui um modal onde você pode escolher entre os seguintes tipos de cards:
>    - Informações do Usuário (perfil, bio, estatísticas).
>    - Seguidores do Usuário (lista com foto e link).
>    - Commits Recentes de um repositório.
>    - Issues Recentes.
>    - Pull Requests Recentes.
>    - Releases Recentes.
>    - Colaboradores do Projeto.
>    - Estatísticas do Projeto (um gráfico em linha com `Chart.js` mostrando os commits das últimas 52 semanas).
> 4. **Persistência Local e Cache**:
>    - Todo o estado dos cards e da ordem no dashboard é salvo via `localStorage`. Quando você fechar e abrir a página, eles estarão lá.
>    - Os dados do GitHub ficam cacheados no navegador por 5 minutos para evitar bater os limites de requisições sem autenticação (rate limit).
> 5. **Atualização Manual**: Cada card tem um texto no rodapé com o horário exato da última atualização, e possui um botão de "Atualizar" que ignora o cache e puxa as informações mais recentes da API no momento que você clica.
> 
> Basta abrir o `dashboard.html` para testar. Como o projeto usa apenas HTML, CSS e JavaScript sem depender de bibliotecas pesadas de build ou NodeJS (as dependências do Chart.js, Phosphor Icons e SortableJS são baixadas via CDN), o funcionamento será imediato apenas abrindo no navegador.
