<?php
	
function indexAction() {
	if (!isset($_GET['name'])) {
		echo "error:no name";
		return;
	}
	
	$name = $_GET['name'];
	
	$galleriesDir = 'actions/upload/images/';
	$isValid = false;
	foreach (scandir($galleriesDir) as $directory) {
		if ($directory != '.' && $directory != '..' && $directory == $name) {
			$isValid = true;
			break;
		}
	}
	
	if (!$isValid) {
		echo "error:invalid gallery";
		return;
	}
	
	if (delTree($galleriesDir.$name)) {
		echo("success");
	} else {
		echo 'error:can\'t delete gallery';
	}
}

function delTree($dir) { 
	$files = array_diff(scandir($dir), array('.','..')); 
	foreach ($files as $file) { 
		(is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file"); 
	} 
	
	return rmdir($dir); 
} 