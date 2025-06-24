# 🚀 API de Produtos Scoders - Backend NestJS

Bem-vindo à API de Produtos desenvolvida com **NestJS**!  
Este backend oferece autenticação, gerenciamento completo de usuários e produtos, cache com Redis, e comunicação em tempo real via WebSocket.

---

## 🧩 Módulos da Aplicação

### 🔐 Autenticação
- Login com geração de token JWT

### 👥 Usuários
- CRUD completo de usuários
- Rotas protegidas por autenticação

### 📦 Produtos
- CRUD completo de produtos
- Cache de produtos com **Redis Cloud**
- Atualizações em tempo real via **WebSocket**
- **Atenção**: É necessário estar **logado** para criar, editar ou deletar um produto

---

## ⚙️ Tecnologias Utilizadas

- **NestJS**: Framework robusto para construção de APIs com TypeScript
- **TypeScript**: Tipagem estática e segura
- **Redis Cloud**: Armazenamento em cache dos produtos
- **WebSocket (Socket.io)**: Comunicação em tempo real entre backend e frontend
- **Swagger**: Documentação de API automática
- **ReDoc**: Alternativa visual e bonita para documentação da API
- **Docker**: Empacotamento da aplicação
- **GitHub Actions**: Pipeline de CI/CD automatizado
- **Render**: Plataforma de deploy com inicialização sob demanda

---

## 📡 WebSocket
 - Ao criar ou editar um produto, a API emite um evento WebSocket
 - Isso permite que o frontend atualize os dados em tempo real

## 🚀 CI/CD & Deploy

Sempre que o código é enviado para o GitHub:
1. ⚙️ O GitHub Actions gera uma nova imagem Docker
2. 🐳 A imagem é publicada automaticamente no [Docker Hub](https://hub.docker.com/repository/docker/marcelotadini/product-api)
3. 🚀 O site Render faz o build da aplicação via imagem do Docker Hub

### 🟢 Inicialização da API

> A plataforma Render inicializa sua aplicação sob demanda.  
> Por isso, **a primeira chamada pode levar cerca de 2 minutos**.

🔗 **Acesse para iniciar**:  
[https://product-api-7chz.onrender.com/product](https://product-api-7chz.onrender.com/product)

---

## 📚 Documentação da API

A API oferece duas formas de documentação:

- 🔍 **Swagger (Interativa)**  
  [https://product-api-7chz.onrender.com/api](https://product-api-7chz.onrender.com/api)

- 📘 **ReDoc (Visual e Completa)**  
  [https://product-api-7chz.onrender.com/docs](https://product-api-7chz.onrender.com/docs)

---

## 🐳 Docker

Se quiser rodar a aplicação localmente via Docker:

### 1. Clone o repositório:
```bash
git clone https://github.com/MarceloTadini/scoders-back.git
cd scoders-back
```

### 3. Adicione o arquivo .env na raíz do projeto com as seguintes variáveis
```bash
PORT=3000
MONGO_URI=sua url do MongoDB Atlas
API_SECRET=sua secret
REDIS_URL=adicione sua url do REDIS CLOUD
```

### 2. Construa a imagem:
```bash
docker build -t scoders-back .
```

### 3. Execute o container:
```bash
docker run --env-file .env -p 3000:3000 scoders
```
###

A API estará acessível em: http://localhost:3000

## Frontend
Para acessar o repositório do frontend, entre no link abaixo.
👉 Acesse aqui: [Repositório Frontend](https://github.com/MarceloTadini/scoders-front)
