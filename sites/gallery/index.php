<?php
	$galleriesDir = 'actions/upload/images/';
	$idValid = false;
	$id = NULL;

	if (!isset($_GET['id'])) {
		echo "<h1>Can't load gallery</h1><h3>No ID</h3>";
	} else {
		$id = $_GET['id'];

		foreach (scandir($galleriesDir) as $dir) {
			if ($dir != '.' && $dir != '..' && $dir == $id) {
				$idValid = true;
			}
		}

		if (!$idValid) {
			echo "<h1>Can't load gallery</h1><h3>Invalid ID</h3>";
		} else {
			$imagesPath = $galleriesDir . $id . '/';
			$files = array();
			$exifDatas = array();

			$content = scandir($imagesPath);
			foreach ($content as $file) {
				if ($file == '.' || $file == '..' || $file == 'thumbs') {
					continue;
				}

				array_push($files, $file);
				$exifData = @exif_read_data($imagesPath . $file, 'IFD0') or NULL;
				if ($exifData && isset($exifData["Model"])) {
					$exifDatas[$imagesPath . $file] = $exifData["Model"];
				}
			}
		}
	}
?>

<?php if ($idValid): ?>
	<script>
		var exifData = <?php echo json_encode($exifDatas); ?>;
		var galleryId = '<?= $id ?>';
	</script>

	<a href="?r=galleries">
		<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
			<path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" fill="#1e87f0" />
		</svg>

		Zurück zu den Galerien
	</a>


	<h1>Gallery &bdquo;<?= ucfirst($id) ?>&rdquo;</h1>

	<div id="gallery">
	    <div id="leftContainer">
		    <div id="content">
			    <p>Bitte wählen Sie unten ein Bild aus</p>
		    </div>
		    <div id="previewContainer">
				<?php foreach ($files as $file): ?>
					<div class="preview uk-float-left" onclick="loadImage(window.event, '<?php echo($imagesPath . $file); ?>')">
						<img src="<?php echo($imagesPath . 'thumbs/' . $file); ?>" width="150" height="150" />
					</div>
				<?php endforeach ?>
			</div>
	    </div>
	    <div id="uploadContainer">
	        <h3>Upload</h3>
	        <div class="image-upload uk-placeholder uk-text-center">
	            <span uk-icon="icon: cloud-upload"></span>
	            <span class="uk-text-middle">&nbsp;Ziehen sie ein Bild hierher oder </span>
	            <div uk-form-custom>
	                <input type="file" multiple>
	                <span class="uk-link">selektieren sie eines</span>
	            </div>
	        </div>
	        <p>Akzeptierte Formate: JPG oder PNG</p>

	        <progress id="progressbar" class="uk-progress" value="0" max="100" hidden></progress>
	    </div>
	</div>
<?php endif; ?>
