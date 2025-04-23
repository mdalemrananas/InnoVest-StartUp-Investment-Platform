<?php

use Google\Service\AndroidPublisher\PendingCancellation;

session_start();
//We offer security solutions and cost effective service for our client are safe and secure in any situation.

// Initialize $user_id variable
$user_id = null;

$servername = "localhost";
$username = "root";
$password = "";
$database_name = "empower_it";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $database_name);


// Check if user_id is set in $_SESSION
if (isset($_SESSION['email'])) {
    $user_id = $_SESSION['user_id'];
    $email = $_SESSION["email"];
    $email = mysqli_real_escape_string($conn, $email);
}



// Example query (replace with your actual query)
$sql2 = "SELECT * FROM ecommerce_product AS p INNER JOIN ecommerce_carts AS sc ON sc.product_id = p.product_id WHERE sc.user_id = $user_id";
$data2 = $conn->query($sql2);

if ($user_id == NULL) {
    $count_cart = 0;
} else {
    //Cart Count
    $sql3 = "SELECT COUNT(cart_id) AS count_cart FROM ecommerce_carts AS sc INNER JOIN ecommerce_product AS p ON p.product_id = sc.product_id WHERE sc.user_id = $user_id";
    $data3 = $conn->query($sql3);
    $row3 = mysqli_fetch_assoc($data3);
    $count_cart = $row3['count_cart'];
}









// Initialize error message
$error = "";


