<?php
session_start();

$user_id = null;

$servername = "localhost";
$username = "root";
$password = "";
$database_name = "empower_it";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $database_name);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Check if user_id is set in $_SESSION
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
} 

// Initialize count_cart
$count_cart = 0;

if ($user_id !== null) {
    // Wishlist query
    $sql2 = "SELECT * FROM ecommerce_product AS p INNER JOIN ecommerce_wishlist AS sc ON sc.product_id = p.product_id WHERE sc.user_id = ?";
    
    $stmt2 = $conn->prepare($sql2);
    $stmt2->bind_param("i", $user_id); // Assuming user_id is an integer
    $stmt2->execute();
    $data2 = $stmt2->get_result();

    // Count items in wishlist
    $sql3 = "SELECT COUNT(id) AS count_cart FROM ecommerce_wishlist WHERE user_id = ?";
    $stmt3 = $conn->prepare($sql3);
    $stmt3->bind_param("i", $user_id); // Assuming user_id is an integer
    $stmt3->execute();
    $result3 = $stmt3->get_result();
    $row3 = $result3->fetch_assoc();
    $count_cart = $row3['count_cart'];
}

// Fundraising company products query
$sql = "SELECT * FROM fundraising_company_product WHERE request_status = 'Accept' ORDER BY ci_id DESC";
$data5 = $conn->query($sql);

if (!$data5) {
    die("Query failed: " . $conn->error);
}

// Continue with processing $data2, $count_cart, and $data5...

?>



