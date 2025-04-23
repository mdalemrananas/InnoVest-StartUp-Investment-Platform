<?php

session_start();

if (isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit;
}

$error = '';
$servername = "localhost";
$username = "root";
$password = "";
$database_name = "empower_it";

$conn = mysqli_connect($servername, $username, $password, $database_name);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_POST['submit'])) {
    $email = $_POST['email'];
    $password1 = mysqli_real_escape_string($conn, $_POST['password']);

    if (!empty($email) && !empty($password1)) {
        // Ensure correct casing for the table name and columns
        $sql = "SELECT * FROM users WHERE email='$email'";
        $result = $conn->query($sql);

        

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            // Verify password
            if (password_verify($password1, $row['password'])) {
                $_SESSION['user_id'] = $row['user_id'];
                $_SESSION['email'] = $email;

                
                // Redirect with proper URL parameters
                $redirect_url = "http://localhost/ngo/Dashboard-2/dashboard_analytics.php";
                $redirect_url .= "?user_id=" . urlencode($row['user_id']);
                $redirect_url .= "&email=" . urlencode($email);

                header("Location: $redirect_url");
                exit;
                echo "success";
            } else {
                //$errors['email'] = "Invalid password";
                echo "Invalid password";
            }
        } else {
            //$errors['email'] = "No user found";
            echo "No user found";
        }
    } else {
        //$errors['email'] = "All input fields are required!";
        echo "All input fields are required!";
    }
} else {
    //$errors['email'] = "Form submission error!";
    echo "Form submission error!";
}

mysqli_close($conn);

?>

















<?php
/*
session_start();
//set_include_path(get_include_path() . PATH_SEPARATOR . 'NGO/Home_page/db_conn.php');

$servername = "localhost";
$username = "root";
$password = "";
$databasename = "empower_it";

$conn = mysqli_connect($servername, $username, $password, $databasename);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_POST['submit'])) {
    $email = mysqli_real_escape_string($conn, $_POST["email"]);
    $password = mysqli_real_escape_string($conn, $_POST['password']);

    if (!empty($email) && !empty($password)) {
        $sql = mysqli_query($conn, "SELECT * FROM users WHERE email = '{$email}'");
        if ($sql) {
            if (mysqli_num_rows($sql) == 1) {
                $row = mysqli_fetch_assoc($sql);
                $hashed_password = $row['password'];

                
                
                // Verify the password
                if (password_verify($password, $hashed_password)) {
                    // Password is correct
                    echo "Entered Password: $password<br>";
                    echo "Hashed Password from DB: $hashed_password<br>";
                    echo "Login successful!";
                    // Redirect or set session here
                } else {
                    // Password is incorrect
                    echo "Entered Password: $password<br>";
                    echo "Hashed Password from DB: $hashed_password<br>";
                    echo "Invalid Password";
                }
                
            } else {
                // User not found
                echo "User not found!";
            }
        } else {
            echo "Query execution failed: " . mysqli_error($conn);
        }
    } else {
        echo "All input fields are required!";
    }
} else {
    echo "Form submission error!";
}

mysqli_close($conn);
*/
?>
