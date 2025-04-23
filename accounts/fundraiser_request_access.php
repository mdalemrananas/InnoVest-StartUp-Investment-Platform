<?php
// Start session
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$database_name = "empower_it";

// Establish database connection
$conn = mysqli_connect($servername, $username, $password, $database_name);

// Check the database connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$ci_id = isset($_GET['ci_id']) ? mysqli_real_escape_string($conn, $_GET['ci_id']) : null; // Sanitize 'ci_id'

// Initialize response
$response = ['loggedIn' => false];

// Check if the session variable 'email' exists
if (isset($_SESSION['email'])) {
    $response['loggedIn'] = true;

    // Sanitize email from session
    $email = mysqli_real_escape_string($conn, $_SESSION['email']);

    // Query to check user information
    $check_email_query = "SELECT * FROM ecommerce_user WHERE email = '$email'";
    $data = mysqli_query($conn, $check_email_query);

    // Ensure the query executed successfully and user is found
    if ($data && mysqli_num_rows($data) > 0) {
        $user = mysqli_fetch_assoc($data);

        // Check if user is admin
        if ($user['administration_type'] === "Fundraiser") {
            // Redirect Admin to a specific page
            header('Location: fundraiser_request_access2.php?ci_id=' . $ci_id);
            exit();
        } else {
            // Non-admin users can be redirected elsewhere or shown an error
            echo "<script>
                    alert('Access Denied! Only Admins can proceed.');
                    document.location.href = 'user-dashboard.php'; // Redirect non-admin users to dashboard
                  </script>";
            exit();
        }
    } else {
        // If user not found in the database
        echo "<script>
                alert('User not found. Please sign up.');
                document.location.href = 'sign-up.php';
              </script>";
        exit();
    }
} else {
    // If not logged in, redirect to login page
    echo "<script>
            alert('Please log in to continue.');
            document.location.href = 'login-user.php';
          </script>";
    exit();
}
?>
