# 🧩 Shell Script Manager

Interface visual para listar e executar scripts `.sh` diretamente do navegador.

Ideal para uso pessoal ou em equipe, tornando a automação mais acessível com uma interface amigável e moderna.

---

## 🚀 Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/GiovaniDaSilva/shell-script-manager.git
cd shell-script-manager/project
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Rode o projeto

```bash
npm run dev
```

> Isso inicia o **frontend (React + Vite)** e o **backend (Node + Express)** ao mesmo tempo.

O navegador abrirá automaticamente em:  
👉 [`http://localhost:5173`](http://localhost:5173)

---

## 📁 Onde colocar os scripts

Coloque seus arquivos `.sh` na pasta configurada na interface, ou crie uma pasta específica (ex: `~/scripts`) e aponte no campo “Configure Path”.

---

## 🧠 Tecnologias usadas

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

## ✨ Recursos

- Listagem automática de scripts `.sh`
- Execução com feedback visual
- Interface moderna, responsiva e intuitiva
- Suporte a múltiplos scripts
- Configuração dinâmica de diretório

---

## 🔐 Requisitos

- Node.js 18 ou superior
- Linux (com suporte a `bash`)

---

## 🧼 Dica extra

Você pode criar um script `.sh` para iniciar o app automaticamente:

```bash
#!/bin/bash

echo "Iniciando Script Manager..."
cd /caminho/para/o/projeto || exit
xdg-open http://localhost:5173 &> /dev/null &
npm run dev
```

---
