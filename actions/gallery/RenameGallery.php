<?php
	
function indexAction() {
	if (!isset($_GET['newName']) || !isset($_GET['oldName'])) {
		echo "error:no name";
		return;
	}
	
	$newName = $_GET['newName'];
	$oldName = $_GET['oldName'];
	
	if (preg_match('/\.\./', $newName) || preg_match("/\//", $newName) ||
		preg_match('/\.\./', $oldName) || preg_match("/\//", $oldName)) {
		echo "error:illegal name";
		return;
	}
	
	if (rename('actions/upload/images/'.$oldName, 'actions/upload/images/'.$newName)) {
		echo "success";
	} else {
		echo "error:can't rename";
	}
}