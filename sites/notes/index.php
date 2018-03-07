<!-- Copyright (c) 2017 Lukas Bischof. All Rights Reserved. -->

<h1>Notizen</h1>

<a class="uk-button uk-button-default" href="#modal-sections" uk-toggle>Hinzufügen</a>

<div id="modal-sections" uk-modal="center: true">
    <div class="uk-modal-dialog">
        <button class="uk-modal-close-default" type="button" uk-close></button>
        <div class="uk-modal-header">
            <h2 class="uk-modal-title">Neue Notiz</h2>
        </div>
        <div class="uk-modal-body">
            <p><input type="text" placeholder="Titel" id="noteTitle" /></p>
            <p><textarea id="noteContent"></textarea></p>
        </div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
            <button class="uk-button uk-button-primary uk-modal-close" onclick="saveNote()" type="button">Save</button>
        </div>
    </div>
</div>

<table class="uk-table uk-table-striped">
    <thead>
        <tr>
            <th>Titel</th>
            <th>Notiz</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td></td>
            <td>Noch keine Notiz vorhanden</td>
        </tr>
    </tbody>
</table>
