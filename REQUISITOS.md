# REQUISITOS.md — Vitrine Pública (W10)

## 1. História

**Como** visitante, **eu quero** ver os imóveis pelo navegador **para** procurar do computador, com a mesma informação que o aplicativo mostra.

O site é a outra face do mesmo marketplace: escolhe-se a cidade, filtra-se a vitrine, abre-se a página do imóvel com a galeria e o mapa, e chega-se ao perfil da empresa e ao perfil do corretor, cada um com a vitrine dos seus imóveis.

**Sem login e sem cadastro:** nenhuma tela desta tarefa pode pedir conta.

## 2. Objetivo e escopo

Entregar a vitrine pública web do marketplace Meu Imóvel, permitindo que qualquer visitante pesquise imóveis, consulte informações detalhadas e encontre a empresa e o corretor responsáveis. A aplicação será desenvolvida com React, Vite e JavaScript e consumirá a API existente.

### Dentro do escopo
- Página inicial e escolha de cidade.
- Persistência da cidade selecionada durante a navegação.
- Vitrine pública de imóveis.
- Filtros e ordenação equivalentes aos disponibilizados pela API.
- Página pública de detalhes do imóvel.
- Galeria de imagens.
- Informações específicas da natureza do imóvel.
- Valores e mapa/localização.
- Perfil público da empresa e sua vitrine.
- Perfil público do corretor e sua vitrine.
- Botão de contato pelo WhatsApp na página do imóvel.
- Navegação inteiramente pública, sem login e sem cadastro.

### Fora do escopo
- Login, autenticação e cadastro de visitantes.
- Painel administrativo.
- Gestão de empresas, usuários, corretores ou proprietários.
- Cadastro ou edição de imóveis.
- Áreas autenticadas de corretor, gestor ou cliente.
- Contratos, parcelas, pagamentos e relatórios administrativos.
- Funcionalidades não descritas na W10.

## 3. Ator

| Ator | Acesso | Objetivo |
|---|---|---|
| Visitante | Público, sem conta | Escolher cidade, pesquisar imóveis, consultar detalhes e contactar o corretor |

Não deve existir fluxo de criação de conta ou autenticação para o visitante.

## 4. Requisitos funcionais

### RF-01 — Acesso público
- Todas as páginas e funcionalidades da W10 devem estar disponíveis sem login.
- O visitante não precisa criar conta ou fornecer credenciais.
- Não deve haver telas, modais ou etapas de cadastro/autenticação.
- Atualizar a página ou abrir diretamente uma URL pública não deve exigir sessão.

### RF-02 — Página inicial e escolha da cidade
- Permitir escolher uma cidade na página inicial.
- Manter a cidade escolhida durante a navegação.
- Utilizar a cidade como contexto da vitrine e das buscas.
- Permitir alterar a cidade.
- Obter cidades e identificadores da API.
- Tratar primeiro acesso sem cidade e cidade inválida/indisponível.

### RF-03 — Vitrine de imóveis
- Exibir imóveis públicos disponibilizados pela API para a cidade selecionada.
- Apresentar informações de resumo retornadas pela API, como imagem de capa, título, localização, finalidade, natureza, valores e características disponíveis.
- Permitir abrir os detalhes de um imóvel.
- Respeitar disponibilidade e publicação definidas pelo backend.
- Apresentar estados de carregamento, lista vazia e erro.

### RF-04 — Filtros e ordenação
- Disponibilizar os mesmos filtros oferecidos pela API para a vitrine.
- Disponibilizar as mesmas opções de ordenação da API.
- Enviar filtros, ordenação, cidade e paginação conforme o contrato real.
- Manter filtros ao navegar entre páginas da listagem, quando aplicável.
- Permitir limpar filtros.
- Não criar filtros que não possam ser aplicados pela API.
- Não alterar no navegador a semântica de filtros ou ordenação do servidor.

Os nomes, valores aceitos e opções efetivas devem ser confirmados no contrato vigente da API; este documento não cria parâmetros novos.

### RF-05 — Página de detalhes do imóvel
- Exibir os dados públicos do imóvel selecionado.
- Apresentar galeria com as imagens disponibilizadas pela API.
- Apresentar dados específicos da natureza do imóvel, conforme a natureza e o DTO retornado.
- Apresentar valores aplicáveis conforme finalidade e dados retornados.
- Apresentar localização em mapa, utilizando coordenadas disponibilizadas pela API.
- Apresentar informações públicas do corretor responsável, quando disponíveis.
- Permitir retornar à listagem sem perder desnecessariamente cidade e filtros.
- Tratar imóvel inexistente, indisponível ou não publicado conforme resposta da API.

### RF-06 — Perfil público da empresa
- Permitir acessar o perfil público de uma empresa.
- Exibir dados públicos retornados pela API, como nome, logomarca, descrição e contatos disponíveis.
- Exibir a vitrine dos imóveis públicos vinculados à empresa.
- Permitir abrir os detalhes de cada imóvel.
- Não exibir dados administrativos ou privados.

### RF-07 — Perfil público do corretor
- Permitir acessar o perfil público de um corretor.
- Exibir dados públicos retornados pela API, como nome, foto, CRECI, apresentação e contatos disponíveis.
- Exibir a vitrine dos imóveis públicos vinculados ao corretor.
- Permitir abrir os detalhes de cada imóvel.
- Não exibir dados internos ou privados.
- Respeitar a regra do backend para corretores inativos: não expor perfil ou contato público quando a API os considerar indisponíveis.

