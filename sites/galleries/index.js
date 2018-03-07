function createGallery() {
	var title = document.getElementById("galleryTitle").value;
	
	$.ajax({
		url: "?a=createGallery&name=" + encodeURIComponent(title),
		success: function(result) {
			if (result == "success") {
				(new UABanner({
					title: "Galerie wurde erstellt",
					timeout: 1000,
					width: 400
				})).show();
				
				setTimeout(function() {
					location.reload();
				}, 1000);
			} else {
				var errorMsg = result.split(":")[1];
				
				(new UABanner({
					title: "Galerie konnte nicht erstellt werden: " + errorMsg,
					timeout: 2500,
					width: 600
				})).show();
			}
		}
	});
}

var currentRenamingGalleryId;
function startRenamingGallery(galleryId) {
	document.getElementById("newGalleryTitle").value = galleryId;
	currentRenamingGalleryId = galleryId;
}

function renameGallery() {
	var newName = encodeURIComponent(document.getElementById("newGalleryTitle").value);
	
	$.ajax({
		url: "?a=renameGallery&oldName="+ currentRenamingGalleryId +"&newName=" + newName,
		success: function(result) {
			if (result == "success") {
				(new UABanner({
					title: "Galerie wurde umbenannt",
					timeout: 1000,
					width: 400
				})).show();
				
				setTimeout(function() {
					location.reload();
				}, 1000);
			} else {
				var errorMsg = result.split(":")[1];
				
				(new UABanner({
					title: "Galerie konnte nicht erstellt werden: " + errorMsg,
					timeout: 2500,
					width: 600
				})).show();
			}
		}
	});
}

function renamingCancel() {
	currentRenamingGalleryId = null;
}

function deleteGallery(galleryId) {
	var banner = new UABanner({
		title: "Willst du die Galerie wirklich löschen?",
		text: "Dadurch gehen alle Bilder verloren",
		width: 650,
		buttons: [
			new UAButton({
				text: "Abbrechen",
				style: UAButton.NORMAL,
				pressedEventHandler: function(e) {
					e.banner.dismiss();
				}
			}),
			
			new UAButton({
				text: "Löschen",
				style: UAButton.DESTRUCTIVE,
				pressedEventHandler: function(e) {
					$.ajax({
						url: "?a=deleteGallery&name=" + galleryId,
						success: function(result) {
							if (result == "success") {
								(new UABanner({
									title: "Galerie wurde gelöscht",
									timeout: 1000,
									width: 400
								})).show();
								
								setTimeout(function() {
									location.reload();
								}, 1010);
							} else {
								var errorMsg = result.split(":")[1];
								
								(new UABanner({
									title: "Galerie konnte nicht gelöscht werden: " + errorMsg,
									timeout: 2500,
									width: 600
								})).show();
							}
						}
					});
				}
			})
		]
	});
	
	banner.show();
}
