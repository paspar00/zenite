# Especificação Técnica e de Produto — Módulo de Marketing TicketHub

**Versão:** 1.0
**Data:** 2026-05-25
**Plataforma base:** hi.events (Laravel 10 + React/Vite SSR)

---

## Estado atual do sistema

| Entidade | Status | Observação |
|---|---|---|
| `User` | Existe | Organizer. Campo `marketing_opted_in_at` já existe |
| `Account` | Existe | Workspace do organizador |
| `Order` | Existe | `opted_into_marketing_at` já no schema. `affiliate_id` FK existe |
| `Affiliate` | Existe | `code`, `email`, `total_sales`, `total_sales_gross` — sem atribuição por UTM |
| `Attendee` | Existe | NÃO é `User`. Sem visão unificada cross-event |
| `EventSetting` | Existe | `show_marketing_opt_in` boolean já existe |
| `AccountAttribution` | Existe | UTM ligado a `Account`, **não a Order** |
| UTM frontend | Existe | `utm.ts` captura params — **não persiste no backend por Order** |
| Emails bulk | Não existe | Só transacionais (15+ Mailables). Sem opt-in filter |
| Supressão/unsubscribe | Não existe | Nenhum mecanismo |
| Wallet/cashback | Não existe | Nenhuma infra financeira interna |

---

## Dependências entre features

```
[1] LGPD Foundation
    └─► [2] UTM/Affiliate Attribution
         └─► [3] Campaign Links
              └─► [4] Marketing Base
                   └─► [5] Audience Builder
                        └─► [6] Cashback/Wallet
```

Nenhuma feature downstream deve ser desenvolvida sem a upstream estar completa.

---

## Feature 1 — LGPD Compliance Foundation

**Complexidade: M | Pode começar: agora**

### Problema
O sistema já coleta consentimento (`opted_into_marketing_at`) mas não oferece mecanismo de cancelamento, supressão, nem trilha de auditoria. Viola a LGPD (Lei 13.709/2018). **Sem esta feature, nenhuma outra feature de marketing pode ser lançada.**

### Schema

**`marketing_suppressions`**
| Coluna | Tipo | Obs |
|---|---|---|
| `id` | `bigint PK` | |
| `account_id` | `bigint FK accounts` | escopo do organizador |
| `email` | `varchar(255)` | normalizado lowercase |
| `reason` | `enum` | `unsubscribe`, `bounce_hard`, `bounce_soft`, `spam_complaint`, `manual`, `lgpd_erasure` |
| `source` | `enum` | `order_flow`, `email_link`, `api`, `organizer_import`, `provider_webhook` |
| `suppressed_at` | `timestamp` | |
| `expires_at` | `timestamp nullable` | para bounce_soft com retry futuro |
| `metadata` | `json nullable` | headers bounce, IP, user-agent |

Index: `(account_id, email)` UNIQUE onde `expires_at IS NULL`.

**`marketing_consent_audit`** (append-only, nunca deletar)
| Coluna | Tipo | Obs |
|---|---|---|
| `id` | `bigint PK` | |
| `account_id` | `bigint FK accounts` | |
| `email` | `varchar(255)` | |
| `order_id` | `bigint FK orders nullable` | |
| `attendee_id` | `bigint FK attendees nullable` | |
| `action` | `enum` | `opt_in`, `opt_out`, `erasure_request`, `data_export_request` |
| `ip_address` | `varchar(45)` | |
| `user_agent` | `text nullable` | |
| `consent_text_snapshot` | `text` | texto exato exibido no opt-in |
| `event_id` | `bigint FK events nullable` | |
| `created_at` | `timestamp` | imutável |

### Componentes backend
- `MarketingSuppressionRepository` + Interface
- `MarketingConsentAuditRepository` + Interface
- `CheckSuppressionService` — chamado antes de qualquer envio
- `UnsubscribeHandler` — cria supressão + audit entry
- `LgpdErasureHandler` — anonimiza PII em Orders/Attendees + audit
- Signed URL route: `GET /unsubscribe/{token}` (HMAC-SHA256, TTL 30 dias)
- Webhook receiver para bounce/spam (Mailgun, SES, Postmark)
- Adicionar `SUPPRESSED` ao `OutgoingMessageStatus` enum

### Componentes frontend
- Página pública `/unsubscribe` (SSR safe)
- "Gerenciar preferências de email" na área do comprador

---

## Feature 2 — UTM / Affiliate Attribution Persistence

**Complexidade: S | Pode começar: em paralelo com Feature 1**

### Problema
`AccountAttribution` existe mas está ligado a `Account` (conversão de cadastro), não a `Order`. Não é possível responder "qual campanha gerou esta venda?".

### Schema

