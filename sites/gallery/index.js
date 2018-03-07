window.addEventListener("load", function() {
    (function ($) {
        var bar = $("#progressbar")[0];

        var successfullyUploaded = true

        UIkit.upload('.image-upload', {
            url: 'index.php?a=upload&id=' + galleryId,
            multiple: true,

            beforeSend: function() { console.log('beforeSend', arguments); },
            beforeAll: function() { console.log('beforeAll', arguments); },
            load: function() { console.log('load', arguments); },
            error: function() { console.log('error', arguments); },
            complete: function() {
	            console.log(arguments[0].responseText);
                if (arguments[0].responseText.split(":")[0] === "error") {
                    successfullyUploaded = false;
                }
            },

            loadStart: function (e) {
                console.log('loadStart', arguments);

				successfullyUploaded = true;
                bar.removeAttribute('hidden');
                bar.max =  e.total;
                bar.value =  e.loaded;
            },

            progress: function (e) {
                console.log('progress', arguments);

                bar.max =  e.total;
                bar.value =  e.loaded;

            },

            loadEnd: function (e) {
                console.log('loadEnd', arguments);

                bar.max =  e.total;
                bar.value =  e.loaded;
            },

            completeAll: function () {
                console.log('completeAll', arguments);

                setTimeout(function () {
                    bar.setAttribute('hidden', 'hidden');
                    if (successfullyUploaded) {
                        location.reload();
                    }
                }, 1500);

                var banner = new UABanner({
                    title: (successfullyUploaded ? "Successfully uploaded image" : "Error while uploading"),
                    timeout: 1500,
                    width: 400
                });

                banner.show();
            }
        });

    })(jQuery);
});

function loadImage(e, imageName) {
	if (document.querySelector("#gallery #content p")) {
		document.querySelector("#gallery #content").removeChild(document.querySelector("#gallery #content p"));
	}
	
	if (document.querySelector(".preview.active")) 
		document.querySelector(".preview.active").classList.remove("active");
		
	if (e.target.tagName == "IMG") {
		e.target.parentNode.classList.add("active");
	} else {
		e.target.classList.add("active");
	}
	
	document.querySelector("#gallery #content").style.backgroundImage = "url('" + imageName + "')";

    if (exifData[imageName]) {
        document.querySelector("#gallery #content").title = exifData[imageName];
        document.querySelector("#gallery #content").setAttribute("uk-tooltip", "pos: top");

        UIkit.tooltip(document.querySelector("#gallery #content")).title = exifData[imageName];
    } else {
	    document.querySelector("#gallery #content").title = "";
        document.querySelector("#gallery #content").setAttribute("uk-tooltip", "pos: top");

        UIkit.tooltip(document.querySelector("#gallery #content")).title = "";
    }
}
