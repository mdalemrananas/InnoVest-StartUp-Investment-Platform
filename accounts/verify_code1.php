<?php
session_start();

// Include PHPMailer autoloader
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';
require 'phpmailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Include the database connection file
set_include_path(get_include_path() . PATH_SEPARATOR . 'NGO/Home_page/db_conn.php');

if (isset($_POST["send"])) {
    $username = isset($_POST["username"]) ? $_POST["username"] : '';
    $email = isset($_POST["email"]) ? $_POST["email"] : '';
    $password = isset($_POST["password"]) ? $_POST["password"] : '';

    if (!empty($username) && !empty($email) && !empty($password)) {
        // Random number generation
        $ran_id = rand(100000, 999999);

        try {
            $mail = new PHPMailer(true);
            
            // SMTP configuration
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            //$mail->Username = 'kmohen32@gmail.com'; // Your gmail username
            //$mail->Password = 'vsblgnlxvnmhgkrs'; // Your gmail app password ncyi trkx octf mhfe
            $mail->Username = 'empowerit05@gmail.com'; // Your gmail username
            $mail->Password = 'ncyitrkxoctfmhfe'; // Your gmail app password (xwjmpirwlwgbwenj)
            $mail->SMTPSecure = 'ssl';
            $mail->Port = 465;

            // Email setup
            $mail->setFrom('kmohen32@gmail.com'); // Set the sender email address
            $mail->addAddress($_POST["email"]); // Add recipient email address
            $mail->isHTML(true);
            $mail->Subject = "Here is your Verification code:";
            $mail->Body = "Welome to Empower It. Here is your Verification code: $ran_id";

            // Enable error logging
            $mail->SMTPDebug = 2;

            // Send email
            if (!$mail->send()) {
                throw new Exception("Mailer Error: " . $mail->ErrorInfo);
            } else {
                // Store email and redirect
                $_SESSION['username'] = $username;
                $_SESSION['email'] = $email;
                $_SESSION['password'] = $password;
                $_SESSION['ran_id'] = $ran_id;
                header("Location: registration2.php?username=" . urlencode($username) . "&email=" . urlencode($email) . "&password=" . $password . "&ran_id=" . $ran_id);
                exit();
            }
        } catch (Exception $e) {
            echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }
    } else {
        echo "All input fields are required!";
    }
}
?>