**`order_attributions`**
| Coluna | Tipo | Obs |
|---|---|---|
| `id` | `bigint PK` | |
| `order_id` | `bigint FK orders UNIQUE` | 1:1 |
| `affiliate_id` | `bigint FK affiliates nullable` | |
| `utm_source` | `varchar(255) nullable` | |
| `utm_medium` | `varchar(255) nullable` | |
| `utm_campaign` | `varchar(255) nullable` | |
| `utm_term` | `varchar(255) nullable` | |
| `utm_content` | `varchar(255) nullable` | |
| `utm_raw` | `json nullable` | params completos |
| `referrer_url` | `text nullable` | |
| `landing_page` | `text nullable` | |
| `gclid` | `varchar(255) nullable` | Google Ads |
| `fbclid` | `varchar(255) nullable` | Meta Ads |
| `session_id` | `varchar(255) nullable` | |

### Fluxo
```
Frontend (utm.ts) → payload da order (campo attribution{})
  → CompleteOrderActionPublic → CreateOrderPublicDTO
  → CreateOrderHandler → OrderAttributionService::persist()
  → order_attributions INSERT
```

Modelo: **first-touch** (grava somente na criação, imutável).

---

## Feature 3 — Campaign Links por Persona

**Complexidade: M | Pré-requisitos: Features 1 + 2**

### Problema
Não existe forma de criar links rastreáveis distintos por tipo de audiência (VIP, imprensa, público geral, influencer).

### Schema

**`campaign_links`**
| Coluna | Tipo | Obs |
|---|---|---|
| `id` | `bigint PK` | |
| `account_id` | `bigint FK accounts` | |
| `event_id` | `bigint FK events nullable` | |
| `affiliate_id` | `bigint FK affiliates nullable` | |
| `name` | `varchar(255)` | nome interno |
| `persona` | `enum` | `vip`, `press`, `public`, `influencer`, `partner`, `custom` |
| `slug` | `varchar(100) UNIQUE` | ex: `tb_abc123` |
| `destination_url` | `text` | URL final |
| `utm_source/medium/campaign/term/content` | `varchar(255) nullable` | |
| `max_uses` | `int nullable` | null = ilimitado |
| `use_count` | `int default 0` | incrementado atomicamente |
| `expires_at` | `timestamp nullable` | |
| `is_active` | `boolean default true` | |
| `password` | `varchar(255) nullable` | bcrypt, para links VIP |

**`campaign_link_clicks`**
| Coluna | Tipo | Obs |
|---|---|---|
| `id` | `bigint PK` | |
| `campaign_link_id` | `bigint FK` | |
| `order_id` | `bigint FK orders nullable` | preenchido na conversão |
| `ip_hash` | `varchar(64)` | SHA-256 do IP (nunca IP raw — LGPD) |
| `user_agent_hash` | `varchar(64)` | |
| `clicked_at` | `timestamp` | |
| `converted_at` | `timestamp nullable` | |

### Rota pública
```
GET /l/{slug}           → redireciona com UTMs appended
GET /l/{slug}?pw={pass} → verifica senha (links VIP)
```

### Relatório
`GET /api/organizer/campaign-links/{id}/stats` → clicks, conversions, conversion_rate, revenue_attributed.

---

## Feature 4 — Base Global de Marketing (MarketingSubscriber)

**Complexidade: L | Pré-requisito: Feature 1**

### Problema
`Attendee` não é `User`. Um comprador em 3 eventos diferentes aparece como 3 Attendees sem relação. Não existe entidade unificada de "contato de marketing".

### Schema

**`marketing_subscribers`**
| Coluna | Tipo | Obs |
|---|---|---|
| `id` | `bigint PK` | |
| `account_id` | `bigint FK accounts` | escopo do organizador |
| `email` | `varchar(255)` | normalizado lowercase |
| `first_name/last_name` | `varchar nullable` | |
| `phone` | `varchar(30) nullable` | |
| `locale` | `varchar(10) nullable` | ex: `pt_BR` |
| `country_code` | `char(2) nullable` | ISO 3166-1 |
| `city/state` | `varchar nullable` | |
| `status` | `enum` | `active`, `unsubscribed`, `suppressed`, `pending_confirmation` |
| `source` | `enum` | `order_checkout`, `manual_import`, `api`, `campaign_link`, `waitlist` |
| `opted_in_at/opted_out_at` | `timestamp nullable` | |
| `last_activity_at` | `timestamp nullable` | |
| `tags` | `json nullable` | array de strings |
| `custom_fields` | `json nullable` | |
| `external_id` | `varchar(255) nullable` | integração ESP externo |

Index: `(account_id, email)` UNIQUE.

**`marketing_subscriber_sources`** (pivot de rastreabilidade)
| Coluna | Tipo | Obs |
|---|---|---|
| `marketing_subscriber_id` | `bigint FK` | |
| `order_id` | `bigint FK nullable` | |
| `attendee_id` | `bigint FK nullable` | |
| `event_id` | `bigint FK nullable` | |
| `affiliate_id` | `bigint FK nullable` | |
| `campaign_link_id` | `bigint FK nullable` | |

### Alimentação da base
1. Checkout concluído com consentimento → `upsert` por `(account_id, email)`
2. Importação manual CSV (com `consent_date` obrigatório)
3. API autenticada
4. Waitlist com consentimento

---

