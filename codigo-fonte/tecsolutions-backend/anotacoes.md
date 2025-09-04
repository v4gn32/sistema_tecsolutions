# 1. Criar pasta do backend

mkdir tecsolutions-backend && cd tecsolutions-backend

# 2. Inicializar o projeto

npm init -y

# 3. Dependências de runtime

npm i express cors dotenv morgan bcryptjs jsonwebtoken @prisma/client

# 4. Dependências de desenvolvimento

npm i -D prisma nodemon

# 5. Habilitar ES Modules (import/export)

# -> adicionaremos "type": "module" no package.json na etapa seguinte

# 6. Criar o .env

# Porta da API

PORT=3000

# JWT

JWT_SECRET="f79a74921a7c933ede6ab7e8efe297aea7969b80f956160029307ae2e52baee1"

# Banco PostgreSQL local

DATABASE_URL="postgresql://vagneradmin:Mudar2025@localhost:5432/db_tecsolutions?schema=public"

# 7. Iniciar prisma e modelar o banco

npx prisma init

# 8. Criando o modelo do banco de dados

// prisma/schema.prisma
// --- Configuração do Prisma e models base alinhados ao MVP do frontend ---
// Datasource PostgreSQL (usa DATABASE_URL do .env)
datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

// Geração do client Prisma
generator client {
provider = "prisma-client-js"
}

// --- Enums principais ---
enum Role {
ADMIN
TECH
}

enum ClientType {
CONTRACT // Cliente com contrato
ONE_TIME // Cliente avulso
}

enum ProposalStatus {
DRAFT
SENT
APPROVED
REJECTED
}

// --- Tabelas principais ---
model User {
id Int @id @default(autoincrement())
name String
email String @unique
password String // hash
role Role @default(TECH)
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

proposals Proposal[] // propostas criadas por este usuário
}

model Client {
id Int @id @default(autoincrement())
name String
type ClientType @default(CONTRACT)
email String?
phone String?
cnpj String? @unique
address String?
notes String?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

proposals Proposal[]
}

model Service {
id Int @id @default(autoincrement())
name String
description String?
hourlyRate Decimal @db.Numeric(10,2) // valor/hora
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model Product {
id Int @id @default(autoincrement())
name String
sku String? @unique
price Decimal @db.Numeric(10,2)
unit String? // ex: UN, CX, PCT
stock Int? // estoque opcional
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model Proposal {
id Int @id @default(autoincrement())
code String @unique
status ProposalStatus @default(DRAFT)
total Decimal @db.Numeric(12,2) @default(0)
expiresAt DateTime?
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt

clientId Int
client Client @relation(fields: [clientId], references: [id], onDelete: Cascade)

createdById Int
createdBy User @relation(fields: [createdById], references: [id], onDelete: SetNull)

items ProposalItem[]
}

model ProposalItem {
id Int @id @default(autoincrement())
proposalId Int
description String // texto livre (produto/serviço)
quantity Int @default(1)
unitPrice Decimal @db.Numeric(12,2)
lineTotal Decimal @db.Numeric(12,2)

proposal Proposal @relation(fields: [proposalId], references: [id], onDelete: Cascade)
}

# 9. Aplicar a migração
npm run prisma:dev -- --name init

# 10. Popular o banco de dados
npm run seed
