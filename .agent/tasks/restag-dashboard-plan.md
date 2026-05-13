# Plano Arquitetural: Restag Admin & Merchant Dashboards

## 1. Visão Geral
Este documento define a arquitetura e o escopo de implementação para os painéis administrativos do ecosistema Restag, divididos em dois portais isolados para garantir segurança, escalabilidade e uma UX premium.

## 2. Decisões Estratégicas (Gate Cleared)

*   **P0 - Arquitetura de Roteamento:** **Opção B (Padrão adotado)**. Teremos rotas separadas no Next.js (`/restag/admin` e `/restag/merchant`) para garantir isolamento de segurança e interfaces puramente focadas no usuário.
*   **P1 - Foco do MVP do Comerciante:** **Opção A + B**. O painel do dono do restaurante terá Gestão de Reservas (visualização diária/calendário) e Edição de Perfil/Menu (para atualização autônoma de preços, fotos e descrições).
*   **P2 - Poderes do Gestor (Ag47):** **Opção B (Modificada)**. A Ag47 terá um painel focado em Moderação, Overview e aprovação de novos cadastros. Porém, o sistema permitirá a adição de "Contas de Gestores" extras nos restaurantes, permitindo que um membro da Ag47 seja adicionado ao restaurante do cliente temporariamente caso ele precise de suporte (Concierge by-pass).

## 3. Estrutura de Rotas (Next.js App Router)

### 3.1. Portal do Comerciante (Merchant)
Localização: `app/restag/merchant/`
*   `/login`: Autenticação do dono do restaurante.
*   `/dashboard`: Visão geral diária (Reservas de hoje, tráfego, alertas).
*   `/reservas`: Calendário e lista de reservas (Aprovar, Rejeitar, Histórico).
*   `/menu`: Edição de categorias, pratos e preços.
*   `/perfil`: Informações do restaurante, horários de funcionamento, galeria de fotos.
*   `/equipa`: (Novo requisito) Adição de novos gestores/funcionários ao painel do restaurante.

### 3.2. Portal da Agência (Ag47 Admin)
Localização: `app/restag/admin/`
*   `/login`: Autenticação restrita para membros da Ag47.
*   `/dashboard`: Overview financeiro global, métricas de adoção do Restag.
*   `/restaurantes`: Lista de todos os nós (restaurantes) da rede, status de aprovação.
*   `/onboarding`: Aprovação de novos restaurantes que pediram para entrar na plataforma.

## 4. Banco de Dados (Estrutura Inicial Supabase)

Serão necessárias as seguintes tabelas e políticas (RLS) para suportar as funções acima:

1.  **`restag_restaurants`**: Perfil base (nome, slug, morada, descrições).
2.  **`restag_users`**: Tabela de acesso conectada ao `auth.users`, com colunas `role` ('merchant' | 'admin') e `restaurant_id`.
3.  **`restag_menus`**: Pratos associados ao `restaurant_id`.
4.  **`restag_reservations`**: Reservas atreladas ao `restaurant_id`, controlando status ('pendente', 'confirmada', 'cancelada').

*Nota de Segurança (RLS):* Políticas estritas garantirão que um `merchant` só consiga ler/escrever dados onde o `restaurant_id` for igual ao seu, enquanto um `admin` poderá visualizar todos.

## 5. Próximos Passos (Fases de Implementação)

*   **Fase 1: Fundação & Layouts.** Criar os layouts base (`layout.tsx`) isolados para `admin` e `merchant` aplicando o design system "Labs Blueprint".
*   **Fase 2: Mock de Dados & UI Base.** Desenvolver as telas de Dashboard e Menu do Merchant usando dados mockados para validar a experiência visual.
*   **Fase 3: Gestão de Equipe.** Implementar a tela de convites para permitir adição de contas de gestores.
*   **Fase 4: Painel Ag47.** Construir a tabela de overview e aprovação de restaurantes.
*   **Fase 5: Integração Supabase.** Ligar tudo às tabelas reais do banco de dados e aplicar o sistema de login (Auth).
