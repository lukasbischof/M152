<?php

function indexAction() {
	if (!isset($_GET['name'])) {
		echo "error:no name";
		return;
	}
	
	$name = $_GET['name'];
	
	if (preg_match('/\.\./', $name) || preg_match("/\//", $name)) {
		echo "error:illegal name";
		return;
	}
	
	if (mkdir('actions/upload/images/'.$name) && mkdir('actions/upload/images/'.$name.'/thumbs')) {
		echo "success";
	} else {
		echo 'error:can\'t create gallery';
	}
}