### RF-08 — Contato pelo WhatsApp
- Exibir botão de contato pelo WhatsApp na página do imóvel.
- Direcionar ao corretor responsável, utilizando os dados e o fluxo público definidos pela API.
- A mensagem deve identificar o imóvel quando esse recurso for fornecido pelo backend.
- Tratar ausência de número ou indisponibilidade do contato.
- Não exigir login ou cadastro.

**Dependência W11:** a W11 prevê geração do link de WhatsApp no servidor e registro do contato. Verificar se esse endpoint está disponível e alinhar seu uso com a W11. Não afirmar que um contato foi registrado sem confirmação da API.

## 5. Requisitos não funcionais

### RNF-01 — Tecnologia
- React, Vite e JavaScript.

### RNF-02 — Responsividade
- Funcionar em desktop, tablet e celular.
- Priorizar uma experiência desktop bem resolvida, pois a história destaca a pesquisa pelo computador.
- Adaptar galeria, filtros, mapa e cards a telas menores.

### RNF-03 — Consistência com o aplicativo
- As informações devem corresponder às informações públicas fornecidas pela mesma API consumida pelo aplicativo.
- Não criar base independente para imóveis.
- A apresentação pode ser adaptada ao navegador, sem alterar o significado dos dados.

### RNF-04 — Experiência
- Evitar requisições redundantes.
- Exibir feedback de carregamento.
- Tratar imagens ausentes ou indisponíveis.
- Manter navegação previsível e URLs públicas compartilháveis.
- Evitar conteúdo desatualizado após troca de cidade ou filtros.

### RNF-05 — Acessibilidade
- Utilizar elementos semânticos.
- Garantir rótulos claros, foco visível e navegação por teclado.
- Fornecer textos alternativos adequados.
- Não comunicar informações apenas por cores.

### RNF-06 — Segurança e privacidade
- Consumir somente endpoints públicos destinados à vitrine.
- Não solicitar nem armazenar credenciais de visitante.
- Não expor informações privadas ou internas.
- Não colocar segredos em variáveis `VITE_`, pois são expostas ao navegador.
- Tratar dados recebidos da API como conteúdo, não como código confiável.

## 6. Integração e dependências da API

A API é a fonte de verdade para cidades, imóveis, filtros, ordenação, detalhes, empresas, corretores, imagens e disponibilidade pública.

Capacidades identificadas em análise anterior do backend:
- Listagem pública de cidades da vitrine.
- Busca pública de imóveis com filtros e ordenação.
- Detalhe público de imóvel.
- Catálogo público de características.
- Consulta pública de corretor.
- Entrega pública de imagens.

Lacunas identificadas anteriormente, que devem ser revalidadas no código atual da API:
- Endpoint público de perfil/detalhe da empresa com DTO seguro.
- Listagem pública de imóveis por empresa.
- Listagem pública de imóveis por corretor.
- Integração do botão de WhatsApp com o fluxo de registro de contato previsto na W11.

Não assumir que essas lacunas continuam presentes sem verificar a versão atual da API. Se ainda existirem, registrar a dependência e coordenar a implementação no backend.

## 7. Direção visual

Seguir a direção visual aprovada para o Meu Imóvel:
- Visual contemporâneo, elegante e acolhedor.
- Paleta baseada em verde-escuro, tons creme/off-white e detalhes terracota.
- Tipografia expressiva nos títulos e legível no conteúdo.
- Fotografias dos imóveis em destaque.
- Cards com hierarquia clara para imagem, título, localização, valor e características.
- Busca e filtros fáceis de localizar.
- Navegação simples entre vitrine, imóvel, empresa e corretor.

A referência visual orienta a identidade, mas não autoriza funcionalidades fora da W10.

## 8. Critérios de aceite
A W10 será considerada concluída quando:
1. O visitante abrir e navegar pelo site sem login ou cadastro.
2. Escolher uma cidade e manter essa escolha ao navegar.
3. Visualizar a vitrine dessa cidade.
4. Aplicar filtros e ordenação disponibilizados pela API.
5. Abrir um imóvel e visualizar galeria, dados da natureza, valores e mapa.
6. Acessar o perfil público da empresa e visualizar sua vitrine.
7. Acessar o perfil público do corretor e visualizar sua vitrine.
8. Iniciar contato pelo WhatsApp na página do imóvel sem criar conta.
9. Visualizar informações obtidas da API e compatíveis com os dados públicos do aplicativo.
10. Encontrar estados de carregamento, erro, lista vazia e recurso indisponível tratados.
11. Utilizar o site em desktop e telas menores.
12. Ter testes relevantes e build executados, com resultados registrados.

## 9. Pendências para confirmação
- Contrato atual dos endpoints públicos de empresa e imóveis por empresa/corretor.
- Endpoint e fluxo de WhatsApp disponíveis na API/W11.
- Biblioteca/provedor de mapas.
- Estratégia definitiva para persistir e compartilhar a cidade selecionada.
- Opções exatas de filtros, ordenação e paginação na versão atual da API.
