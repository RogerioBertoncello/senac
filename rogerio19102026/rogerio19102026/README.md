# LabControl — Controle de equipamentos de laboratório

Aplicação web com Spring Boot, Java 17 e MySQL para cadastrar, pesquisar, atualizar e excluir equipamentos de um laboratório de informática.

## Requisitos

- JDK 17 ou superior
- Maven 3.6 ou superior
- MySQL 8 ou superior

## Banco de dados e execução

Crie o banco (ou deixe o usuário configurado na aplicação criar o banco automaticamente):

```sql
CREATE DATABASE laboratorio_equipamentos;
```

Configure as variáveis de ambiente `DB_URL`, `DB_USERNAME` e `DB_PASSWORD` se os valores locais padrão não forem adequados. Por exemplo, no PowerShell:

```powershell
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "sua-senha"
mvn spring-boot:run
```

Abra `http://localhost:8080` para usar a interface. O Hibernate cria/atualiza as tabelas automaticamente (`spring.jpa.hibernate.ddl-auto=update`).

## API REST

Todas as rotas usam o prefixo `/api/equipamentos`.

| Método | Rota | Ação |
| --- | --- | --- |
| `GET` | `/api/equipamentos` | Lista equipamentos; aceita `termo` e `status` como filtros opcionais |
| `GET` | `/api/equipamentos/{id}` | Consulta um equipamento |
| `POST` | `/api/equipamentos` | Cadastra um equipamento |
| `PUT` | `/api/equipamentos/{id}` | Atualiza todos os dados de um equipamento |
| `DELETE` | `/api/equipamentos/{id}` | Exclui um equipamento |

Valores aceitos para `status`: `DISPONIVEL`, `EM_USO` e `MANUTENCAO`. Exemplo de corpo JSON:

```json
{
  "nome": "Computador de bancada 01",
  "categoria": "Computador",
  "fabricante": "Dell",
  "modelo": "OptiPlex",
  "numeroPatrimonio": "LAB-001",
  "localizacao": "Sala 02, bancada A",
  "status": "DISPONIVEL",
  "dataAquisicao": "2025-03-15",
  "observacoes": "Memória RAM de 16 GB"
}
```
