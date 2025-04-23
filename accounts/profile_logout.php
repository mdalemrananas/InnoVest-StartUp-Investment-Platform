<?php

session_start();
session_unset();
session_destroy();
header('location: http://localhost/ngo/Home_page/login-user.php');

?>
