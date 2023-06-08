var novels = [];

// Verificar se existem dados salvos no armazenamento local e carregar
var storedNovels = localStorage.getItem("novels");
if (storedNovels) {
    novels = JSON.parse(storedNovels);
    updateTable();
}

function toggleNovelForm() {
    var novelForm = document.getElementById("novel-form");
    if (novelForm.style.display === "none") {
        novelForm.style.display = "block";
    } else {
        novelForm.style.display = "none";
    }
}

function addNovel() {
    var novelName = document.getElementById("novel-name").value;
    var chapter = document.getElementById("chapter").value;
    var novelLink = document.getElementById("novel-link").value;
    var note = document.getElementById("note").value;
    var imageUrl = document.getElementById("image-url").value;

    if (novelName === '') {
        alert("Digite o nome da novel!");
        return;
    }

    var novel = {
        name: novelName,
        chapter: chapter,
        link: novelLink,
        note: note,
        imageUrl: imageUrl
    };

    var existingNovelIndex = novels.findIndex(function (n) {
        return n.name === novel.name;
    });

    if (existingNovelIndex !== -1) {
        novels[existingNovelIndex] = novel;
    } else {
        novels.push(novel);
    }

    document.getElementById("novel-name").value = '';
    document.getElementById("chapter").value = '';
    document.getElementById("novel-link").value = '';
    document.getElementById("note").value = '';
    document.getElementById("image-url").value = '';

    updateTable();
    saveToLocalStorage(); // Salvar os dados atualizados no armazenamento local
}

function deleteNovel(name) {
    novels = novels.filter(function (item) {
        return item.name !== name;
    });

    updateTable();
    saveToLocalStorage(); // Salvar os dados atualizados no armazenamento local
}

function editNovel(name) {
    var novel = novels.find(function (item) {
        return item.name === name;
    });

    document.getElementById("novel-name").value = novel.name;
    document.getElementById("chapter").value = novel.chapter;
    document.getElementById("novel-link").value = novel.link;
    document.getElementById("note").value = novel.note;
    document.getElementById("image-url").value = novel.imageUrl;
}

function updateTable() {
    var tableBody = document.querySelector("#novel-table tbody");
    tableBody.innerHTML = '';

    novels.forEach(function (novel, index) {
        var row = document.createElement("tr");
        row.setAttribute("data-index", index.toString()); // Adicionar o atributo data-index com o índice da novel

        var imageCell = document.createElement("td");
        var image = document.createElement("img");
        image.src = novel.imageUrl;
        image.width = 75; // Alteração: definir a largura da imagem como 75 pixels
        image.height = 75; // Alteração: definir a altura da imagem como 75 pixels
        imageCell.appendChild(image);
        row.appendChild(imageCell);

        var nameCell = document.createElement("td");
        nameCell.textContent = novel.name;
        row.appendChild(nameCell);

        var chapterCell = document.createElement("td");
        chapterCell.textContent = novel.chapter;
        row.appendChild(chapterCell);

        var linkCell = document.createElement("td");
        var link = document.createElement("a");
        link.href = novel.link;
        link.target = "_blank";
        link.textContent = "Link";
        linkCell.appendChild(link);
        row.appendChild(linkCell);

        var noteCell = document.createElement("td");
        noteCell.textContent = novel.note;
        row.appendChild(noteCell);

        var dragHandleCell = document.createElement("td");
        dragHandleCell.className = "drag-handle";
        dragHandleCell.textContent = "≡";
        row.appendChild(dragHandleCell);

        var actionsCell = document.createElement("td");
        var editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.onclick = function () {
            editNovel(novel.name);
        };
        actionsCell.appendChild(editButton);

        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Excluir";
        deleteButton.onclick = function () {
            deleteNovel(novel.name);
        };
        actionsCell.appendChild(deleteButton);

        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });

    makeTableSortable(); // Tornar a tabela ordenável após atualizar os dados
}

function saveToLocalStorage() {
    localStorage.setItem("novels", JSON.stringify(novels));
}

function saveList() {
    var data = JSON.stringify(novels);
    var filename = "novels.json";
    var blob = new Blob([data], {type: "text/plain"});
    var url = window.URL.createObjectURL(blob);

    var link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
}

function loadList() {
    var fileInput = document.getElementById("file-input");
    fileInput.onchange = function (e) {
        var file = e.target.files[0];
        var reader = new FileReader();

        reader.onload = function (event) {
            var contents = event.target.result;
            if (typeof contents === 'string') {
                novels = JSON.parse(contents);
            } else {
                var decoder = new TextDecoder('utf-8');
                var text = decoder.decode(contents);
                novels = JSON.parse(text);
            }
            updateTable();
            saveToLocalStorage(); // Salvar os dados carregados no armazenamento local
        };

        reader.readAsText(file);
    };

    fileInput.click();
}

function makeTableSortable() {
    Sortable.create(document.getElementById("novel-table").getElementsByTagName("tbody")[0], {
        handle: ".drag-handle",
        animation: 150
    });
}
