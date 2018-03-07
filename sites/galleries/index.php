<?php
    $galleriesDir = 'actions/upload/images';

    $galleries = array();
    $scanned = scandir($galleriesDir);
    foreach ($scanned as $dir) {
        if ($dir == '.' || $dir == '..') {
            continue;
        }

        array_push($galleries, $dir);
    }
?>

<h1>
	Galleries

	<a id="addGallery" href="#modal-sections" uk-toggle>
	    <span uk-icon="icon: plus; ratio: 2"></span>
	</a>
</h1>

<div id="modal-sections" uk-modal="center: true">
    <div class="uk-modal-dialog">
        <div class="uk-modal-header">
            <h2 class="uk-modal-title">Neue Galerie</h2>
        </div>
        <div class="uk-modal-body">
            <p><input type="text" class="uk-input" placeholder="Titel" id="galleryTitle" /></p>
        </div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
            <button class="uk-button uk-button-primary uk-modal-close" onclick="createGallery()" type="button">Save</button>
        </div>
    </div>
</div>

<div id="rename-modal" uk-modal="center: true">
    <div class="uk-modal-dialog">
        <div class="uk-modal-header">
            <h2 class="uk-modal-title">Galerie umbenennen</h2>
        </div>
        <div class="uk-modal-body">
            <p><input type="text" class="uk-input" placeholder="Titel" id="newGalleryTitle" /></p>
        </div>
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" onclick="renamingCancel()" type="button">Cancel</button>
            <button class="uk-button uk-button-primary uk-modal-close" onclick="renameGallery()" type="button">Save</button>
        </div>
    </div>
</div>

<div uk-height-match>
	<?php foreach ($galleries as $gallery): ?>
	    <a class="no-underline" href="?r=gallery&id=<?= $gallery ?>">
	        <div class="uk-card uk-card-default uk-card-body">
	            <h3 class="uk-card-title">&bdquo;<?= $gallery ?>&rdquo;</h3>
	            <a href="#" onclick="deleteGallery('<?= $gallery ?>')">
		            <span uk-icon="icon: trash"></span>
		            Galerie löschen
	            </a>
	            <br />
	            <a href="#rename-modal" onclick="startRenamingGallery('<?= $gallery ?>')" uk-toggle>
		            <span uk-icon="icon: pencil"></span>
		            Galerie umbenennen
	            </a>
	            <p>
		            <a href="?r=gallery&id=<?= $gallery ?>" style="color:#1e87f0;cursor:pointer">Galerie öffnen &#10095;</a>
	            </p>
	        </div>
	    </a>
	<?php endforeach; ?>
</div>