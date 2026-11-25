# AGENTS.md — Vitrine pública Meu Imóvel (W10)

## Contexto

Este repositório implementa o site público da vitrine de imóveis do marketplace Meu Imóvel, conforme a W10, usando React, Vite e JavaScript. O site é a versão web pública do mesmo marketplace consumido pelo aplicativo.

**Regra inegociável: todo o site funciona sem login e sem cadastro.** Não criar tela, botão, modal, rota ou fluxo de autenticação/cadastro nesta aplicação.

## Fontes de verdade

Antes de implementar:

1. Leia `README.md`, `REQUISITOS.md` e `STATUS.md`.
2. Inspecione a estrutura e os padrões deste repositório.
3. Consulte o repositório da API conectado como fonte técnica secundária.
4. Confirme endpoints, métodos, parâmetros, DTOs, enums, filtros, ordenação, paginação e respostas diretamente no código da API.
5. Não presuma que um endpoint existe apenas porque é necessário ao requisito.

A história W10 define o comportamento esperado; a API define o contrato técnico e é a fonte de verdade dos dados. Se faltar endpoint ou campo, registre a lacuna e proponha uma alteração coordenada na API. Não simule endpoint inexistente, não acesse o banco diretamente e não use mocks em produção.

## Escopo

- Implementar somente escolha de cidade, vitrine, detalhe do imóvel, perfil público da empresa e perfil público do corretor.
- Não implementar painel administrativo, login, cadastro, área de cliente, corretor ou gestor.
- Não criar regras de negócio que pertencem à API.
- Não alterar o repositório da API como efeito colateral. Descreva separadamente qualquer mudança necessária no backend.
- Não adicionar funcionalidades fora da W10 sem solicitação.

## Regras funcionais

- A navegação começa na vitrine pública, sem autenticação.
- O visitante escolhe uma cidade; a escolha continua aplicada ao navegar e retornar à vitrine.
- Filtros e ordenação devem corresponder aos oferecidos pela API.
- A página do imóvel apresenta galeria, dados da natureza, valores e mapa, conforme dados disponíveis.
- Deve ser possível acessar os perfis públicos da empresa e do corretor, cada um com sua vitrine de imóveis.
- A página do imóvel oferece contato pelo WhatsApp.
- Nenhuma tela pode solicitar conta, login ou cadastro.

## Integração com a API

- Centralize URL base e configuração HTTP.
- Mantenha chamadas HTTP fora dos componentes de apresentação sempre que a estrutura permitir.
- Alinhe objetos JavaScript aos DTOs reais; não invente campos, enums ou parâmetros.
- Preserve os valores contratuais dos enums e traduza-os apenas na apresentação.
- Envie filtros, ordenação, paginação e cidade conforme o contrato real.
- Não reimplemente no navegador filtros ou ordenações que pertencem ao servidor.
- Trate carregamento, respostas vazias, erros, indisponibilidade e recursos não encontrados.
- Consuma apenas endpoints públicos e não exponha dados internos ou privados.

### WhatsApp

A W11 prevê geração do link de WhatsApp no servidor e registro do contato. Verifique se esse endpoint está disponível antes de integrar. Se ainda não estiver, registre a dependência e alinhe a integração com a W11. Não afirme que um contato foi registrado sem confirmação da API.

## Cidade e navegação

- A cidade selecionada deve permanecer válida entre vitrine, detalhes e perfis.
- Utilize estratégia explícita de persistência no navegador e/ou URL.
- Ao abrir uma URL diretamente, recupere a cidade necessária ou solicite sua escolha de forma clara.
- Não sobrescreva silenciosamente uma escolha do visitante.
- Não dependa de sessão autenticada.

## Interface e qualidade

- Siga a identidade visual aprovada: contemporânea, acolhedora e premium, com tons claros, verde-escuro e detalhes terracota.
- Priorize fotografias, busca clara e navegação simples.
- Mantenha consistência entre homepage, listagem, detalhe e perfis.
- Desenvolva layouts responsivos para desktop, tablet e celular.
- Trate carregamento, erro, lista vazia, imagem indisponível e recurso não encontrado.
- Use HTML semântico, rótulos acessíveis, foco visível e navegação por teclado.
- Não use apenas cor para comunicar informações.
- Dados de demonstração devem ficar isolados em desenvolvimento/testes.

## Padrões de código

- Utilize React, Vite e JavaScript, respeitando a configuração existente.
- Siga convenções e dependências já adotadas.
- Prefira componentes pequenos e reutilizáveis com responsabilidades claras.
- Separe páginas, componentes, integração HTTP e utilitários quando fizer sentido.
- Crie arquivos CSS diferentes para cada componente ou algo do tipo, evite acoplar todos as decoracoes em um unico arquivo.
- Evite abstrações prematuras, duplicação e dependências sem justificativa.
- Não introduza TypeScript ou bibliotecas de roteamento, estado ou UI sem alinhamento.
- Não refatore código não relacionado.

## Testes e validação

Ao concluir:

1. Execute scripts disponíveis de lint, testes e build.
2. Teste navegação sem login/cadastro.
3. Teste persistência da cidade ao navegar e atualizar a página.
4. Teste filtros, ordenação e paginação conforme a API.
5. Teste detalhes, galeria, mapa, perfis e imóveis relacionados.
6. Teste o fluxo de WhatsApp conforme endpoint disponível.
7. Teste estados vazios, falhas da API, 404 e imagens indisponíveis.
8. Verifique responsividade e acessibilidade básica.

Informe o que foi executado e o que não pôde ser validado. Não declare sucesso sem executar os testes/build.

## Git e documentação

- Não faça commit, push, merge ou deploy sem solicitação explícita.
- Não sobrescreva alterações locais.
- Mantenha alterações limitadas à tarefa.
- Ao finalizar, resuma arquivos alterados, comportamento, validações e pendências.
- Atualize `STATUS.md` quando o estado mudar.
- Atualize `REQUISITOS.md` somente quando uma mudança de escopo for aprovada.
- Mantenha o `README.md` coerente com os comandos e a estrutura reais.
