# Meu Imóvel — Vitrine pública

Aplicação pública do marketplace Meu Imóvel, feita com React, Vite e JavaScript. Visitantes escolhem uma cidade, pesquisam imóveis, consultam detalhes e acessam os perfis públicos de corretores e empresas sem login ou cadastro.

## Escopo W10

- Página inicial com seleção de cidade e busca rápida.
- Vitrine com os filtros, enumerações, ordenação e paginação documentados pela API.
- Detalhe público com galeria, características da natureza, valores, mapa e contato pelo WhatsApp.
- Perfil público de corretor e dados públicos da empresa associada.
- Navegação pública por URL; a cidade também fica em `localStorage` para ser recuperada em outras páginas.

As rotas públicas implementadas são `/`, `/imoveis`, `/imovel/:id`, `/corretor/:id` e `/empresa/:id`. Toda a navegação funciona sem conta.

## Desenvolvimento

Pré-requisitos: Node.js compatível com Vite 8 e npm.

```bash
npm install
npm run dev
```

A API local é usada por padrão em `http://localhost:8080`. Para apontar a aplicação a outro ambiente, crie `.env` na raiz (há um `.env.example`) e defina:

```env
VITE_API_BASE_URL=https://endereco-da-api
```

Essa variável é incluída no navegador. Não use nela tokens, senhas ou outros segredos.

## Validação e build

```bash
npm run lint
npm run build
npm run preview
```

O projeto ainda não define script de testes automatizados (`npm test`). A validação da interface e da integração depende de uma API acessível e com imóveis públicos disponíveis.

## Integração pública

O cliente HTTP fica em `src/api/http.js`; chamadas de dados estão em `src/api/publicApi.js`. O frontend usa os endpoints públicos documentados no [README da API na branch `main`](https://github.com/AllisonMarquesSouza/aluguel-imoveis-api/blob/main/README.md):

- `GET /vitrine/cidades`
- `GET /vitrine/imoveis` e `GET /vitrine/imoveis/{id}`
- `GET /caracteristica`
- `GET /corretor/{id}`
- `GET /imagens/{tipo}/{entidadeId}/{imagemId}` (pelas URLs retornadas nos DTOs)
- `POST /vitrine/imoveis/{id}/contatos` com `{"canal":"WHATSAPP"}`

A busca envia `cidadeId`, `texto`, `finalidade`, `natureza`, `precoMinimo`, `precoMaximo`, `quartos`, `suites`, `vagas`, `bairro`, `areaMinima`, `areaMaxima`, `caracteristicas` repetido, `ordenacao`, `pagina` e `tamanho`, quando aplicável. Os enums da API são mantidos na URL e traduzidos apenas na interface.

O link de WhatsApp só é aberto depois que o `POST` confirmar o registro do contato e retornar `whatsappUrl`.

## Dependências da API

O README da API na branch `main` não documenta consulta pública de empresa nem listagem de imóveis por empresa ou por corretor. O perfil da empresa pode exibir os dados que vêm aninhados no DTO público de um corretor ativo quando o visitante chega pelo detalhe do imóvel. A vitrine individual de empresa/corretor mostra a lacuna explicitamente; imóveis de outra consulta não são apresentados como se fossem desses perfis.

Para concluir essas vitrines sem filtrar no navegador, a API precisa oferecer DTOs públicos e filtros/endpoints de imóveis por empresa e por corretor. O detalhe público de empresa também precisa ser consultável sem autenticação. Nenhuma alteração foi feita no backend.

## Estrutura

- `src/api/`: configuração HTTP e serviços públicos.
- `src/components/`: cabeçalho, cards, filtros, ícones, imagens públicas e estados de interface.
- `src/pages/`: páginas da vitrine, detalhe e perfis públicos.
- `src/utils/`: apresentação de valores, áreas, localização e imagens.
- `docs/references/w10-design.png`: referência visual da W10.

## Documentos

- [`AGENTS.md`](./AGENTS.md): regras do repositório.
- [`REQUISITOS.md`](./REQUISITOS.md): critérios W10.
- [`STATUS.md`](./STATUS.md): implementação e validação atual.