// Check if the form has been submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if the checkbox is checked
    if (isset($_POST['accreditationCheckbox']) && $_POST['accreditationCheckbox'] == 'accpet') {
        $reason = mysqli_real_escape_string($conn, $_POST['reason']);
        // Variables to be inserted
        $ci_id = isset($_GET['ci_id']) ? intval($_GET['ci_id']) : null; // Sanitize and check if set
        $user_id = isset($_SESSION['user_id']) ? intval($_SESSION['user_id']) : null; // Assuming user_id is from session or form
        $request_status = "Pending";

        // Prepare the SQL statement
        $sql = "INSERT INTO fundraising_investor (ci_id, user_id, request_status, reason) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);

        if ($stmt) {
            // Bind parameters
            $stmt->bind_param('iiss', $ci_id, $user_id, $request_status, $reason);

            // Execute the prepared statement
            if ($stmt->execute()) {
                // Redirect to thank you page on success
                header("Location: thankyou.php");
                exit(); // Always exit after header to stop further script execution
            } else {
                // Handle execution error
                echo "Error: " . $stmt->error;
            }

            // Close the statement
            $stmt->close();
        } else {
            // Handle statement preparation error
            echo "Error preparing statement: " . $conn->error;
        }
    } else {
        // If the checkbox is not checked, show an error message
        $error = "You must confirm that you are an Accredited Fundraiser to proceed.";
    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title>Empower IT - Shop</title>

    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/all.min.css">
    <link rel="stylesheet" href="assets/css/animate.css">
    <link rel="stylesheet" href="assets/css/nice-select.css">
    <link rel="stylesheet" href="assets/css/slick.css">
    <link rel="stylesheet" href="assets/css/slick-theme.css">
    <link rel="stylesheet" href="assets/css/odometer.css">
    <link rel="stylesheet" href="assets/css/magnific-popup.css">
    <link rel="stylesheet" href="assets/css/flaticon.css">
    <link rel="stylesheet" href="assets/css/main.css">

    <link rel="shortcut icon" href="assets/images/favicon.png" type="image/x-icon">


    <!-- Font Awesome for icons -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">

</head>

<body>


    <!-- ==========Preloader Overlay Starts Here========== -->
    <div class="overlayer">
        <div class="loader">
            <div class="loader-inner"></div>
        </div>
    </div>
    <div class="scrollToTop"><i class="fas fa-angle-up"></i></div>
    <div class="overlay"></div>
    <div class="overlayTwo"></div>
    <!-- ==========Preloader Overlay Ends Here========== -->

    <!-- ==========Header Section Starts Here========== -->
    <header>
        <div class="header-top">
            <div class="container">
                <div class="header-top-area">
                    <ul class="left">
                        <li>
                            <i class="far fa-clock"></i> 9:30am - 6:30pm Mon - Sun
                        </li>
                        <li>
                            <a href="#"><i class="fas fa-phone-alt"></i> +800-123-4567 6587</a>
                        </li>
                        <li>
                            <i class="fas fa-map-marker-alt"></i> Beverley, New York 224 US
                        </li>
                    </ul>
                    <ul class="social-icons">
                        <li>
                            <a href="#"><i class="fab fa-facebook-messenger"></i></a>
                        </li>
                        <li>
                            <a href="#"><i class="fab fa-twitter"></i></a>
                        </li>
                        <li>
                            <a href="#"><i class="fab fa-vimeo-v"></i></a>
                        </li>
                        <li>
                            <a href="#"><i class="fab fa-skype"></i></a>
                        </li>
                        <li>
                            <a href="#"><i class="fas fa-wifi"></i></a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="header-bottom">
            <div class="container">
                <div class="header-wrapper">
                    <div class="logo">
                        <a href="home.php">
                            <img src="assets/images/logo/logo.jpg" alt="logo">
                        </a>
                    </div>
                    <div class="menu-area">
                        <ul class="menu">
                            <li>
                                <a href="home.php">Home</a>
                            </li>
                            <li>
                                <a href="funding_donation.php">Project</a>
                                <!--<ul class="submenu">
                                    <li><a href="causes.php" class="active">Causes</a></li>
                                    <li><a href="causes-single.php">Causes Details</a></li>
                                </ul>-->
                            </li>
                            <li>
                                <a href="funding_event.php">Donation</a>
                                <!--<ul class="submenu">
                                            <li><a href="events.php">Our Events</a></li>
                                            <li><a href="events-single.php">Events Single</a></li>
                                        </ul>-->
                            </li>
                            <li>
                                <a href="blog.php">Blog</a>
                                <!--<ul class="submenu">
                                    <li> <a href="blog-grid.php">Blog Grid</a></li>
                                    <li><a href="blog-classic.php">Blog Classic</a></li>
                                    <li><a href="blog-single.php">Blog Single</a></li>
                                </ul>-->
                            </li>
                            <li>
                                <a href="shop.php">Shop</a>
                                <!--<ul class="submenu">
                                    <li><a href="shop.php">Our Shop</a></li>
                                    <li><a href="shop-single.php">Shop Single</a></li>
                                    <li><a href="cart.php">Cart</a></li>
                                </ul>-->
                            </li>
                            <li>
                                <a href="startup.php">Startup</a>
                                <!--<ul class="submenu">
                                    <li><a href="shop.php">Our Shop</a></li>
                                    <li><a href="shop-single.php">Shop Single</a></li>
                                    <li><a href="cart.php">Cart</a></li>
                                </ul>-->
                            </li>
                            <li>
                                <a href="#0">Pages </a>
                                <ul class="submenu">

                                    <li>
                                        <a href="#0">Account</a>
                                        <ul class="submenu">
                                            <li><a href="signin.php">Sign In</a></li>
                                            <li><a href="registration.php">Sign Up</a></li>
                                        </ul>
                                    </li>
                                    <li>
                                        <a href="pages_gallery.php">Gallery</a>
                                        <!--<ul class="submenu">
                                            <li><a href="shop.php">Our Shop</a></li>
                                            <li><a href="shop-single.php">Shop Single</a></li>
                                            <li><a href="cart.php">Cart</a></li>
                                        </ul>-->
                                    </li>

                                    <li>
                                        <a href="volunteer_list.php">Volunteer</a>
                                        <!--<ul class="submenu">
                                            <li><a href="volunteer_list.php">Volunteer</a></li>
                                            <li><a href="volunteer-single.php">Volunteer Single</a></li>
                                        </ul>-->
                                    </li>
                                    <li>
                                        <a href="contact.php">Contact</a>
                                        <!--<ul class="submenu">
                                            <li><a href="events.php">Our Events</a></li>
                                            <li><a href="events-single.php">Events Single</a></li>
                                        </ul>-->
                                    </li>
                                    <li><a href="about_us.php">About Us</a></li>
                                    <li><a href="pages_faqs.php">Faqs</a></li>
                                    <!--<li><a href="coming_soon.php">Coming Soon</a></li>
                                    <li><a href="error_page.php">404 Error</a></li>-->
                                </ul>
                            </li>
                            <!--<li><a href="contact.php">Contact</a></li>-->
                        </ul>

                        <div class="search-button">
                            <a href="#">
                                <i class="fas fa-search"></i>
                            </a>
                        </div>
                        <div class="cart-button">
                            <a href="#">
                                <span class="cart-amount">
                                    <?php echo $count_cart; ?>
                                </span>
                                <i class="fas fa-shopping-basket"></i>
                            </a>
                        </div>
                        <div class="header-bar d-lg-none">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div class="ellepsis-bar d-lg-none">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <!-- ==========Header Section Ends Here========== -->

    <!-- ===========Header Search=========== -->
    <div class="header-form">
        <div class="bg-lay">
            <div class="cross">
                <i class="fas fa-times"></i>
            </div>
        </div>
        <form class="form-container">
            <input type="text" placeholder="Input Your Search" name="name">
            <button type="submit">Search</button>
        </form>
    </div>
    <!-- ===========Header Search=========== -->

    <!-- ===========Header Cart=========== -->
    <div class="cart-sidebar-area">
        <div class="top-content">
            <a href="home.php" class="logo">
                <img src="assets/images/logo/logo.jpg" alt="logo">
            </a>
            <span class="side-sidebar-close-btn"><i class="fas fa-times"></i></span>
        </div>
        <div class="bottom-content">
            <div class="cart-products">
                <h4 class="title">Shopping cart</h4>

                <?php
                // Check if there are results
                if ($data2 && $data2->num_rows > 0) {
                    // Output data of each row
                    while ($row2 = mysqli_fetch_assoc($data2)) {
                ?>

                        <div class="single-product-item">
                            <div class="thumb">
                                <img src="assets/images/shop/01.png" alt="shop">
                            </div>
                            <div class="content">
                                <h4 class="title">
                                    <?php echo $row2['title']; ?>
                                </h4>
                                <div class="price"><span class="price">$
                                        <?php echo $row2['price']; ?>
                                    </span> <del class="dprice">$120.00</del></div>
                                <a href="#" class="remove-cart">Remove</a>
                            </div>
                        </div>

                <?php
                    }
                } else {
                    echo '<p>No items in cart.</p>';
                }
                ?>

                <div class="btn-wrapper text-center">
                    <a href="shop_checkout.php" class="custom-button"><span>Checkout</span></a>
                </div>
            </div>
        </div>
    </div>
    <!-- ===========Header Cart end=========== -->

    <!-- ==========Banner Section Starts Here========== -->
    <section class="page-header bg_img" data-background="assets/images/banner/startup-header.jpg">
        <div class="container">
            <div class="page-header-content">
                <h1 class="title">Our Startup Page</h1>
                <ul class="breadcrumb">
                    <li>
                        <a href="index.html">Home</a>
                    </li>
                    <li>
                        Startup
                    </li>
                </ul>
            </div>
        </div>
    </section>
    <!-- ==========Banner Section Ends Here========== -->


    <!-- ==========Shop Section Starts Here========== -->
    <div class="shop-page padding-top padding-bottom">
        <div class="container">

            <form method="POST" action="">
                <div class="registration-container">
                    <h1>Fundraiser Terms and Conditions</h1>

                    <!-- Progress Line -->
                    <div class="progress-line">
                        <div class="step active">
                            <div class="step-number">1</div>
                            Verify Your Account
                        </div>
                        <div class="step active">
                            <div class="step-number">2</div>
                            Fundraiser Profile
                        </div>
                        <div class="step active">
                            <div class="step-number">3</div>
                            Accreditation
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" id="progress-bar"></div>
                        </div>
                    </div>

                    <!-- Accreditation Section -->
                    <div class="accreditation-section">
                        <h5>Why are you interested in this company?</h5>
                        <textarea name="reason" id="reason" required style="height: 100px;"></textarea><br><br>
                        <h5>Review and Confirm the Fundraiser Accreditation Terms:</h5>
                        <textarea rows="1" readonly>1. Acceptance of Terms By accessing or using the Fundable, LLC platform (the "Platform"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree, please refrain from using the Platform.

2. Eligibility Requirements

- Accredited Fundraiser Status: You understand that listing on Fundable, LLC as a potential funding source is restricted to "Accredited Fundraisers." By making this request for listing, you represent that you qualify as an Accredited Fundraiser as defined by federal and state securities laws.
- Age Requirement: You must be at least 18 years old or the age of majority in your jurisdiction.
- Compliance with Laws: You agree to comply with all applicable local, state, and federal laws and regulations.
3. User Accounts

- Registration: You must create an account to access certain features of the Platform. You agree to provide accurate, current, and complete information during registration.
- Account Security: You are responsible for maintaining the confidentiality of your account information and are liable for any activity under your account.
4. Project Listings

Submission Process: Project creators may submit projects for listing on the Platform. All submissions must comply with our guidelines and applicable laws.
Approval Authority: Fundable, LLC reserves the right to approve or reject any project submission at its sole discretion.
5. Investment Transactions

Investment Risks: You acknowledge that all investments carry inherent risks, including the potential loss of your entire investment. Conduct thorough due diligence before making any investment decisions.
Fees: Fundable, LLC may charge fees for services rendered, which will be clearly disclosed before completing any transaction.
6. Intellectual Property Rights All content on the Platform, including but not limited to text, graphics, logos, and software, is the property of Fundable, LLC or its licensors and is protected by copyright and trademark laws.

7. Limitation of Liability To the fullest extent permitted by law, Fundable, LLC shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Platform or any investment decisions made.

8. Indemnification You agree to indemnify and hold Fundable, LLC, its affiliates, and their respective officers, directors, and employees harmless from any claims, losses, damages, liabilities, costs, or expenses arising from your use of the Platform or violation of these Terms.

9. Modifications to Terms Fundable, LLC reserves the right to modify these Terms at any time. You will be notified of any significant changes, and your continued use of the Platform after such modifications constitutes acceptance of the revised Terms.

10. Governing Law These Terms shall be governed by and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law principles.

11. Contact Information For any questions regarding these Terms, please contact us at empowerit05@gmail.com.
                    </textarea>
                        <div class="checkbox-group">
                            <input type="checkbox" id="accreditationCheckbox" name="accreditationCheckbox" value="accpet" class="short-checkbox">
                            <label for="accreditationCheckbox">I am an Accredited Fundraiser and meet one or more criteria
                                above.</label>
                        </div>

                    </div>

                    <!-- Guidelines Section -->
                    <div class="guidelines">
                        <p>Fundable does not guarantee investment quality.</p>
                        <p>You are responsible for your own due diligence.</p>
                        <p>Fundable does not broker or collect any funds whatsoever.</p>
                        <p>Invest completely at your own risk. <?php echo $email; ?></p>
                    </div>

                    <!-- Display error message if any -->
                    <?php if (!empty($error)): ?>
                        <div class="error-message"><?php echo $error; ?></div>
                    <?php endif; ?>

                    <!-- Submit Button -->
                    <button type="submit" name="submitBtn" id="submitBtn" value="submitBtn" class="submit-button">Request for Access ➔</button>
                </div>
            </form>

            <style>
                .registration-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    text-align: center;
                    font-size: 2rem;
                    margin-bottom: 20px;
                    color: #333;
                }

                .progress-line {
                    position: relative;
                    display: flex;
                    justify-content: space-between;
                    margin: 20px 0;
                    padding: 10px 0;
                }

                .step {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    color: #ccc;
                    font-weight: bold;
                    font-size: 14px;
                }

                .step.active {
                    color: #0073b1;
                }

                .step-number {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 2px solid #ccc;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 5px;
                    background-color: white;
                    transition: background-color 0.3s, border-color 0.3s, color 0.3s;
                }

                .step.active .step-number {
                    border-color: #0073b1;
                    background-color: #0073b1;
                    color: white;
                }

                .progress-bar-container {
                    position: absolute;
                    top: 25px;
                    left: 0;
                    width: 100%;
                    height: 8px;
                    background-color: #e0e0e0;
                    border-radius: 5px;
                    z-index: -1;
                }

                .progress-bar {
                    height: 100%;
                    background-color: #0073b1;
                    width: 66.66%;
                    /* Adjust according to progress */
                    transition: width 0.4s ease;
                    border-radius: 5px;
                }

                .accreditation-section {
                    margin-bottom: 20px;
                }

                .accreditation-section h2 {
                    font-size: 1rem;
                    margin-bottom: 15px;
                }

                .accreditation-section textarea {
                    width: 100%;
                    padding: 10px;
                    border-radius: 5px;
                    border: 1px solid #ccc;
                    font-size: 14px;
                    resize: none;
                    height: 300px;
                    background-color: #f9f9f9;
                }

                .checkbox-group {
                    margin: 15px 0;
                    /* Adjust vertical spacing */
                    display: contents;
                    /* Use flexbox for alignment */
                    align-items: center;
                    /* Center align items vertically */
                }

                .short-checkbox {
                    width: 16px;
                    /* Adjust width */
                    height: 16px;
                    /* Adjust height */
                    margin-right: 10px;
                    /* Space between checkbox and label */
                    cursor: pointer;
                    /* Change cursor on hover */
                    accent-color: #0073b1;
                    /* Change checkbox color (optional) */
                }


                .guidelines {
                    font-size: 14px;
                    margin: 15px 0;
                }

                .guidelines p {
                    margin: 10px 0;
                }

                .guidelines p:before {
                    content: "+ ";
                    font-weight: bold;
                    color: #666;
                }

                .submit-button {
                    background-color: #4CAF50;
                    color: white;
                    padding: 15px;
                    text-align: center;
                    font-size: 16px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    width: 100%;
                    margin-top: 15px;
                    transition: background-color 0.3s;
                }

                .submit-button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }

                .submit-button:hover:not(:disabled) {
                    background-color: #45a049;
                }

                /* Icons */
                .icon {
                    font-family: 'Arial', sans-serif;
                }
            </style>


        </div>

    </div>
    <!-- ==========Shop Section Ends Here========== -->


    <!-- =========Footer Section Starts Here========== -->
    <footer>
        <div class="footer-top">
            <div class="ft-top">
                <div class="container">
                    <div class="row no-gutters justify-content-center">
                        <div class="col-lg-4 col-sm-6 col-12">
                            <div class="ftt-item">
                                <div class="ftt-inner">
                                    <div class="ftt-thumb">
                                        <img src="assets/images/footer/icon/01.png" alt="footer-icon">
                                    </div>
                                    <div class="ftt-content">
                                        <p class="mb-0">Phone Number : +8801 608 754 529</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-sm-6 col-12">
                            <div class="ftt-item">
                                <div class="ftt-inner">
                                    <div class="ftt-thumb">
                                        <img src="assets/images/footer/icon/02.png" alt="footer-icon">
                                    </div>
                                    <div class="ftt-content">
                                        <p class="mb-0">Email :empowerit05@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 col-sm-6 col-12">
                            <div class="ftt-item">
                                <div class="ftt-inner">
                                    <div class="ftt-thumb">
                                        <img src="assets/images/footer/icon/03.png" alt="footer-icon">
                                    </div>
                                    <div class="ftt-content">
                                        <p class="mb-0">Address : United City, Dhaka, Bangladesh</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="ft-bottom">
                            <div class="row">
                                <div class="col-lg-4 col-md-6">
                                    <div class="footer-widget widget-about">
                                        <h5 class="title text-uppercase">About Empower IT</h5>
                                        <p>
                                            Empowering communities with donations, education, and startup funding.
                                            Providing essential support and resources for the needy.
                                        </p>
                                        <div class="ftb-map">
                                            <iframe
                                                src="https:www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.227736756104!2d90.38698295091588!3d23.73925698451917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b85c740f17d1%3A0xdd3daab8c90eb11f!2sCodexCoder!5e0!3m2!1sen!2sbd!4v1633410430100!5m2!1sen!2sbd"
                                                allowfullscreen=""></iframe>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6">
                                    <div class="footer-widget widget-blog">
                                        <h5 class="title text-uppercase">our Recent news</h5>
                                        <ul class="footer-blog">
                                            <li>
                                                <div class="thumb">
                                                    <a href="blog-single.php">
                                                        <img src="assets/images/footer/blog1.png" alt="footer">
                                                    </a>
                                                </div>
                                                <div class="content">
                                                    <a href="blog-single.php">Enable Seamin Matera Forin And Our
                                                        Orthonal Create Vortals.</a>
                                                    <span>July 23, 2021</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="thumb">
                                                    <a href="blog-single.php">
                                                        <img src="assets/images/footer/blog2.png" alt="footer">
                                                    </a>
                                                </div>
                                                <div class="content">
                                                    <a href="blog-single.php">Dynamca Network Otuitive Catays For
                                                        Plagiarize Mindshare After</a>
                                                    <span>July 23, 2021</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 pl-xl-4">
                                    <div class="footer-widget widgt-form">
                                        <h5 class="title text-uppercase">our NEWSLETTER</h5>
                                        <p>Empoer IT is a nonproﬁt organization supported by community leaders</p>
                                        <form class="footer-form">
                                            <input type="email" placeholder="Enter your email" name="email">
                                            <button type="submit">
                                                <span>send massage<i class="far fa-paper-plane ml-2"></i></span>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container">
                <div class="text-center">
                    <p class="mb-0">&copy; 2024 <a href="home.php">Empower IT</a> -Together, we rise.
                    </p>
                </div>
            </div>
        </div>
    </footer>
    <!-- =========Footer Section Ends Here========== -->

    <script src="assets/js/jquery.js"></script>
    <script src="assets/js/modernizr-3.6.0.min.js"></script>
    <script src="assets/js/plugins.js"></script>
    <script src="assets/js/bootstrap.min.js"></script>
    <script src="assets/js/circularProgressBar.min.js"></script>
    <script src="assets/js/isotope.pkgd.min.js"></script>
    <script src="assets/js/magnific-popup.min.js"></script>
    <script src="assets/js/wow.min.js"></script>
    <script src="assets/js/viewport.jquery.js"></script>
    <script src="assets/js/odometer.min.js"></script>
    <script src="assets/js/nice-select.js"></script>
    <script src="assets/js/slick.min.js"></script>
    <script src="assets/js/main.js"></script>



    <!-- Include jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"
        integrity="sha384-+0fX/pIA8lAW2/X5qUYB9aJvzS0Y6qZu2q9t8A0F/VxgV+kX6V+k9KehPLU1TkgP"
        crossorigin="anonymous"></script>
    <script>
        // Enable or disable submit button based on checkbox selection
        const checkbox = document.getElementById('accreditationCheckbox');
        const submitButton = document.getElementById('submitBtn');

        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                submitButton.disabled = false;
            } else {
                submitButton.disabled = true;
            }
        });
    </script>

    <!-- JavaScript for Progress Bar and Slider -->
    <script>
        // Update the progress bar based on current step
        function updateProgress(step) {
            const progressBar = document.getElementById('progress-bar');
            if (step === 1) {
                progressBar.style.width = '33.33%';
            } else if (step === 2) {
                progressBar.style.width = '66.66%';
            } else if (step === 3) {
                progressBar.style.width = '100%';
            }
        }

        // Example: Start at step 2
        updateProgress(2);

        // Handle slider range value
        const investmentRange = document.getElementById('investmentRange');
        const investmentAmount = document.getElementById('investmentAmount');

        investmentRange.addEventListener('input', function() {
            investmentAmount.textContent = investmentRange.value;
        });
    </script>


</body>

</html>