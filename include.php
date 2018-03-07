<?php

$sites = 'sites';
$phpFile = "$sites/404/index.php";
$styleTag = '';
$scriptTag = '';
$headerFile = NULL;
$routeConfig = array("renderFooter" => true);

$files = scandir($sites);
$request = 'home';
$prefix = "$sites/404";

if (isset($_GET['r'])) {
    $request = $_GET['r'];
}

$routes = array();
if (file_exists("$sites/routes.php")) {
	include "$sites/routes.php";
}

$routeConfigExists = in_array($request, array_keys($routes));
if ($routeConfigExists) {
    $routeConfig = $routes[$request];
} 

if ($routeConfigExists && isset($routes[$request]['mapping'])) {
	$mapping = $routes[$request]['mapping'];
	$prefix = "$sites/$mapping";
} else {
	foreach ($files as $file) {
	    if ($file != '.' && $file != '..' && $file != '.DS_Store') {
	        if (is_dir($sites . '/' . $file)) {
	            if ($request === $file) {
	                $prefix = $sites . '/' . $file;
	            }
	        }
	    }
	}
}

setup($prefix);

function setup($prefix) {
	global $phpFile, $styleFile, $styleTag;
	global $scriptFile, $scriptTag, $headerFile;
	
	$phpFile = $prefix . "/index.php";

    if (file_exists($prefix . "/style.css")) {
        $styleFile = $prefix . "/style.css";
        $styleTag = "<link rel='stylesheet' href='$styleFile' />";
    }

    if (file_exists($prefix . "/index.js")) {
        $scriptFile = $prefix . "/index.js";
        $scriptTag = "<script type='text/javascript' src='$scriptFile'></script>";
    }

    if (file_exists($prefix . "/__header.php")) {
        $headerFile = $prefix . "/__header.php";
    }
}

function renderBody() {
    global $phpFile;

    include_once "$phpFile";
}

function SITE_FILE($fileName) {
    global $prefix;

    return $prefix . DIRECTORY_SEPARATOR . $fileName;
}
