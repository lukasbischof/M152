<?php

function indexAction() {
	if (!isset($_GET['id'])) {
		echo 'error:no id';
		return;
	}

	$galleriesDir = 'actions/upload/images/';
	$galleryID = $_GET['id'];
	$files = $_FILES['files'];
	$count = sizeof($files['name']);

	$isValid = false;
	foreach (scandir($galleriesDir) as $directory) {
		if ($directory != '.' && $directory != '..' && $directory == $galleryID) {
			$isValid = true;
			break;
		}
	}

	if (!$isValid) {
		echo 'error:not valid';
		return;
	}

	$success = true;
	for ($i = 0; $i < $count; $i++) {
		$name = $files['name'][$i];
		$parts = explode('.', $name);
		$extension = $parts[sizeof($parts) - 1];

		switch ($extension) {
			case "jpg":
			case "png":
			case "JPG":
			case "PNG":
				break;

			default:
				$success = false;
				break;
		}

		if (!$success) {
			continue;
		}

		$uploadDirection = $galleriesDir.$galleryID.'/';
	    $fileDirection = $uploadDirection . time() . '_' . $name;

	    if ($files['error'][$i] == 1) {
		    $success = false;
		    continue;
	    }

	    if (!move_uploaded_file($files['tmp_name'][$i], $fileDirection)){
	    	$success = false;
	    	continue;
	    }

	    $thumbName = $uploadDirection . 'thumbs/' . time() . '_' . $name;
	    $tmpName = $uploadDirection . time() . '_tmp_' . $name;
	    copy($fileDirection, $tmpName);
	    generateThumbnail($tmpName, 150, 150, $thumbName);

	    unlink($tmpName);

		makeWatermark($fileDirection, 'actions/upload/water.png');
	}

	if ($success) {
		echo 'success';
	} else {
		echo 'error:can\' upload';
	}
}

function generateThumbnail($img, $width, $height, $fileName, $quality = 90) {
    if (is_file($img)) {
        $imagick = new Imagick(realpath($img));
        $imagick->setImageFormat('jpeg');
        $imagick->setImageCompression(Imagick::COMPRESSION_JPEG);
        $imagick->setImageCompressionQuality($quality);
        $imagick->thumbnailImage($width, $height, true, false);

        if (file_put_contents($fileName, $imagick) === false) {
            throw new Exception("Could not put contents.");
        }
        return true;
    }
    else {
        throw new Exception("No valid image provided with {$img}.");
    }
}

function makeWatermark($img, $watermark) {
	$stamp = imagecreatefrompng($watermark);
	$im = imagecreatefromjpeg($img);

	// Ränder für Wasserzeichen festlegen, dessen Höhe und Breite bestimmen
	$marge_right = 10;
	$marge_bottom = 10;
	$sx = imagesx($stamp);
	$sy = imagesy($stamp);

	// Wasserzeichen auf das Foto kopieren, die Position berechnet sich dabei aus
	// den Rändern und der Bildbreite
	imagecopy($im, $stamp, imagesx($im) - $sx - $marge_right, imagesy($im) - $sy - $marge_bottom, 0, 0, imagesx($stamp), imagesy($stamp));

	// Ausgeben und aufräumen
	imagepng($im, $img);
	imagedestroy($im);
}