<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title>Empower IT</title>

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

    <link rel="shortcut icon" href="assets/images/favicon2.png" type="image/x-icon">

    <!-- Link Font Awesome stylesheet -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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

    <header>
        <div class="header-top">
            <div class="container">
                <div class="header-top-area">


                    <div class="ht-left">
                        <ul class="lab-ul d-flex flex-wrap justify-content-end">
                            <?php
                            $sql8 = "SELECT * FROM ecommerce_user"; // Correct the query to fetch users
                            $data8 = $conn->query($sql8);

                            while ($row8 = mysqli_fetch_assoc($data8)) {
                                // Check if the user_id matches the user's user_id
                                if ($row8['user_id'] == $user_id) {
                            ?>
                                    <li class="d-flex flex-wrap align-items-center">
                                        <!-- Profile Button -->
                                        <a href="check_user_type.php">
                                            <img src="profile_pictures/<?php echo $row8['profile_picture']; ?>" style="width: 60px; height: auto; border-radius: 50%;">
                                        </a>
                                    </li>
                                <?php
                                    // Stop the loop once the user is found
                                    break;
                                }
                            }

                            // If no user is found, display default profile
                            if (!$row8) {
                                ?>
                                <li class="d-flex flex-wrap align-items-center">
                                    <!-- Start a Campaign Button -->
                                    <a href="#" class="campaign-button">
                                        <i class="fa-solid fa-plus"></i> Start a Campaign
                                    </a>
                                </li>
                                <li class="d-flex flex-wrap align-items-center">
                                    <!-- Sign Up / Sign In Button -->
                                    <div class="signup-signin">
                                        <a href="signup-user.php" class="signup-button">Sign Up</a>
                                        <span class="separator">or</span>
                                        <a href="login-user.php" class="signin-button">Sign In</a>
                                    </div>
                                </li>
                                <li class="d-flex flex-wrap align-items-center">
                                    <a href="check_user_type.php">
                                        <img src="profile_pictures/profile.png" style="width: 60px; height: auto; border-radius: 50%;">
                                    </a>
                                </li>
                            <?php
                            }
                            ?>
                        </ul>
                    </div>

                    <style>
                        /* Flexbox layout adjustments for positioning */
                        .ht-left {
                            width: 100%;
                        }

                        .d-flex {
                            display: flex;
                        }

                        .flex-wrap {
                            flex-wrap: wrap;
                        }

                        .justify-content-end {
                            justify-content: flex-end;
                        }

                        .align-items-center {
                            align-items: center;
                        }

                        /* Increased margin for spacing */
                        .ht-left ul li {
                            margin-right: 15px;
                            /* Increase this value for more space between items */
                        }

                        /* Button Styles */
                        .campaign-button {
                            background-color: #4a7a72;
                            color: white;
                            font-weight: bold;
                            padding: 10px;
                            border-radius: 5px;
                            text-decoration: none;
                            display: flex;
                            align-items: center;
                            font-size: 14px;
                        }

                        .campaign-button i {
                            margin-right: 8px;
                        }

                        .campaign-button:hover {
                            background-color: #386259;
                        }

                        .signup-signin {
                            display: flex;
                            align-items: center;
                        }

                        .signup-button,
                        .signin-button {
                            padding: 10px;
                            font-weight: bold;
                            color: black;
                            text-decoration: none;
                            font-size: 14px;
                            border-radius: 5px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }

                        .signup-button {
                            background-color: #f9c923;
                        }

                        .signin-button {
                            background-color: #4a7a72;
                        }

                        .signup-button:hover {
                            background-color: #e5b71d;
                        }

                        .signin-button:hover {
                            background-color: #386259;
                        }

                        .separator {
                            background-color: #ec443a;
                            color: white;
                            padding: 10px;
                            font-weight: bold;
                            font-size: 14px;
                            border-radius: 0px;
                        }

                        .ht-left ul {
                            list-style: none;
                            padding: 0;
                            margin: 0;
                            display: flex;
                            justify-content: flex-end;
                            /* Ensures alignment to the right */
                            width: 100%;
                            /* Ensure the list spans the full width */
                        }
                    </style>



                </div>
            </div>
        </div>
        <div class="header-bottom">
            <div class="container">
                <div class="header-wrapper">
                    <div class="logo">
                        <a href="home.php">
                            <img src="assets/images/logo/Empower-IT Logo1.png" alt="logo" style="width: 250px;">
                        </a>
                    </div>
                    <div class="menu-area">
                        <ul class="menu">
                            <li>
                                <a href="home.php">Home</a>
                                <!--<ul class="submenu">
                                    <li><a href="home.php" class="active">Home One</a></li>
                                </ul>-->
                            </li>
                            <li>
                                <a href="funding_donation.php">Project</a>
                                <!--<ul class="submenu">
                                    <li><a href="causes.php">Causes</a></li>
                                    <li><a href="causes_details.php">Causes Details</a></li>
                                </ul>-->
                            </li>
                            <li>
                                <a href="funding_event.php">Donation</a>
                                <!--<ul class="submenu">
                                    <li><a href="causes.php">Causes</a></li>
                                    <li><a href="causes_details.php">Causes Details</a></li>
                                </ul>-->
                            </li>
                            <li>
                                <a href="funding_blog.php">Blog</a>
                                <!--<ul class="submenu">
                                    <li> <a href="blog-grid.php">Blog Grid</a></li>
                                    <li><a href="blog.php">Blog Classic</a></li>
                                    <li><a href="blog_detals.php">Blog Single</a></li>
                                </ul>-->
                            </li>
                            <li>
                                <a href="shop.php">Shop</a>
                                <!--<ul class="submenu">
                                    <li><a href="gallery.php">Gallery</a></li>
                                </ul>-->
                            </li>
                            <li>
                                <a href="fundraiser_startup.php">Startup</a>
                                <!--<ul class="submenu">
                                    <li><a href="gallery.php">Gallery</a></li>
                                </ul>-->
                            </li>
                            <li>
                                <a href="#0">Pages </a>
                                <ul class="submenu">

                                    <!--<li>
                                        <a href="#0">Account</a>
                                        <ul class="submenu">
                                            <li><a href="signin.php">Sign In</a></li>
                                            <!--<li><a href="registration.php">Sign Up</a></li>--
                                        </ul>
                                    </li>-->
                                    <li>
                                        <a href="pages_volunteer_apply.php">Volunteer Apply</a>
                                        <!--<ul class="submenu">
                                            <li><a href="pages_volunteer_list.php">Volunteer</a></li>
                                            <li><a href="pages_volunteer_apply.php">Volunteer Apply</a></li>
                                        </ul>-->
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
                                        <a href="pages_contact.php">Contact</a>
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
                        </ul>
                        <!--<div class="search-button">
                            <a href="#">
                                <i class="fas fa-search"></i>
                            </a>
                        </div>-->
                        <div class="cart-button">
                            <a href="#">
                                <span class="cart-amount"><?php echo $count_cart; ?></span>
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
                <img src="assets/images/logo/Empower-IT Logo2.png" alt="logo">
            </a>
            <span class="side-sidebar-close-btn"><i class="fas fa-times"></i></span>
        </div>
        <div class="bottom-content">
            <div class="cart-products">
                <h4 class="title">Shopping Wishlist</h4>

                <?php
                // Check if there are results
                if ($data2 && $data2->num_rows > 0) {
                    // Output data of each row
                    while ($row2 = mysqli_fetch_assoc($data2)) {
                ?>

                        <div class="single-product-item">
                            <div class="thumb">
                                <img src="product_images/<?php echo $row2['main_pictures']; ?>" alt="product">
                            </div>
                            <div class="content">
                                <h4 class="title"><?php echo $row2['title']; ?></h4>
                                <div class="price"><span class="price">$<?php echo $row2['selling_price']; ?></span> <del class="dprice">$120.00</del></div>
                                <!--<a href="#" class="remove-cart">Remove</a>-->
                                <a href="#" class="remove-cart" data-user-id="<?php echo $user_id; ?>" data-product-id="<?php echo $row2['product_id']; ?>">Remove</a>
                            </div>
                        </div>

                <?php
                    }
                } else {
                    echo '<p>No items in wishlist.</p>';
                }
                ?>

                <div class="btn-wrapper text-center">
                    <a href="shop_cart.php?user_id=<?php echo $user_id; ?>" class="custom-button"><span>Go to Cart</span></a>
                </div>
            </div>
        </div>
    </div>
    <!-- ===========Header Cart=========== -->

    <!-- ==========Banner Section Starts Here========== -->
    <section class="page-header bg_img" data-background="assets/images/banner/startup-header.jpg">
        <div class="container">
            <div class="page-header-content">
                <h1 class="title">Our Startup Page</h1>
                <ul class="breadcrumb">
                    <li>
                        <a href="home.php">Home</a>
                    </li>
                    <li>
                        Startup
                    </li>
                </ul>
            </div>
        </div>
    </section>
    <!-- ==========Banner Section Ends Here========== -->


    <!-- ==========Blog Section Starts Here========== -->
    <div class="blog-section padding-top padding-bottom">
        <div class="container">


            <div class="widget-container">

                <div class="filters">
                    <!-- Search Input -->
                    <input type="text" class="search-input" id="search_input" placeholder="Search for order ID, customer, order status or something...">


                    <!-- categorys -->
                    <select class="category" data-choices data-choices-search-false name="category" id="category-filter">
                        <option value="All" selected>Select Category</option>
                        <option value="Consumer Products">Consumer Products</option>
                        <option value="Finance">Finance</option>
                        <option value="Gadgets">Gadgets</option>
                        <option value="Hardware">Hardware</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Products">Products</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Retail">Retail</option>
                        <option value="Services">Services</option>
                        <option value="Software" selected="selected">Software</option>
                        <option value="Stores">Stores (restaurants, coffee shops)</option>
                        <option value="Technology">Technology</option>
                        <option value="Web">Web</option>
                        <option value="Other">Other</option>
                    </select>


                    <!-- Filters Button -->
                    <button class="filter-button">
                        <i class="fa-solid fa-sliders"></i>
                        Filters
                    </button>
                </div>
                <style>
                    .widget-container {
                        align-items: baseline;
                        gap: 15px;

                        width: 100%;
                        max-width: auto;
                        margin: 50px auto;
                        padding: 20px;
                        background-color: white;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }

                    .filters {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        gap: 15px;
                    }

                    .filters input[type="text"],
                    .filters input[type="date"],
                    .filters select {
                        padding: 10px;
                        width: 100%;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        font-size: 14px;
                    }

                    .filters input[type="text"]::placeholder {
                        color: #bbb;
                    }

                    .filter-button {
                        background-color: #3B5998;
                        color: white;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        font-size: 14px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 5px;
                    }

                    .filter-button svg {
                        fill: white;
                    }

                    /* Adjust input width */
                    .filters .search-input {
                        flex: 2;
                    }

                    .filters .date-input {
                        flex: 1;
                    }

                    .filters .category,
                    .filters .location {
                        flex: 1;
                    }

                    .filter-button {
                        flex: 0.5;
                    }
                </style>

            </div>

            <div class="row mb-30-none justify-content-center" id="showdata">

                <?php
                // Get total number of blog entries
                $result = mysqli_query($conn, "SELECT * FROM fundraising_company_product WHERE request_status = 'Accept'");
                $total_rows = mysqli_num_rows($result);

                $limit = 3; // Number of posts per page
                $total_pages = ceil($total_rows / $limit); // Calculate total pages

                // Get current page number from URL, default to 1
                $current_page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                $current_page = max(1, min($total_pages, $current_page)); // Ensure it's within range

                // Calculate the starting row for the current page
                $offset = ($current_page - 1) * $limit;

                // Query the database for the current page's data
                $data = mysqli_query($conn, "SELECT * FROM fundraising_company_product WHERE request_status = 'Accpet' LIMIT $offset, $limit");

                while ($row = mysqli_fetch_assoc($data5)) {
                    $description = $row['description'];
                    $words = explode(' ', $description);
                    if (count($words) > 12) {
                        $short_description = implode(' ', array_slice($words, 0, 12)) . '...';
                    } else {
                        $short_description = $description;
                    }
                ?>
                    <!-- Blog Posts -->
                    <div class="col-xl-4 col-md-6">
                        <div class="post-item">
                            <div class="post-thumb">


                                <?php
                                foreach (json_decode($row["cover_pictures"]) as $cover) : ?>
                                    <div class="post-thumb">
                                        <a href="fundraiser_startup_details.php?ci_id=<?php echo $row['ci_id']; ?>&fundraiser_id=<?php echo $row['fundraiser_id'] ?>">
                                            <img src="cover_images/<?php echo $cover; ?>" alt="no-img" style="width: 370px; height: 300px;">
                                        </a>
                                    </div>

                                <?php endforeach; ?>

                            </div>
                            <style>
                                .post-thumb {
                                    width: 370px;
                                    height: 300px;
                                    overflow: hidden;
                                    position: relative;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                }

                                .post-thumb img {
                                    width: 100%;
                                    height: 100%;
                                    object-fit: cover;
                                    display: block;
                                }
                            </style>

                            <div class="post-content">
                                <div class="post-top">
                                    <h4 class="title"><a href="fundraiser_startup_details.php?ci_id=<?php echo $row['ci_id']; ?>&fundraiser_id=<?php echo $row['fundraiser_id'] ?>"><?php echo $row['product_name']; ?> - <?php echo $row['quick_pitch']; ?></a></h4>
                                    <div class="post-meta cate">
                                        <a href="#"><i class="far fa-calendar mr-1"></i><?php echo date('M d, Y', strtotime($row['created_at'])); ?></a>
                                        <a href="#"><i class="fas fa-map-marker-alt mr-1"></i><?php echo $row['address']; ?>, <?php echo $row['state']; ?>, <?php echo $row['country']; ?></a>
                                    </div>
                                    <p><?php echo $short_description; ?></p>
                                </div>
                                <div class="post-bottom">
                                    <a href="fundraiser_startup_details.php?ci_id=<?php echo $row['ci_id']; ?>&fundraiser_id=<?php echo $row['fundraiser_id'] ?>" class="read">See Details</a>
                                    <!--<a href="#" class="comments"><i class="fa-solid fa-users"></i> <span class="comment-number">2</span></a>-->
                                </div>
                            </div>
                        </div>
                    </div>
                <?php
                }
                ?>
            </div>

            <!-- Pagination -->
            <ul class="default-pagination">
                <?php if ($current_page > 1): ?>
                    <li>
                        <a href="?page=<?php echo $current_page - 1; ?>"><i class="fas fa-angle-left"></i></a>
                    </li>
                <?php endif; ?>

                <?php for ($i = 1; $i <= $total_pages; $i++): ?>
                    <li>
                        <a href="?page=<?php echo $i; ?>" class="<?php echo ($i === $current_page) ? 'active' : ''; ?>">
                            <?php echo str_pad($i, 2, '0', STR_PAD_LEFT); ?>
                        </a>
                    </li>
                <?php endfor; ?>

                <?php if ($current_page < $total_pages): ?>
                    <li>
                        <a href="?page=<?php echo $current_page + 1; ?>"><i class="fas fa-angle-right"></i></a>
                    </li>
                <?php endif; ?>
            </ul>


        </div>
    </div>
    <!-- ==========Blog Section Ends Here========== -->


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
                                            <iframe src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d14602.262337719116!2d90.42507338346269!3d23.79847904149197!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sMadani%20Avenue%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1726493123150!5m2!1sen!2sbd" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6">
                                    <div class="footer-widget widget-blog">
                                        <h5 class="title text-uppercase">our Recent Project</h5>
                                        <ul class="footer-blog">

                                            <?php
                                            $sql9 = "SELECT * FROM funding_donation ORDER BY created_at ASC LIMIT 2";
                                            $data9 = $conn->query($sql9);
                                            while ($row9 = mysqli_fetch_assoc($data9)) {
                                            ?>

                                                <li>
                                                    <div class="thumb">
                                                        <a href="funding_donation_details.php?cause_id=<?php echo $row9['cause_id']; ?>">
                                                            <img src="donation_images/<?php echo $row9['main_pictures']; ?>" alt="project">
                                                        </a>
                                                    </div>
                                                    <div class="content">
                                                        <a href="funding_donation_details.php?cause_id=<?php echo $row9['cause_id']; ?>">
                                                            <?php echo $row9['title']; ?></a>
                                                        <span><?php echo date('M d, Y', strtotime($row9['created_at'])); ?></span>
                                                    </div>
                                                </li>

                                            <?php
                                            }
                                            ?>

                                        </ul>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-6 pl-xl-4">
                                    <div class="footer-widget widgt-form">
                                        <h5 class="title text-uppercase">our NEWSLETTER</h5>
                                        <p>Empoer IT is a nonproﬁt organization supported by community leaders</p>
                                        <form class="footer-form" action="pages_contact.php">
                                            <input type="email" placeholder="Enter your email" name="email" hidden>
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
                    <script>
                        document.write(new Date().getFullYear())
                    </script>
                    © <a href="home.php">Empower IT</a> - Together, we rise.
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


    <!--Category search-->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!--<script>
        $(document).ready(function() {
            $('.widget-body ul li a').on('click', function(e) {
                e.preventDefault();
                var category = $(this).data('category');
                $.ajax({
                    url: 'funding_fetch_blog.php',
                    type: 'GET',
                    data: {
                        category: category
                    },
                    success: function(response) {
                        $('#showdata').html(response);
                    }
                });
            });
        });
    </script>-->

    <!--Fetch-->
    <script>
        $(document).ready(function() {
            // Event listener for category selection change
            $('#category-filter').on('change', function() {
                var category = $(this).val();
                $.ajax({
                    url: 'fundraiser_fetch.php', // Ensure the correct path
                    type: 'GET',
                    data: {
                        category: category
                    },
                    success: function(response) {
                        $('#showdata').html(response);
                    },
                    error: function(xhr, status, error) {
                        console.error('AJAX Error:', error); // Log errors
                        $('#showdata').html('<p>An error occurred while fetching data.</p>');
                    }
                });
            });
        });
    </script>



    <!--Search-->
    <script>
        $(document).ready(function() {
            $('#search_input').on("keyup", function() {
                var search_input = $(this).val();
                $.ajax({
                    method: 'POST',
                    url: 'fundraiser_search.php', // Correct the URL
                    data: {
                        title: search_input,
                        description: search_input
                    },
                    success: function(response) {
                        $("#showdata").html(response);
                    }
                });
            });
        });
    </script>




    <!-- Remove Wishlist -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.remove-cart').forEach(button => {
                button.addEventListener('click', function(event) {
                    event.preventDefault();
                    const userId = this.getAttribute('data-user-id');
                    const productId = this.getAttribute('data-product-id');

                    fetch(`shop_remove_wishlist.php?u_id=${userId}&p_id=${productId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === 'success') {
                                // Remove the product item
                                const item = this.closest('.single-product-item');
                                if (item) {
                                    item.remove();
                                }

                                // Optionally update the total price if needed
                                // updateTotalPrice(); // Uncomment if you have a function to update total price
                            } else {
                                console.error('Failed to remove product:', data.message);
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                        });
                });
            });
        });
    </script>
</body>

</html>