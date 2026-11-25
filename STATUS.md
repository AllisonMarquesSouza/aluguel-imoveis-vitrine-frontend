# STATUS.md — Vitrine Pública W10

## Situação geral

**Frontend implementado para os contratos públicos documentados.** A conclusão ponta a ponta da W10 depende de duas consultas de vitrine ainda não documentadas pela API: perfil público independente de empresa e listagem de imóveis por empresa/corretor. A integração real também aguarda execução contra uma instância da API.

Não foram feitas alterações no repositório do backend, commits, pushes ou deploys.

## Implementado

- [x] Estrutura React + Vite + JavaScript e cliente HTTP centralizado, configurável por `VITE_API_BASE_URL`.
- [x] Página inicial pública com busca rápida e escolha de cidade.
- [x] Persistência de cidade em `localStorage` e em `cidadeId` na URL; cidades inválidas não são substituídas silenciosamente.
- [x] Vitrine com `texto`, `finalidade`, `natureza`, faixa de preço, quartos, suítes, vagas, bairro, área, características repetidas, ordenação e paginação descritos no README da API `main`.
- [x] Detalhe público com galeria, características da natureza, valores, localização, mapa OSM, corretor e empresa quando disponíveis no DTO público.
- [x] Ação WhatsApp com `POST /vitrine/imoveis/{id}/contatos` e canal `WHATSAPP`; o link só abre após resposta com `whatsappUrl`.
- [x] Página pública de corretor via `GET /corretor/{id}`; erro 404 para perfis indisponíveis é tratado.
- [x] Página de empresa que apresenta apenas dados aninhados recebidos do perfil público de um corretor ativo.
- [x] Estados de carregamento, erro, lista vazia, cidade inválida, recurso não encontrado e imagem indisponível.
- [x] Layout responsivo, foco visível, rótulos, navegação por teclado e textos alternativos.
- [x] Sem telas, rotas ou ações de login/cadastro.
- [x] README atualizado com comandos e integração real.

## Lacunas do contrato da API

A branch `main` do README da API documenta `GET /corretor/{id}` como público e a resposta inclui a empresa do corretor. Não documenta:

- consulta pública direta de perfil da empresa; as consultas existentes de empresa por ID exigem autenticação;
- filtro ou endpoint público para listar imóveis por empresa;
- filtro ou endpoint público para listar imóveis por corretor.

Por isso, as páginas de empresa/corretor informam a lacuna e não exibem resultados de outra busca como se fossem os imóveis daquele perfil. Para concluir essas vitrines, proponho uma mudança coordenada na API: expor DTOs públicos seguros para empresa e corretor e oferecer busca paginada de imóveis publicados por `empresaId` e `corretorId`, sempre respeitando publicação, disponibilidade e status ativo definidos pelo servidor.

O endpoint de contato WhatsApp está documentado na W11 e foi integrado. O mapa usa um embed do OpenStreetMap e as coordenadas do DTO, sem chave de API.

## Validação e limitações

- [x] `npm run lint` — aprovado.
- [x] `npm run build` — aprovado; imagem decorativa do hero convertida para WebP (~256 kB).
- [x] Smoke HTTP no Vite: `/`, `/imoveis`, `/imovel/12`, `/corretor/7` e `/empresa/12` responderam `200 text/html` ao abrir URLs diretamente.
- [ ] Teste visual em navegador, responsividade e interações: não executado porque o serviço de navegador desta sessão estava indisponível.
- [ ] Testes automatizados: o `package.json` não contém script de testes.
- [ ] Integração real com a API: não executada; a API não estava ativa em `localhost:8080`. O visitante pode validar localmente com o backend disponível.
- [ ] Contratos confirmados lendo os controllers/DTOs do backend: não concluído. O README da API na branch `main` e o `pom.xml` foram consultados pela integração GitHub; o clone do repositório falhou por bloqueio de DNS, e a busca de código não retornou arquivos.

O smoke HTTP confirma somente o fallback de rotas do Vite; não comprova a renderização ou os fluxos contra a API. Não há dados de demonstração ou mocks incluídos na aplicação.

## Histórico

| Data | Atualização |
|---|---|
| 2026-11-25 | Implementação inicial das páginas públicas, serviços da API, estados de interface, responsividade e configuração local. Lint, build e smoke HTTP das rotas executados; lacunas da API e validações pendentes registradas. |
