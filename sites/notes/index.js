window.addEventListener("load", reloadTable);

function saveNote() {
    var content = document.getElementById("noteContent").value;
    var title = document.getElementById("noteTitle").value;

    if (content == "" || title == "") {
        (new UABanner("Titel oder Inhalt sind leer")).show();
        return;
    }

    document.getElementById("noteContent").value = "";
    document.getElementById("noteTitle").value = "";

    localStorage.setItem(title, content);

    reloadTable();
}

function reloadTable() {
    var keys = Object.keys(localStorage);
    var i = keys.length;
    var tBody = document.querySelector("tbody");
    tBody.innerHTML = "";

    while (i--) {
        var title = keys[i];
        var content = localStorage[keys[i]];

        var tr = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");

        td1.innerHTML = title;
        td2.appendChild(document.createTextNode(content));

        tr.appendChild(td1);
        tr.appendChild(td2);

        tBody.appendChild(tr);
    }
}
