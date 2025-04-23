<?php
session_start();
set_include_path(get_include_path() . PATH_SEPARATOR . 'NGO/Home_page/db_conn.php');

$servername = "localhost";
$user_name = "root";
$password = "";
$database_name = "empower_it";

$conn = mysqli_connect($servername, $user_name, $password, $database_name);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Validate inputs
if (isset($_GET['username']) && isset($_GET['email']) && isset($_GET['password']) && isset($_GET['ran_id'])) {
    $username = $_GET['username'];
    $email = $_GET['email'];
    $password = $_GET['password'];
    $ran_id = $_GET['ran_id'];
} else {
    die("Email or Ran ID not provided in the URL parameters.");
}

if (isset($_POST['send'])) {
    $verify_code = mysqli_real_escape_string($conn, $_POST["verify_code"]);

    if (!empty($verify_code)) {
        if ($ran_id == $verify_code) {
            // Set session variables
            $_SESSION['username'] = $username;
            $_SESSION['email'] = $email;
            $_SESSION['password'] = $password;
            $_SESSION['ran_id'] = $ran_id;
    
            // Redirect to signup.php with URL parameters
            header("Location: signup.php?username=" . urlencode($username) . "&email=" . urlencode($email) . "&password=" . $password . "&verify_code=" . $verify_code);
           //echo $username; echo $email; echo $password; echo $verify_code;
            exit();
        } else {
            // Verification code does not match
            echo "<p>Verification code does not match.</p>";
            exit();
        }
    } else {
        // Verification code is required
        echo "Verification code is required!";
    }
} else {
    echo "Form submission error!";
}

mysqli_close($conn);
?>