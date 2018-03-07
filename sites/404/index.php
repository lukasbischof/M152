<?php
	$requested = NULL;
	
	if (isset($_GET['r'])) {
		$requested = ucfirst(htmlentities($_GET['r']));
	}	
?>

<h1>404 Not Found</h1>
<h4>Can't find site<?php if ($requested) { echo " \"$requested\""; } ?></h4>
