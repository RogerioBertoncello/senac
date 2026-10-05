const apiUrl = "/api/livros";
const searchForm = document.querySelector("#search-form");
const bookForm = document.querySelector("#book-form");
const bookList = document.querySelector("#book-list");
const bookCount = document.querySelector("#book-count");
const searchNotice = document.querySelector("#search-notice");
const formNotice = document.querySelector("#form-notice");

function showNotice(element, message, type = "") {
    element.textContent = message;
    element.className = `notice${type ? ` ${type}` : ""}`;
}

async function request(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...options.headers
        }
    });

    if (!response.ok) {
        let message = `A solicitação falhou (${response.status}).`;
        try {
            const body = await response.json();
            if (body.erro) message = body.erro;
        } catch {
            // Usa a mensagem HTTP padrão quando a resposta não contém JSON.
        }
        throw new Error(message);
    }

    if (response.status === 204) return null;
    return response.json();
}

function addCell(row, content) {
    const cell = document.createElement("td");
    cell.textContent = content;
    row.append(cell);
    return cell;
}

function renderBooks(books) {
    bookList.replaceChildren();
    bookCount.textContent = `${books.length} ${books.length === 1 ? "livro" : "livros"}`;

    if (books.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 5;
        cell.className = "empty-state";
        cell.textContent = "Nenhum livro encontrado. Tente outros termos de busca.";
        row.append(cell);
        bookList.append(row);
        return;
    }

    for (const book of books) {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const name = document.createElement("div");
        name.className = "book-name";
        name.textContent = book.titulo;
        const author = document.createElement("div");
        author.className = "book-author";
        author.textContent = book.autor;
        nameCell.append(name, author);
        row.append(nameCell);
        addCell(row, book.isbn);
        addCell(row, String(book.anoPublicacao));
        addCell(row, String(book.quantidade));

        const actionsCell = document.createElement("td");
        const actions = document.createElement("div");
        actions.className = "row-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "button button-quiet button-small";
        editButton.textContent = "Editar";
        editButton.addEventListener("click", () => startEditing(book));

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "button button-delete button-small";
        deleteButton.textContent = "Excluir";
        deleteButton.addEventListener("click", () => deleteBook(book, deleteButton));

        actions.append(editButton, deleteButton);
        actionsCell.append(actions);
        row.append(actionsCell);
        bookList.append(row);
    }
}

function searchParameters() {
    const parameters = new URLSearchParams();
    for (const [key, value] of new FormData(searchForm)) {
        if (typeof value === "string" && value.trim()) parameters.set(key, value.trim());
    }
    return parameters.toString();
}

async function loadBooks() {
    showNotice(searchNotice, "");
    bookList.innerHTML = '<tr><td class="empty-state" colspan="5">Carregando acervo...</td></tr>';
    try {
        const query = searchParameters();
        const books = await request(`${apiUrl}${query ? `?${query}` : ""}`);
        renderBooks(books);
    } catch (error) {
        bookCount.textContent = "Indisponível";
        bookList.innerHTML = '<tr><td class="empty-state" colspan="5">Não foi possível carregar os livros.</td></tr>';
        showNotice(searchNotice, error.message, "error");
    }
}

function startEditing(book) {
    bookForm.elements.id.value = book.id;
    bookForm.elements.titulo.value = book.titulo;
    bookForm.elements.autor.value = book.autor;
    bookForm.elements.isbn.value = book.isbn;
    bookForm.elements.anoPublicacao.value = book.anoPublicacao;
    bookForm.elements.quantidade.value = book.quantidade;
    document.querySelector("#form-heading").textContent = "Atualizar livro";
    document.querySelector("#form-mode").textContent = `EDITANDO #${book.id}`;
    document.querySelector("#form-description").textContent = "Altere os campos desejados e salve as atualizações.";
    document.querySelector("#save-book").textContent = "Salvar alterações";
    document.querySelector("#cancel-edit").hidden = false;
    showNotice(formNotice, "");
    bookForm.scrollIntoView({ behavior: "smooth", block: "center" });
    bookForm.elements.titulo.focus({ preventScroll: true });
}

function resetForm() {
    bookForm.reset();
    bookForm.elements.id.value = "";
    document.querySelector("#form-heading").textContent = "Adicionar ao acervo";
    document.querySelector("#form-mode").textContent = "NOVO LIVRO";
    document.querySelector("#form-description").textContent = "Preencha os dados para cadastrar um livro na biblioteca.";
    document.querySelector("#save-book").textContent = "Cadastrar livro";
    document.querySelector("#cancel-edit").hidden = true;
    showNotice(formNotice, "");
}

async function deleteBook(book, button) {
    if (!window.confirm(`Excluir "${book.titulo}" do acervo?`)) return;

    button.disabled = true;
    try {
        await request(`${apiUrl}/${encodeURIComponent(book.id)}`, { method: "DELETE" });
        if (bookForm.elements.id.value === String(book.id)) resetForm();
        await loadBooks();
        showNotice(searchNotice, "Livro excluído do acervo.", "success");
    } catch (error) {
        button.disabled = false;
        showNotice(searchNotice, error.message, "error");
    }
}

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await loadBooks();
});

document.querySelector("#clear-search").addEventListener("click", async () => {
    searchForm.reset();
    await loadBooks();
});

document.querySelector("#cancel-edit").addEventListener("click", resetForm);

bookForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!bookForm.reportValidity()) return;

    const id = bookForm.elements.id.value;
    const payload = {
        titulo: bookForm.elements.titulo.value.trim(),
        autor: bookForm.elements.autor.value.trim(),
        isbn: bookForm.elements.isbn.value.trim(),
        anoPublicacao: Number(bookForm.elements.anoPublicacao.value),
        quantidade: Number(bookForm.elements.quantidade.value)
    };
    const saveButton = document.querySelector("#save-book");
    saveButton.disabled = true;
    showNotice(formNotice, "");

    try {
        await request(id ? `${apiUrl}/${encodeURIComponent(id)}` : apiUrl, {
            method: id ? "PUT" : "POST",
            body: JSON.stringify(payload)
        });
        resetForm();
        showNotice(formNotice, id ? "Livro atualizado com sucesso." : "Livro cadastrado com sucesso.", "success");
        await loadBooks();
    } catch (error) {
        showNotice(formNotice, error.message, "error");
    } finally {
        saveButton.disabled = false;
    }
});

loadBooks();
