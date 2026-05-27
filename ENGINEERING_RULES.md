# ENGINEERING_RULES.md

Regras de engenharia para manter o código enxuto, desacoplado e sustentável.

## Objetivo

- Preservar arquitetura, legibilidade, testabilidade e previsibilidade.
- Evitar acoplamento acidental, duplicação, rotas improvisadas e código morto.
- Favorecer evolução incremental sem degradar o domínio existente.

## Princípios Gerais

- Sempre implementar a solução no lugar correto da arquitetura, não no lugar mais rápido.
- Preferir composição, responsabilidades pequenas e fluxo explícito.
- Toda nova regra de negócio deve ter um ponto de entrada claro e rastreável.
- Se uma mudança parecer “quebra-galho”, ela provavelmente precisa de outro desenho.

## Backend

### Fluxo Arquitetural

- Respeitar o fluxo `Action -> Handler -> Domain Service -> Repository`.
- Não acoplar regra de negócio em `Action`, `Resource`, `Request` ou `Repository`.
- Não acessar Eloquent fora de `Repository`.
- Não transformar `Handler` em depósito de múltiplas responsabilidades.

### Rotas e Endpoints

- Sempre criar a rota correta para o caso de uso correto.
- Não reaproveitar endpoint existente quando o comportamento for semanticamente diferente.
- Não esconder comportamento novo atrás de parâmetros opcionais confusos.
- Se o caso de uso for novo, criar `Action`, `DTO`, `Handler` e rota próprios.

### Domínio e Regras

- Não acoplar funcionalidades diferentes na mesma função só para “aproveitar”.
- Extrair regra compartilhada apenas quando houver reuso real e sem distorcer o domínio.
- Nomear métodos e classes pelo comportamento de negócio, não por detalhe técnico.
- Não introduzir condicionais excessivas onde o domínio pede separação.

### Repositórios

- Repositório consulta e persiste; não orquestra fluxo de negócio.
- Evitar métodos genéricos demais com comportamento implícito.
- Criar método novo de repositório quando ele representar claramente uma consulta recorrente do domínio.

### Jobs e Performance

- Toda operação que não precisa de resposta imediata (email, sync, stats) DEVE usar queue job — nunca executar de forma síncrona dentro de um request HTTP.
- Nunca carregar relação Eloquent dentro de loop — usar eager loading no repositório.
- Todo endpoint de lista DEVE ter paginação forçada (máximo 100 registros por página).

### Migrações

- Nunca remover coluna diretamente em produção — deprecar na primeira release, remover na seguinte.
- Toda migration deve ser segura para rodar com tráfego ativo (sem table locks prolongados).
- Não usar `$table->dropColumn()` em migrations sem análise de impacto em produção.

### Segurança e Privacidade

- Nunca logar PII (email, nome, CPF, IP raw) em nível INFO ou ERROR.
- Tokens públicos (unsubscribe, waitlist, check-in) sempre HMAC-SHA256 com TTL explícito.
- Conteúdo HTML gerado pelo usuário SEMPRE passa por HtmlPurifierService antes de persistir.
- Base64 em URLs: sempre remover padding `=` na geração, re-adicionar no decode.

### Código Morto

- Não deixar código morto, imports mortos, rotas órfãs, componentes não usados ou flags abandonadas.
- Ao substituir fluxo antigo, remover o que ficou obsoleto no mesmo PR sempre que seguro.
- Não comentar código para “guardar depois”; usar histórico do git.

### Qualidade

- Toda alteração deve reduzir ou preservar a clareza do sistema, nunca piorá-la.
- Evitar duplicação silenciosa de validação, transformação ou autorização.
- Tratar erro no nível correto com exceções e respostas coerentes.
- Escrever testes para comportamento novo e ajustar os existentes quando o contrato mudar.

## Frontend

### Estrutura

- Não acoplar lógica de negócio diretamente na UI quando ela puder viver em query, mutation, hook ou camada de API.
- Não usar tela existente como “atalho” para resolver fluxo diferente sem modelar isso claramente.
- Reutilizar componentes quando o comportamento for o mesmo; separar quando a responsabilidade divergir.

### Rotas

- Criar rota dedicada quando houver jornada própria de usuário.
- Não esconder página nova dentro de rota antiga sem necessidade funcional.
- Rotas devem refletir o modelo mental do usuário e o caso de uso real.

### Estado e Dados

- Toda integração com API deve passar por client/query/mutation apropriados.
- Não espalhar fetch manual e estado duplicado onde React Query já resolve.
- Invalidar cache de forma consciente quando o dado exibido depender da mutação.

### UX e Manutenção

- Não deixar texto, loading, erro e estado vazio implícitos.
- Toda tela nova deve ter estado de carregamento, erro e vazio.
- Não adicionar complexidade visual sem necessidade de produto.

## Checklist Antes de Fechar

- A funcionalidade entrou na camada certa?
- A rota criada representa corretamente o caso de uso?
- Há código morto, duplicado ou acoplado que pode ser removido agora?
- O nome das classes e métodos reflete o domínio?
- O fluxo ficou mais claro para a próxima pessoa que tocar nisso?
- A alteração tem teste ou validação suficiente para evitar regressão?

## Regra de Decisão

Se houver dúvida entre “encaixar rápido” e “modelar direito”, escolher modelar direito.
