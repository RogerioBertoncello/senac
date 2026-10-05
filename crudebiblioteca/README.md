# API da Biblioteca

Backend REST para cadastro e consulta de livros, usando Java 17, Spring Boot e MySQL.

## Requisitos

- Java 17 ou superior
- Maven 3.6+
- MySQL 8+

## Configuracao e execucao

Por padrao, a aplicacao conecta em `localhost:3306` usando o usuario `root` sem senha. Configure as variaveis de ambiente `DB_URL`, `DB_USERNAME` e `DB_PASSWORD` para ajustar a conexao. O banco `biblioteca` e criado pela URL caso ainda nao exista; as tabelas sao atualizadas pelo Hibernate.

```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/biblioteca?createDatabaseIfNotExist=true&serverTimezone=UTC"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "sua-senha"
mvn spring-boot:run
```

A aplicacao fica disponivel em `http://localhost:8080`. A pagina inicial oferece uma interface para buscar livros, cadastrar novos, editar registros existentes e exclui-los.

## Endpoints

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/api/livros` | Lista todos os livros; filtros opcionais `titulo`, `autor` e `isbn` |
| GET | `/api/livros/{id}` | Busca um livro pelo ID |
| POST | `/api/livros` | Cadastra um livro (retorna `201 Created`) |
| PUT | `/api/livros/{id}` | Atualiza todos os dados de um livro |
| DELETE | `/api/livros/{id}` | Remove um livro (retorna `204 No Content`) |

Exemplo de corpo para `POST` e `PUT`:

```json
{
  "titulo": "Dom Casmurro",
  "autor": "Machado de Assis",
  "isbn": "9788535910663",
  "anoPublicacao": 1899,
  "quantidade": 4
}
```

Exemplo de busca: `GET /api/livros?titulo=dom&autor=machado`. Os filtros de texto nao diferenciam maiusculas de minusculas e podem ser combinados. O ISBN deve ser unico; dados invalidos retornam `400`, ISBN duplicado `409` e ID inexistente `404`.
