# 🍮 Doce Caramelo — Sistema Interno v3

## Arquivos do projeto

```
doce_caramelo_v3/
├── index.html   ← Site principal
├── db.js        ← Camada de dados (localStorage)
└── README.md    ← Este tutorial
```

---

## 🚀 Como publicar no GitHub Pages (passo a passo)

### 1. Criar conta no GitHub
Acesse https://github.com e crie uma conta gratuita se ainda não tiver.

---

### 2. Criar um repositório
- Clique em **"New"** (botão verde)
- Nome do repositório: `doce-caramelo` (ou qualquer nome)
- Deixe como **Public**
- Clique em **"Create repository"**

---

### 3. Fazer upload dos arquivos
Na tela do repositório criado:
- Clique em **"uploading an existing file"**
- Arraste os 2 arquivos: `index.html` e `db.js`
- Clique em **"Commit changes"**

---

### 4. Ativar o GitHub Pages
- Vá em **Settings** (aba no topo do repositório)
- No menu lateral esquerdo, clique em **"Pages"**
- Em **"Source"**, selecione: **Deploy from a branch**
- Em **"Branch"**, selecione: **main** → **/ (root)**
- Clique em **Save**

---

### 5. Acessar o site
Após 1-2 minutos, seu site estará disponível em:

```
https://SEU_USUARIO.github.io/doce-caramelo/
```

Exemplo: `https://eduardaejunior.github.io/doce-caramelo/`

---

## 💾 Como funciona o banco de dados

O sistema usa **localStorage** do navegador para salvar todos os dados.

**O que isso significa na prática:**
- ✅ Os dados ficam salvos mesmo fechando o navegador
- ✅ Funciona 100% no GitHub Pages sem servidor
- ✅ Rápido e sem custo
- ⚠️ Os dados ficam **no dispositivo** — se trocar de celular/computador, precisa importar

---

## 🔄 Backup dos dados (IMPORTANTE)

Para não perder dados ao trocar de dispositivo:

**Exportar:** Clique em **"↓ Exportar Dados"** na sidebar → salva um arquivo `.json`

**Importar:** Clique em **"↑ Importar Dados"** na sidebar → selecione o `.json` salvo

**Recomendação:** Faça um backup semanal clicando em Exportar.

---

## 🔐 Acesso ao sistema

- **Usuário:** `docecaramelo`
- **Senha:** `eduardaejunior1229`

---

## 🌐 Domínio personalizado (opcional)

Para usar um domínio próprio como `docecaramelo.com`:

1. Compre um domínio (Registro.br para `.com.br`, Namecheap para `.com`)
2. No GitHub Pages Settings, adicione o domínio em **"Custom domain"**
3. No painel do seu domínio, crie um registro **CNAME** apontando para `SEU_USUARIO.github.io`

Para domínio **gratuito**:
- Acesse https://freenom.com
- Registre um `.tk` ou `.ml` (ex: `docecaramelo.tk`)
- Configure o DNS para apontar ao GitHub Pages

---

## 🛠️ Atualizar o site no futuro

Quando precisar atualizar:
1. Acesse seu repositório no GitHub
2. Clique no arquivo `index.html`
3. Clique no ícone de **lápis** (editar)
4. Cole o novo conteúdo
5. Clique em **"Commit changes"**

O site atualiza automaticamente em ~1 minuto.

---

## ❓ Dúvidas

Em caso de problemas, verifique:
- Se os 2 arquivos (`index.html` e `db.js`) estão na **mesma pasta** do repositório
- Se o GitHub Pages está ativado em **Settings → Pages**
- Se acessou a URL correta (com `.github.io`)
