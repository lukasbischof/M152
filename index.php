<?php

error_reporting(E_ALL);

$config = [
    "renderFooter" => true
];

include_once 'include.php';

if (isset($_GET['a'])) {
    $requestedAction = $_GET['a'];
    $actionsDirectory = 'actions/';

    $actionsConfig = json_decode(file_get_contents($actionsDirectory . 'config.json'));
    $availableActions = $actionsConfig->actions;

    foreach ($availableActions as $availableAction) {
        $name = $availableAction->name;
        if ($requestedAction === $name) {
            include_once "$actionsDirectory".$availableAction->controller;
            indexAction();
            die();
            echo "Budu";
        }
    }
}

function echoClassName($menuItemGETName) {
    if (isset($_GET['r'])) {
        if ($_GET['r'] === $menuItemGETName) {
            echo 'class="uk-active"';
        } else {

        }
    } else {
        if ($menuItemGETName == 'home') {
            echo 'class="uk-active"';
        }
    }
}

function echoTitle() {
    if (isset($routeConfig['title'])) {
	    echo $routeConfig['title'];
    } else {
	    if (isset($_GET['r'])) {
    	    $name = $_GET['r'];
    	    echo ucfirst($name);
    	} else {
    	    echo "Home";
    	}
    }
}

?>

<!DOCTYPE html>
<html>
    <head>
        <title>M152 | <?php echoTitle(); ?></title>
        <link rel="stylesheet" href="uikit/dist/css/uikit.min.css" />
        <link rel="stylesheet" href="uikit/dist/css/uikit.rtl.min.css" />
        <link rel="stylesheet" href="default.css" />
        <script type="text/javascript" src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
        <script type="text/javascript" src="uikit/dist/js/uikit.min.js"></script>
        <script type="text/javascript" src="uikit/dist/js/uikit-icons.min.js"></script>
        <?= $styleTag ?>
        <?= $scriptTag ?>
        <?
            if ($headerFile) {
                include_once $headerFile;
            }
        ?>
    </head>
    <body>
        <nav class="uk-navbar-container" uk-navbar>
            <div class="uk-navbar-left">
	            <a class="uk-navbar-item uk-logo" href="?r=home">Modul 152</a>

                <ul class="uk-navbar-nav">
                    <li>
                        <a href="?r=canvas" <?php echoClassName('canvas'); ?>>Canvas</a>
                        <div class="uk-navbar-dropdown">
                            <ul class="uk-nav uk-navbar-dropdown-nav">
                                <li>
                                	<a href="?r=timer" <?php echoClassName('timer'); ?>>Ferientimer</a>
                                </li>
                                <li>
                                	<a href="?r=teapot" <?php echoClassName('teapot'); ?>>Teapot</a>
                                </li>
                                <li>
                                	<a href="?r=midpoint" <?php echoClassName('midpoint'); ?>>Diamond square algorithmus</a>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                    	<a href="?r=css3">CSS 3</a>
                    	<div class="uk-navbar-dropdown">
	                    	<ul class="uk-nav uk-navbar-dropdown-nav">
		                    	<li>
                                	<a href="?r=clock" <?php echoClassName('clock'); ?>>3D Uhr</a>
                                </li>
	                    	</ul>
                    	</div>
                    </li>
                    <li <?php echoClassName('galleries'); ?>>
                        <a href="?r=galleries">Galerie</a>
                    </li>
                    <li <?php echoClassName('notes'); ?>>
                        <a href="?r=notes">Notizen</a>
                    </li>
                    <li <?php echoClassName('video'); ?>>
                        <a href="?r=video">Video</a>
                    </li>
                    <li>
                    	<a href="?r=documentation" <?php echoClassName('documentation'); ?>>Dokumentation</a>
                    	<div class="uk-navbar-dropdown">
                            <ul class="uk-nav uk-navbar-dropdown-nav">
                                <li>
                                  <a href="?r=portfolio" <?php echoClassName('portfolio'); ?>>Portfolio</a>
                                </li>
                                <li>
                                  <a href="?r=journal" <?php echoClassName('journal'); ?>>Lernjournal</a>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
        <main id="mainContentRender" class="uk-margin uk-margin-left uk-margin-right">
            <?php renderBody(); ?>
        </main>
        <?php if ($routeConfig["renderFooter"] == true) { ?>
            <footer class="uk-text-center">
                <p>
                    Modul 152 | &copy; Lukas Bischof 2017 | BBW Schulprojekt
                </p>
            </footer>
        <?php } ?>
    </body>
</html>