## Feature 5 — Audience Builder

**Complexidade: XL | Pré-requisitos: Features 1 + 4**

### Schema

**`audience_segments`**
| Coluna | Tipo | Obs |
|---|---|---|
| `id` | `bigint PK` | |
| `account_id` | `bigint FK accounts` | |
| `name` | `varchar(255)` | |
| `filter_config` | `json` | árvore de filtros AND/OR |
| `estimated_count` | `int nullable` | cache assíncrono |
| `is_dynamic` | `boolean default true` | false = snapshot |

**Estrutura `filter_config`:**
```json
{
  "operator": "AND",
  "rules": [
    { "type": "marketing_opt_in", "value": true },
    { "type": "event_attendance", "operator": "in", "event_ids": [12, 45] },
    { "type": "product_purchase", "product_ids": [7], "operator": "any" },
    { "type": "affiliate", "affiliate_ids": [3] },
    { "type": "location", "country_code": "BR", "state": "SP" },
    { "type": "last_activity", "operator": "within_days", "value": 90 },
    { "operator": "OR", "rules": [
        { "type": "tag", "value": "vip" },
        { "type": "tag", "value": "imprensa" }
    ]}
  ]
}
```

### Filtros suportados (v1)
| Filtro | Operadores |
|---|---|
| `marketing_opt_in` | `=` |
| `event_attendance` | `in`, `not_in` |
| `product_purchase` | `any`, `all`, `none` |
| `affiliate` | `in`, `not_in` |
| `campaign_link` | `in` |
| `location` | `=`, `in` |
| `tag` | `contains`, `not_contains` |
| `last_activity` | `within_days`, `before_days` |
| `status` | `=`, `in` |

### Fluxo de envio por segmento
```
Organizer seleciona segmento
  → ResolveSegmentSubscribersService → lista de IDs
  → CheckSuppressionService → remove suprimidos
  → Snapshot do segmento (is_dynamic = false no momento do disparo)
  → SendCampaignJob (throttle por AccountMessagingTier)
```

---

## Feature 6 — Cashback / Wallet

**Complexidade: XL+ | Status: BLOQUEADO — decisão de produto pendente**

### Decisões obrigatórias antes de qualquer código
| Pergunta | Opção A | Opção B |
|---|---|---|
| Quem arca com o cashback? | TicketHub | Organizador (% por evento) |
| O saldo expira? | Sim, TTL configurável | Não expira |
| O saldo é resgatável em dinheiro? | Não (só crédito) | Sim (Pix) — ⚠️ requer parecer BACEN |
| Escopo do saldo | Por organizador | Cross-organizador |
| Ativa para free tiers? | Não | Sim |

> ⚠️ **Não implementar Feature 6 até que essas decisões sejam formalizadas por escrito.** Se "resgatável em dinheiro" for Opção B, consultar advogado com expertise em regulação BACEN/Banco Central antes de codificar.

### Esboço condicional (modelo mais simples: crédito por organizador, não resgatável)

**`wallet_accounts`** — saldo por subscriber por organizador
**`wallet_transactions`** — ledger append-only (credit/debit)

Regras mínimas:
- Cashback apenas em orders `COMPLETED` após período de chargeback
- `balance_cents` nunca negativo (pessimistic lock `SELECT FOR UPDATE`)
- Idempotência por `reference_id` — evitar duplo crédito

---

## Resumo Executivo

| # | Feature | Complexidade | Pode começar? |
|---|---|---|---|
| 1 | LGPD Foundation | **M** | ✅ Agora |
| 2 | UTM Attribution | **S** | ✅ Em paralelo com 1 |
| 3 | Campaign Links | **M** | Após 1 + 2 |
| 4 | Marketing Base | **L** | Após 1 |
| 5 | Audience Builder | **XL** | Após 4 |
| 6 | Cashback/Wallet | **XL+** | ❌ Aguardar decisão de produto |

## Ordem de desenvolvimento recomendada
```
Sprint 1: Feature 1 (LGPD) + Feature 2 (UTM) em paralelo
Sprint 2: Feature 3 (Campaign Links) + Feature 4 (Marketing Base)
Sprint 3: Feature 5 (Audience Builder)
Sprint 4+: Feature 6 (Cashback) — apenas após decisão de produto
```

---

## Convenções do projeto (hi.events)
- DTOs estendem `BaseDataObject`, usam Spatie Laravel Data
- Domain Objects via `php artisan generate-domain-objects` — nunca editar `Generated/` manualmente
- Repositories: usar `findFirstWhere()` antes de criar método bespoke
- Actions estendem `BaseAction`, usam `resourceResponse()` / `deletedResponse()`
- Exceções: criar exceções customizadas (ex: `SubscriberAlreadySuppressedException`)
- Frontend: React Query para mutations; `showError`/`showSuccess` de `utilites/notifications.tsx`
- Strings novas: `__()` backend / `t()` Lingui frontend + executar `/translations` imediatamente

---

*Auditoria baseada no código-fonte real. Última revisão: 2026-05-25.*
