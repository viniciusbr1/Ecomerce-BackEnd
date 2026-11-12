# E-commerce MATRIX

Projeto acadêmico desenvolvido com **Angular no FrontEnd** e **Spring Boot no BackEnd**, utilizando banco de dados **PostgreSQL hospedado no Neon**.

## Estrutura do projeto

```text
Ecomerce-BackEnd
├── src/                # BackEnd Spring Boot
├── pom.xml
├── mvnw.cmd
├── iniciar.ps1
├── .env.example
└── frontend/           # FrontEnd Angular
    ├── src/
    ├── package.json
    └── angular.json
```

## Tecnologias utilizadas

### BackEnd
- Java
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Neon Database
- Maven
- BCrypt

### FrontEnd
- Angular
- TypeScript
- HTML
- CSS
- Bootstrap

## Funcionalidades

- Cadastro de clientes
- Login
- Recuperação de senha
- Listagem de produtos
- Carrinho de compras persistente
- Preço promocional
- Cupom de desconto
- Cálculo de frete
- Finalização de pedido
- Atualização de estoque
- Histórico de pedidos

---

# Como executar o BackEnd

## 1. Configurar o banco de dados

Na raiz do projeto existe o arquivo:

```text
.env.example
```

Crie uma cópia dele com o nome:

```text
.env
```

Preencha com as credenciais fornecidas separadamente:

```properties
DB_URL=jdbc:postgresql://HOST_DO_NEON/neondb?sslmode=require&channelBinding=require
DB_USERNAME=USUARIO
DB_PASSWORD=SENHA
```

> As credenciais reais não são armazenadas no GitHub por segurança.

## 2. Iniciar o BackEnd

No PowerShell, na raiz do projeto:

```powershell
.\iniciar.ps1
```

O script carrega automaticamente as variáveis do arquivo `.env` e inicia o Spring Boot.

O BackEnd ficará disponível em:

```text
http://localhost:8080
```

Para testar os produtos:

```text
http://localhost:8080/api/produtos
```

---

# Como executar o FrontEnd

Abra outro terminal e entre na pasta:

```powershell
cd frontend
```

Instale as dependências:

```powershell
npm install
```

Depois execute:

```powershell
npm start
```

O FrontEnd ficará disponível em:

```text
http://localhost:4200
```

---

# Ordem recomendada para execução

Primeiro execute o BackEnd:

```powershell
.\iniciar.ps1
```

Depois, em outro terminal:

```powershell
cd frontend
npm install
npm start
```

Acesse:

```text
http://localhost:4200
```

---

## Banco de dados

O projeto utiliza PostgreSQL hospedado na plataforma Neon.

Para avaliação, as credenciais de acesso ao banco serão fornecidas separadamente ao professor.

O arquivo `.env` está incluído no `.gitignore` e não é publicado no repositório.

---

## Projeto acadêmico

Projeto desenvolvido para fins acadêmicos, com integração entre aplicação Angular, API REST Spring Boot e banco PostgreSQL em nuvem.