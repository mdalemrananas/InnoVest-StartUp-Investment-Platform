<?php
session_start();
//Jago

// Initialize $user_id variable
$user_id = "Null";

$servername = "localhost";
$username = "root";
$password = "";
$database_name = "empower_it";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $database_name);

// Check if user_id is set in $_SESSION
if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $email = $_SESSION["email"];
    $email = mysqli_real_escape_string($conn, $email);
}

// wishlist 
$sql2 = "SELECT * FROM ecommerce_product AS p INNER JOIN ecommerce_wishlist AS sc ON sc.product_id = p.product_id WHERE sc.user_id = $user_id";
$data2 = $conn->query($sql2);

if ($user_id == NULL) {
    $count_cart = 0;
} else {
    //Cart wishlist 
    $sql3 = "SELECT COUNT(id) AS count_cart FROM ecommerce_wishlist AS sc INNER JOIN ecommerce_product AS p ON p.product_id = sc.product_id WHERE sc.user_id = $user_id";
    $data3 = $conn->query($sql3);
    $row3 = mysqli_fetch_assoc($data3);
    $count_cart = $row3['count_cart'];
}

?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title>Empower IT - Home</title>

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

    <!-- Link Font Awesome stylesheet -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">


</head>

<body>


    <!--=======Preloader Overlay Starts Here========== -->
    <div class="overlayer">
        <div class="loader">
            <div class="loader-inner"></div>
        </div>
    </div>
    <div class="scrollToTop"><i class="fas fa-angle-up"></i></div>
    <div class="overlay"></div>
    <div class="overlayTwo"></div>
    <!--=======Preloader Overlay Ends Here========== -->

    <!--
    <button class="chatbot-toggler">
  <span class="material-symbols-rounded"><i class="fa-solid fa-message"></i></span>
  <span class="material-symbols-outlined"><i class="fa-solid fa-xmark"></i></span>
</button>
<div class="chatbot">
  <header>
    <h2>Chatbot</h2>
    <span class="close-btn material-symbols-outlined"><i class="fa-solid fa-xmark"></i></span>
  </header>
  <ul class="chatbox">
    <li class="chat incoming">
      <span class="material-symbols-outlined"><i class="fa-solid fa-robot"></i></span>
      <p>Hi there <br>How can I help you today?</p>
    </li>
  </ul>
  <div class="chat-input">
    <textarea placeholder="Enter a message..." spellcheck="false" required></textarea>
    <span id="send-btn" class="material-symbols-rounded"><i class="fa-solid fa-paper-plane"></i></span>
  </div>
</div>

<style>
/* Import Google font - Poppins */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

.chatbot-toggler {
  position: fixed;
  bottom: 30px;
  left: 35px; /* Changed from right to left */
  outline: none;
  border: none;
  height: 50px;
  width: 50px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #724ae8;
  transition: all 0.2s ease;
  z-index: 1000;
}

body.show-chatbot .chatbot-toggler {
  transform: rotate(90deg);
}

.chatbot-toggler span {
  color: #fff;
  font-size: 24px;
  transition: opacity 0.2s ease;
}

.chatbot-toggler span:last-child {
  opacity: 0;
}

body.show-chatbot .chatbot-toggler span:last-child {
  opacity: 1;
}

.chatbot {
  position: fixed;
  left: 35px; /* Changed from right to left */
  bottom: 90px;
  width: 420px;
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transform: scale(0.5);
  transform-origin: bottom left; /* Changed from bottom right to bottom left */
  box-shadow: 0 0 128px 0 rgba(0, 0, 0, 0.1),
              0 32px 64px -48px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease;
  z-index: 999;
}

body.show-chatbot .chatbot {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1);
}

.chatbot header {
  padding: 16px 0;
  position: relative;
  text-align: center;
  color: #fff;
  background: #724ae8;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.chatbot header .close-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  cursor: pointer;
  transform: translateY(-50%);
  font-size: 24px;
}

header h2 {
  font-size: 1.4rem;
  margin: 0;
}

.chatbot .chatbox {
  overflow-y: auto;
  height: 510px;
  padding: 30px 20px 100px;
  margin: 0;
}

.chatbot ::-webkit-scrollbar {
  width: 6px;
}

.chatbot ::-webkit-scrollbar-track {
  background: #fff;
  border-radius: 25px;
}

.chatbot ::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 25px;
}

.chatbox .chat {
  display: flex;
  list-style: none;
  margin: 20px 0;
}

.chatbox .outgoing {
  justify-content: flex-end;
}

.chatbox .incoming {
  align-items: flex-end;
}

.chatbox .incoming span {
  width: 32px;
  height: 32px;
  color: #fff;
  cursor: default;
  text-align: center;
  line-height: 32px;
  background: #724ae8;
  border-radius: 50%;
  margin: 0 10px 7px 0;
}

.chatbox .chat p {
  white-space: pre-wrap;
  padding: 12px 16px;
  border-radius: 10px 10px 0 10px;
  max-width: 75%;
  font-size: 0.95rem;
}

.chatbox .incoming p {
  color: #000;
  background: #f2f2f2;
  border-radius: 10px 10px 10px 0;
}

.chatbox .chat p.error {
  color: #721c24;
  background: #f8d7da;
}

.chatbot .chat-input {
  display: flex;
  gap: 5px;
  position: absolute;
  bottom: 0;
  width: 100%;
  background: #fff;
  padding: 3px 20px;
  border-top: 1px solid #ddd;
}

.chat-input textarea {
  height: 55px;
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  max-height: 180px;
  padding: 15px 15px 15px 0;
  font-size: 0.95rem;
  font-family: 'Poppins', sans-serif;
}

.chat-input span {
  align-self: center;
  color: #724ae8;
  cursor: pointer;
  height: 55px;
  display: flex;
  align-items: center;
  font-size: 1.35rem;
  visibility: hidden;
}

.chat-input textarea:valid ~ #send-btn {
  visibility: visible;
}

@media (max-width: 490px) {
  .chatbot-toggler {
    left: 20px; /* Adjusted for left positioning */
    bottom: 20px;
  }

  .chatbot {
    left: 0; /* Adjusted for left positioning */
    bottom: 0;
    height: 100%;
    border-radius: 0;
    width: 100%;
  }

  .chatbot .chatbox {
    height: 90%;
    padding: 25px 15px 100px;
  }

  .chatbot .chat-input {
    padding: 5px 15px;
  }

  .chatbot header .close-btn {
    display: block;
  }
}
</style>
-->
    <!--=======Header Section Starts Here========== -->
    <header class="header-1">
        <div class="header-top">
            <div class="container">
                <div class="row justify-content-center align-items-center">
                    <div class="col-lg-3 col-12">
                        <div class="logo py-2">
                            <a href="home.php"><img src="assets/images/logo/Empower-IT Logo1.png" alt="logo"></a>
                        </div>
                    </div>
                    <div class="col-lg-9 col-12">

                        <div class="ht-left">
                            <ul class="lab-ul d-flex flex-wrap justify-content-end">
                                <!--<li class="d-flex flex-wrap align-items-center mr-3">
                                    <!-- Start a Campaign Button --
                                    <a href="#" class="campaign-button">
                                        <i class="fa-solid fa-plus"></i> Start a Campaign
                                    </a>
                                </li>
                                <li class="d-flex flex-wrap align-items-center">
                                    <!-- Sign Up / Sign In Button --
                                    <div class="signup-signin">
                                        <a href="signup-user.php" class="signup-button">Sign Up</a>
                                        <span class="separator">or</span>
                                        <a href="login-user.php" class="signin-button">Sign In</a>
                                    </div>
                                </li>
                                <!--<li class="d-flex flex-wrap align-items-center mr-3">
                                    <!-- Start a Campaign Button --
                                    <!--<a href="#" class="campaign-button"><i class="fa-solid fa-id-card fa-xl"></i> Profile</a>--
                                    <a href="check_user_type.php"><img src="profile_pictures/profile.png" style="width: 50px;"></a>
                                </li>-->


                                <?php
                                $sql8 = "SELECT * FROM ecommerce_user"; // Correct the query to fetch users
                                $data8 = $conn->query($sql8);

                                while ($row8 = mysqli_fetch_assoc($data8)) {
                                    // Check if the user_id matches the user's user_id
                                    if ($row8['user_id'] == $user_id) {
                                ?>
                                        <li class="d-flex flex-wrap align-items-center mr-3">
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
                                        <!-- Sign Up / Sign In Button -->
                                        <div class="signup-signin">
                                            <a href="signup-user.php" class="signup-button">Sign Up</a>
                                            <span class="separator">or</span>
                                            <a href="login-user.php" class="signin-button">Sign In</a>
                                        </div>
                                    </li>
                                    <li class="d-flex flex-wrap align-items-center mr-3">
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

                            .mr-3 {
                                margin-right: 1rem;
                            }

                            /* Button Styles */
                            .campaign-button {
                                background-color: #4a7a72;
                                /* Dark green */
                                color: white;
                                font-weight: bold;
                                padding: 10px;
                                border-radius: 5px;
                                /* Square corners */
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
                                /* Darker green on hover */
                            }

                            .signup-signin {
                                display: flex;
                                align-items: center;
                            }

                            .signup-button,
                            .signin-button {
                                padding: 10px;
                                font-weight: bold;
                                color: white;
                                text-decoration: none;
                                font-size: 14px;
                                border-radius: 5px;
                                /* Square corners */
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }

                            .signup-button {
                                background-color: #f9c923;
                                /* Yellow */
                            }

                            .signin-button {
                                background-color: #4a7a72;
                                /* Dark green */
                            }

                            .signup-button:hover {
                                background-color: #e5b71d;
                                /* Darker yellow on hover */
                            }

                            .signin-button:hover {
                                background-color: #386259;
                                /* Darker green on hover */
                            }

                            .separator {
                                background-color: white;
                                color: black;
                                /* To ensure the separator text is visible */
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
                            }

                            .ht-left ul li {
                                margin-right: 10px;
                            }
                        </style>



                    </div>
                </div>
            </div>
        </div>
        <div class="header-bottom">
            <div class="container">
                <div class="header-wrapper">
                    <div class="menu-area justify-content-between w-100">
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
                            <!--<li><a href="contact.php">Contact</a></li>-->
                        </ul>

                        <div class="header-bar d-lg-none">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div class="d-none d-sm-block">
                            <div class="search-cart d-flex align-items-center flex-wrap">
                                <div class="search-button">
                                    <form action="/">
                                        <input type="text" name="search" id="search" placeholder="Enter your search">
                                        <button type="submit"><i class="fas fa-search"></i></button>
                                    </form>
                                </div>
                                <div class="cart-button">
                                    <a href="#">
                                        <span class="cart-amount"><?php echo $count_cart; ?></span>
                                        <i class="fas fa-shopping-basket"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="ellepsis-bar d-lg-none">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <!--=======Header Section Ends Here========== -->

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
    <!-- ===========Header Cart end=========== -->

    <!--=======Banner Section Starts Here========== -->
    <section class="banner-section oh bg_img" data-background="assets/images/banner/banner.jpg">
        <div class="top-shape-content d-none d-xl-block">
            <img src="assets/images/banner/shape.png" alt="banner" class="bs-item" data-value="-3">
        </div>
        <div class="container">
            <div class="d-flex justify-content-between flex-row-reverse">
                <div class="banner-thumb">
                    <img src="assets/images/banner/01.png" alt="banner" class="bs-item" data-value="-5">
                </div>
                <div class="banner-content style-2">
                    <h3 class="cate">Donate [&] Helps</h3>
                    <h1 class="title">Give <span class="theme-two">Helping</span> Hand For <span class="theme-two">Poor People.</span></h1>
                    <p>Your donation helps us provide vital resources and support.
                        We use the latest equipment and have a caring team available 24/7 to assist those in need.
                    </p>
                    <a href="funding_event.php" class="custom-button"><span>Donate Now<i class="fas fa-heart ml-2"></i></span></a>
                </div>
            </div>
        </div>

        <!--<div class="post-item post-classic">
            <div class="pos-rel oh">
                <div class="post-slider">
                    <div class="post-thumb">
                        <a href="blog-single.html"><img src="assets/images/blog/blog13.jpg" alt="blog"></a>
                    </div>
                    <div class="post-thumb">
                        <a href="blog-single.html"><img src="assets/images/blog/blog12.jpg" alt="blog"></a>
                    </div>
                    <div class="post-thumb">
                        <a href="blog-single.html"><img src="assets/images/blog/blog11.jpg" alt="blog"></a>
                    </div>
                </div>
                <span class="post-prev"><i class="fas fa-angle-left"></i></span>
                <span class="post-next"><i class="fas fa-angle-right"></i></span>
            </div>
        </div>-->

    </section>
    <!--=======Banner Section Ends Here========== -->


    <!--=======Feature Section Start Here========== -->
    <div class="feature-section style-2 padding-bottom padding-top pos-rel">
        <div class="bg-shape d-none d-lg-block">
            <img src="assets/images/feature/bg.jpg" alt="bg-shape">
        </div>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-4">
                    <div class="section-header style-2 text-left">
                        <div class="sh-top">
                            <h6 class="cate">WHO WE ARE</h6>
                            <h3 class="title text-uppercase">We’ve Funded More Then 44,000+ Projects</h3>
                        </div>
                        <div class="sh-bottom">
                            <p>
                                At Empower IT, we’re all about making a difference.
                                We work with partners and communities to fund projects that create positive change and improve lives.
                                Together, we’re building a better, more caring world.
                            </p>
                            <a href="funding_donation.php" class="custom-button mt-2"><span>Donate Now<i
                                        class="fas fa-heart ml-2"></i></span></a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-8 pl-xl-70">
                    <div class="row justify-content-center mb-30-none -mx-10">
                        <div class="col-sm-6 col-12">
                            <div class="feature-item style-2">
                                <div class="feature-inner">
                                    <div class="feature-content">
                                        <div class="feture-icon mb-4">
                                            <img src="assets/images/feature/01.png" alt="">
                                        </div>
                                        <span class="cate" style="color: #ffc600;">Healty Food</span>
                                        <h4 class="title">Food For Poor People</h4>
                                        <p>
                                            We ensure access to nutritious food for everyone.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="feature-item style-2">
                                <div class="feature-inner">
                                    <div class="feature-content">
                                        <div class="feture-icon mb-4">
                                            <img src="assets/images/feature/02.png" alt="">
                                        </div>
                                        <span class="cate">Medical Care</span>
                                        <h4 class="title">Facilities For People</h4>
                                        <p>
                                            Providing medical facilities for poor people.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="feature-item style-2">
                                <div class="feature-inner">
                                    <div class="feature-content">
                                        <div class="feture-icon mb-4">
                                            <img src="assets/images/feature/shelter.png" alt="">
                                        </div>
                                        <span class="cate">Shelter and Home</span>
                                        <h4 class="title">Shelter For Poor People</h4>
                                        <p>
                                            Providing safe, supportive housing for those in need.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-12">
                            <div class="feature-item style-2">
                                <div class="feature-inner">
                                    <div class="feature-content">
                                        <div class="feture-icon mb-4">
                                            <img src="assets/images/feature/04.png" alt="">
                                        </div>
                                        <span class="cate">donate and help</span>
                                        <h4 class="title">Education For All Children</h4>
                                        <p>
                                            Providing essential educational resources and support.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--=========Feature Section Ends Here========== -->


    <!--=========Helps Section Ends Here========== -->
    <div class="helps-section">
        <div class="container-fluid p-lg-0">
            <div class="row no-gutters">
                <div class="col-xl-6 col-12">
                    <div class="helps-left-part">
                        <div class="row justify-content-xl-end justify-content-center no-gutters">
                            <div class="col-lg-6 col-sm-6 col-12">
                                <div class="helps-item">
                                    <div class="helps-inner">
                                        <div class="helps-content">
                                            <div class="helps-icon mb-4">
                                                <img src="assets/images/helps/01.png" alt="">
                                            </div>
                                            <h3>50 <sup>+</sup></h3>
                                            <h4 class="title">Our Total Volunteers</h4>
                                            <p>
                                            Over 50 volunteers worked with us, showing tremendous dedication and effort. Their commitment made a significant impact!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 col-sm-6 col-12">
                                <div class="helps-item">
                                    <div class="helps-inner">
                                        <div class="helps-content">
                                            <div class="helps-icon mb-4">
                                                <img src="assets/images/helps/02.png" alt="">
                                            </div>
                                            <h3>৳30,000 <sup>+</sup></h3>
                                            <h4 class="title">Our Total Raised Tk</h4>
                                            <p>
                                                
                                    Even being a new platform, people have already started donating! It’s exciting to see such early support and enthusiasm!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-6 col-12">
                    <div class="helps-right-part wow fadeInUp" data-wow-duration="1s" data-wow-delay=".1s">
                        <div class="video-area">
                            <img src="assets/images/helps/01.jpg" alt="helps">
                            <a href="https://youtu.be/nN1KjXsZSrU?si=JE3_KTRL_5QmCQP5" class="video-button popup"><i class="fa-solid fa-play"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--=======Helps Section Ends Here========== -->

    <!--=======Causes Section Starts Here========== -->
    <div class="causes-section style-2 padding-top padding-bottom">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12">
                    <div class="section-header text-left">
                        <span class="cate">WE HELP ACROSS BANGLADESH</span>
                        <h3 class="title text-uppercase">Introduse Our Projects</h3>
                        <span class="causes-nav causes-prev"><i class="fas fa-arrow-left"></i></span>
                        <span class="causes-nav causes-next active"><i class="fas fa-arrow-right"></i></span>
                    </div>
                </div>
            </div>
            <div class="causes-slider">

                <?php
                $sql6 = "SELECT * FROM funding_donation ORDER BY created_at ASC LIMIT 10";
                $data6 = $conn->query($sql6);
                while ($row6 = mysqli_fetch_assoc($data6)) {
                    // Calculate the percentage raised
                    $raised_amount = $row6['raised_amount'];
                    $goal_amount = $row6['goal_amount'];
                    $percentage = 0;

                    if ($goal_amount > 0) {
                        $percentage = ($raised_amount / $goal_amount) * 100;
                    }
                ?>
                    <div class="causes-item">
                        <div class="causes-inner">
                            <div class="causes-thumb">
                                <img src="assets/images/causes/01.jpg" alt="causes">
                                <div class="causes-progress">
                                    <div class="d-flex flex-wrap justify-content-between align-items-center">
                                        <div class="causes-pro-left text-center">
                                            <h6>Raised</h6>
                                            <h6><span>৳<?php echo $raised_amount; ?></span></h6>
                                        </div>
                                        <div class="causes-pro-mid">
                                            <div class="text-center skill-item">
                                                <div class="pie"
                                                    data-pie='{ "index": <?php echo $row6['cause_id']; ?>, "round": true, "percent": <?php echo round($percentage, 2); ?>, "colorSlice": "#EE463B", "size": 60, "fontWeight": 700 }'>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="causes-pro-right text-center">
                                            <h6>Goal</h6>
                                            <h6><span>$<?php echo $goal_amount; ?></span></h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="causes-content bg-white">
                                <a href="#" class="causes-catagiry mb-2 text-uppercase"><?php echo $row6['category']; ?> Distribution</a>
                                <h4 class="title mb-3"><a href="funding_donation_details.php?cause_id=<?php echo $row6['cause_id']; ?>"><?php echo $row6['title']; ?></a></h4>
                                <!--<p>
                    ProfesSona leverage existing error free exper
                    iences from high quality supply chains create
                    Energistically monetize virtual human.
                </p>-->
                                <a href="funding_donation_details.php?cause_id=<?php echo $row6['cause_id']; ?>" class="custom-button mt-2"><span>Donate Now<i class="fas fa-heart ml-2"></i></span></a>
                            </div>
                        </div>
                    </div>

                <?php
                }
                ?>


            </div>
        </div>
    </div>
    <!--=======Causes Section Ends Here========== -->

    <!--=======Clients Section Start Here========== -->
    <div class="clients-section style-2 padding-bottom padding-top bg_img mt-0"
        data-background="assets/images/client/client-bg2.jpg">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-4">
                    <div class="section-header style-2 text-left">
                        <div class="sh-top">
                            <span class="cate">our TESTIMONIALS</span>
                            <h3 class="title text-uppercase">What People Say About Our organization</h3>
                        </div>
                    </div>
                </div>
                <div class="col-lg-8">
                    <div class="mb-30-none -mx-10">
                        <div class="clients-slider2">


                            <div class="clients-item style-2">
                                <div class="clients-inner">
                                    <div class="clients-review">
                                        <div class="cr-top">
                                            <div class="crt-head">
                                                <div class="crth-left"><img src="assets/images/client/icon.png"
                                                        alt="client icon"></div>
                                            </div>
                                            <div class="crt-body">
                                                <h4 class="title">
                                                    Empower It is making a powerful difference by providing essential resources, education, and startup funding, truly uplifting communities in need.
                                                </h4>
                                            </div>
                                        </div>
                                        <div class="cr-bottom">
                                            <div class="client-thumb">
                                                <img src="assets/images/client/01.jpg" alt="clients">
                                            </div>
                                            <div class="client-info">
                                                <h4 class="title">Michael Smeth</h4>
                                                <span>Professor</span>
                                                <span class="rating">(
                                                    <i class="fas fa-star"></i>
                                                    <i class="fas fa-star"></i>
                                                    <i class="fas fa-star"></i>
                                                    <i class="fas fa-star"></i>
                                                    <i class="fas fa-star"></i>
                                                    )</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="clients-item style-2">
                                <div class="clients-inner">
                                    <div class="clients-review">
                                        <div class="cr-top">
                                            <div class="crt-head">
                                                <div class="crth-left"><img src="assets/images/client/icon.png"
                                                        alt="client icon"></div>
                                            </div>
                                            <div class="crt-body">
                                                <h4 class="title">
                                                    Their dedication to empowering individuals through donations and support is inspiring, creating lasting change where it's needed most.
                                                </h4>
                                            </div>
                                        </div>
                                        <div class="cr-bottom">
                                            <div class="client-thumb">
                                                <img src="assets/images/client/02.jpg" alt="clients">
                                            </div>
                                            <div class="client-info">
                                                <h4 class="title">John Harvard</h4>
                                                <span>Engineer</span>
                                                <span class="rating">(
                                                    <i class="fas fa-star"></i>
                                                    <i class="fas fa-star"></i>
                                                    <i class="fas fa-star"></i>
                                                    <i class="fas fa-star"></i>
                                                    <i class="fas fa-star"></i>
                                                    )</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--=======Clients Section Ends Here========== -->


    <!--=======Project Section Starts Here========== -->
    <div class="project-section style-2">
        <div class="container">
            <div class="row justify-content-center no-gutters">

                <?php
                $sql7 = "SELECT * FROM funding_blog ORDER BY created_at ASC LIMIT 4";
                $data7 = $conn->query($sql7);
                while ($row7 = mysqli_fetch_assoc($data7)) {
                ?>

                    <div class="col-xl-3 col-sm-6 col-12">
                        <div class="project-item style-2">
                            <div class="project-inner mb-0">
                                <div class="project-thumb">
                                    <img src="blog_images/<?php echo $row7['main_pictures']; ?>" alt="blog" style="width: 440px; height: auto;">
                                </div>
                                <div class="project-content">
                                    <a href="#">
                                        <h4 class="title"><?php echo $row7['title']; ?></h4>
                                    </a>
                                    <a href="funding_blog_details.php?blog_id=<?php echo $row7['blog_id']; ?>" class="text-btn">read more +</a>
                                </div>
                            </div>
                        </div>
                    </div>

                <?php
                }
                ?>

            </div>
        </div>
    </div>
    <!--=======Project Section Ends Here========== -->

    <!--=======Faqs Section Starts Here========== -->
    <section class="faqs-single-section pos-rel">
        <div class="abs-clients-thumb">
            <img src="assets/images/bg/bg-shape2.png" alt="abs-clients-thumb">
        </div>
        <div class="container">
            <div class="row align-items-center flex-row-reverse">
                <div class="col-xl-6">
                    <div class="section-header text-left"><br>
                        
                        <h3 class="title text-uppercase">Why you Need us</h3>
                    </div>
                    <div class="faq-wrapper">
                        <div class="faq-item active">
                            <div class="faq-title">
                                <!--<span class="right-icon"></span>-->
                                <h5 class="title">We Help Nonprofits Become More Effective</h5>
                            </div>
                            <div class="faq-content">
                                <p>We empower nonprofits to become more effective in their missions. Through our resources and support, we help them maximize their impact and achieve their goals!
                                </p>
                            </div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-title">
                                <span class="right-icon"></span>
                                <h5 class="title">We connect startups with funding opportunities</h5>
                            </div>
                            <div class="faq-content">
                                <p>We create opportunities for startups seeking funding by connecting them with potential investors and providing resources to help them grow. Our platform supports innovation and entrepreneurship, giving emerging businesses the boost they need to succeed!
                                </p>
                            </div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-title">
                                <span class="right-icon"></span>
                                <h5 class="title">Donor Satisfaction is Guaranteed</h5>
                            </div>
                            <div class="faq-content">
                                <p>We provide a seamless way for individuals to contribute to those in need, ensuring that donations reach the poorest members of our community. Every contribution helps improve lives and support vital programs.
                                </p>
                            </div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-title">
                                <span class="right-icon"></span>
                                <h5 class="title">Explore our unique products from Shop</h5>
                            </div>
                            <div class="faq-content">
                                <p>Discover our shop, where you can explore a curated selection of unique products from various regions. Each item showcases local craftsmanship and culture, offering something special for every taste. By shopping with us, you support artisans and small businesses while finding one-of-a-kind treasures!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-6">
                    <div class="faq-thumb wow fadeInUp" data-wow-duration="1s" data-wow-delay=".1s">
                        <div class="faq-abs-thumb">
                            <img src="" >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!--=======Faqs Section Ends Here========== -->


    <!--=======Counter Section Starts Here========== -->
    <div class="counter-section padding-top padding-bottom bg_img"
        data-background="assets/images/counter/counter-bg.jpg">
        <div class="container">
            <div class="row justify-content-center mb-30-none">
                <div class="col-xl-3 col-md-6 col-sm-6">
                    <div class="counter-item">
                        <div class="counter-thumb pos-rel">
                            <div class="count-bg-shap">
                                <img src="assets/images/counter/shape/01.png" alt="counter">
                            </div>
                            <img src="assets/images/counter/01.png" alt="counter">
                        </div>
                        <div class="counter-content">
                            <div class="counter-header">
                                <h2 class="title odometer" data-odometer-final="50">0</h2>
                                <h2 class="title">+</h2>
                            </div>
                            <span class="cate">Total Our Volunteer</span>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6 col-sm-6">
                    <div class="counter-item">
                        <div class="counter-thumb pos-rel">
                            <div class="count-bg-shap">
                                <img src="assets/images/counter/shape/02.png" alt="counter">
                            </div>
                            <img src="assets/images/counter/02.png" alt="counter">
                        </div>
                        <div class="counter-content">
                            <div class="counter-header">
                                <h2 class="title odometer" data-odometer-final="2300">0</h2>
                                <h2 class="title">+</h2>
                            </div>
                            <span class="cate">Total Happy People</span>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6 col-sm-6">
                    <div class="counter-item">
                        <div class="counter-thumb pos-rel">
                            <div class="count-bg-shap">
                                <img src="assets/images/counter/shape/03.png" alt="counter">
                            </div>
                            <img src="assets/images/counter/03.png" alt="counter">
                        </div>
                        <div class="counter-content">
                            <div class="counter-header">
                                <h2 class="title odometer" data-odometer-final="100">0</h2>
                                <h2 class="title">K+</h2>
                            </div>
                            <span class="cate">Our Total Donated</span>
                        </div>
                    </div>
                </div>
                <div class="col-xl-3 col-md-6 col-sm-6">
                    <div class="counter-item">
                        <div class="counter-thumb pos-rel">
                            <div class="count-bg-shap">
                                <img src="assets/images/counter/shape/04.png" alt="counter">
                            </div>
                            <img src="assets/images/counter/04.png" alt="counter">
                        </div>
                        <div class="counter-content">
                            <div class="counter-header">
                                <h2 class="title odometer" data-odometer-final="550">0</h2>
                                <h2 class="title">+</h2>
                            </div>
                            <span class="cate">Our Products & Gifts</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--=======Counter Section Ends Here========== -->

    <!--=======Clients Section Ends Here========== -->
    <div class="clients-section volunteer padding-top padding-bottom mt-0 pos-rel">
        <div class="abs-clients-thumb">
            <img src="assets/images/bg/bg-shape2.png" alt="abs-clients-thumb">
        </div>
        <div class="container">
            <div class="section-wrapper">
                <div class="clents-left">
                    <div class="cl-content-area">
                        <div class="cl-content">
                            <!--<h6 class="cate">Meet The Specialist Team</h6>-->
                            <h3 class="title">Our Crowdfunding</h3>
                            <p>Crowdfunding raises money by collecting donations from family, friends, businesses, and strangers. It leverages social media to reach more potential donors than traditional fundraising methods.</p>
                            <a href="fundraiser_startup.php" class="custom-button mt-2"><span>View More <i
                                        class="fas fa-heart ml-2"></i></span></a>
                        </div>
                    </div>
                </div>
                <div class="clents-right">
                    <div class="cr-head">
                        <span class="clients-prev active"><i class="fas fa-arrow-left"></i></span>
                        <span class="clients-next"><i class="fas fa-arrow-right"></i></span>
                    </div>
                    <div class="cr-body mb-15-none">
                        <div class="clients-slider">

                            <?php
                            // Database connection details
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

                            // Query to get the first 5 products
                            $sql9 = "SELECT * FROM fundraising_company_product WHERE request_status = 'Accept' ORDER BY created_at ASC LIMIT 5";
                            $data9 = $conn->query($sql9);

                            // Check if the query returns any rows
                            if ($data9 && $data9->num_rows > 0) {
                                while ($row9 = mysqli_fetch_assoc($data9)) {
                            ?>

                                    <div class="post-item p-3">
                                        <div class="post-thumb">
                                            

                                            <?php
                                            foreach (json_decode($row9["cover_pictures"]) as $cover) : ?>
                                                <div class="post-thumb">
                                                    <a href="fundraiser_startup_details.php?ci_id=<?php echo htmlspecialchars($row9['ci_id']); ?>&fundraiser_id=<?php echo $row9['fundraiser_id'] ?>">
                                                        <img src="cover_images/<?php echo $cover; ?>" alt="blog">
                                                    </a>
                                                </div>

                                            <?php endforeach; ?>

                                        </div>
                                        <div class="post-content">
                                            <div class="post-top">
                                                <h4 class="title mb-0">
                                                    <a href="fundraiser_startup_details.php?ci_id=<?php echo htmlspecialchars($row9['ci_id']); ?>&fundraiser_id=<?php echo $row9['fundraiser_id'] ?>">
                                                        <?php echo htmlspecialchars($row9['product_name']); ?> | <?php echo $row9['quick_pitch'];?>
                                                    </a>
                                                </h4>
                                                <span class="post-by d-inline-block mb-3"><?php echo date('M d, Y', strtotime($row9['created_at'])); ?></span>

                                            </div>
                                            <div class="post-bottom">
                                                <a href="fundraiser_startup_details.php?ci_id=<?php echo htmlspecialchars($row9['ci_id']); ?>&fundraiser_id=<?php echo $row9['fundraiser_id'] ?>" class="read">Read More</a>
                                            </div>
                                        </div>
                                    </div>

                            <?php
                                }
                            } else {
                                // Message if no products found
                                echo "<p>No products/company found.</p>";
                            }

                            // Close the connection
                            mysqli_close($conn);
                            ?>



                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--=======Clients Section Ends Here========== -->

    <!--=======Sponsor Section Ends Here========== -->
    <div class="sponsor-section padding-top padding-bottom bg_img" data-background="assets/images/sponsor/bg.jpg">
        <div class="container">
            <div class="section-wrapper">
                <div class="sponsor-slider">
                    <div class="sponsor-thumb">
                        <img src="assets/images/sponsor/01.png" alt="sponsor">
                    </div>
                    <div class="sponsor-thumb">
                        <img src="assets/images/sponsor/02.png" alt="sponsor">
                    </div>
                    <div class="sponsor-thumb">
                        <img src="assets/images/sponsor/03.png" alt="sponsor">
                    </div>
                    <div class="sponsor-thumb">
                        <img src="assets/images/sponsor/04.png" alt="sponsor">
                    </div>
                    <div class="sponsor-thumb">
                        <img src="assets/images/sponsor/05.png" alt="sponsor">
                    </div>
                    <div class="sponsor-thumb">
                        <img src="assets/images/sponsor/06.png" alt="sponsor">
                    </div>
                    <div class="sponsor-thumb">
                        <img src="assets/images/sponsor/01.png" alt="sponsor">
                    </div>
                    <div class="sponsor-thumb">
                        <img src="assets/images/sponsor/02.png" alt="sponsor">
                    </div>
                    <div class="sponsor-thumb">
                        <img src="assets/images/sponsor/03.png" alt="sponsor">
                    </div>
                    <div class="sponsor-thumb">
                        <img src="assets/images/sponsor/04.png" alt="sponsor">
                    </div>
                    <div class="sponsor-thumb">
                        <img src="assets/images/sponsor/05.png" alt="sponsor">
                    </div>
                    <div class="sponsor-thumb">
                        <img src="assets/images/sponsor/06.png" alt="sponsor">
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!--=======Sponsor Section Ends Here

    <!-- ==========Clients Section Ends Here========== -->
    <div class="clients-section blog padding-bottom">
        <div class="container">
            <div class="section-wrapper">
                <div class="clents-left pos-rel">
                    <div class="abs-clients-thumb">
                        <img src="assets/images/client/client-bg3.jpg" alt="client thumb">
                    </div>
                    <div class="cl-content-area">
                        <div class="cl-content">
                            <h6 class="cate">WHAT`S NEW</h6>
                            <h3 class="title text-uppercase mb-xl-5">Read Our Latest News And Blog Post</h3>
                            <a href="funding_blog.php" class="custom-button mt-2"><span>SEE ALL NEWS <i class="fas fa-heart ml-2"></i></span></a>
                        </div>
                    </div>
                </div>
                <div class="clents-right">
                    <div class="cr-head">
                        <p>We offer security solutions and cost effective service for our client are safe and secure in any situation.</p>
                        <span class="clients-prev active"><i class="fas fa-arrow-left"></i></span>
                        <span class="clients-next"><i class="fas fa-arrow-right"></i></span>
                    </div>
                    <div class="cr-body">
                        <div class="clients-slider">

                            <?php
                            $servername = "localhost";
                            $username = "root";
                            $password = "";
                            $database_name = "empower_it";

                            $conn = mysqli_connect($servername, $username, $password, $database_name);

                            $sql4 = "SELECT * FROM funding_blog ORDER BY created_at ASC LIMIT 5";
                            $data4 = $conn->query($sql4);
                            while ($row4 = mysqli_fetch_assoc($data4)) {
                            ?>

                                <div class="post-item p-3">
                                    <div class="post-thumb">
                                        <a href="funding_blog_details.php?blog_id=<?php echo $row4['blog_id']; ?>"><img src="blog_images/<?php echo $row4['main_pictures']; ?>" alt="blog"></a>
                                    </div>
                                    <div class="post-content">
                                        <div class="post-top">
                                            <span class="post-by d-inline-block mb-3">By Admin <?php echo date('M d, Y', strtotime($row4['created_at'])); ?></span>
                                            <h4 class="title mb-0"><a href="funding_blog_details.php?blog_id=<?php echo $row4['blog_id']; ?>"><?php echo $row4['title']; ?></a></h4>
                                        </div>
                                        <div class="post-bottom">
                                            <a href="funding_blog_details.php?blog_id=<?php echo $row4['blog_id']; ?>" class="read">Read More</a>
                                            <!--<a href="#" class="comments"><i class="far fa-comments"></i> <span class="comment-number">25 Comments</span></a>-->
                                        </div>
                                    </div>
                                </div>

                            <?php
                            }
                            ?>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- ==========Clients Section Ends Here========== -->


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
                                            $sql5 = "SELECT * FROM funding_donation ORDER BY created_at ASC LIMIT 2";
                                            $data5 = $conn->query($sql5);
                                            while ($row5 = mysqli_fetch_assoc($data5)) {
                                            ?>

                                                <li>
                                                    <div class="thumb">
                                                        <a href="funding_donation_details.php?cause_id=<?php echo $row5['cause_id']; ?>">
                                                            <img src="donation_images/<?php echo $row5['main_pictures']; ?>" alt="project">
                                                        </a>
                                                    </div>
                                                    <div class="content">
                                                        <a href="funding_donation_details.php?cause_id=<?php echo $row5['cause_id']; ?>">
                                                            <?php echo $row5['title']; ?></a>
                                                        <span><?php echo date('M d, Y', strtotime($row5['created_at'])); ?></span>
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
    <script src="assets/js/isotope.pkgd.min.js"></script>
    <script src="assets/js/magnific-popup.min.js"></script>
    <script src="assets/js/wow.min.js"></script>
    <script src="assets/js/viewport.jquery.js"></script>
    <script src="assets/js/odometer.min.js"></script>
    <script src="assets/js/nice-select.js"></script>
    <script src="assets/js/slick.min.js"></script>
    <script src="assets/js/circularProgressBar.min.js"></script>
    <script src="assets/js/main.js"></script>

    <!-- Chatbot -->
    <script>
        const chatbotToggler = document.querySelector(".chatbot-toggler");
        const closeBtn = document.querySelector(".close-btn");
        const chatbox = document.querySelector(".chatbox");
        const chatInput = document.querySelector(".chat-input textarea");
        const sendChatBtn = document.querySelector(".chat-input span");

        let userMessage = null; // Variable to store user's message
        const inputInitHeight = chatInput.scrollHeight;

        // API configuration
        const API_KEY = "AIzaSyCHemloEql53Lwi85GYS7-YOVRQwAomqOw"; // Your API key here
        const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

        const createChatLi = (message, className) => {
            // Create a chat <li> element with passed message and className
            const chatLi = document.createElement("li");
            chatLi.classList.add("chat", `${className}`);
            let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
            chatLi.innerHTML = chatContent;
            chatLi.querySelector("p").textContent = message;
            return chatLi; // return chat <li> element
        }

        const generateResponse = async (chatElement) => {
            const messageElement = chatElement.querySelector("p");

            // Define the properties and message for the API request
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [{
                            text: userMessage
                        }]
                    }]
                }),
            }

            // Send POST request to API, get response and set the reponse as paragraph text
            try {
                const response = await fetch(API_URL, requestOptions);
                const data = await response.json();
                if (!response.ok) throw new Error(data.error.message);

                // Get the API response text and update the message element
                messageElement.textContent = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
            } catch (error) {
                // Handle error
                messageElement.classList.add("error");
                messageElement.textContent = error.message;
            } finally {
                chatbox.scrollTo(0, chatbox.scrollHeight);
            }
        }

        const handleChat = () => {
            userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
            if (!userMessage) return;

            // Clear the input textarea and set its height to default
            chatInput.value = "";
            chatInput.style.height = `${inputInitHeight}px`;

            // Append the user's message to the chatbox
            chatbox.appendChild(createChatLi(userMessage, "outgoing"));
            chatbox.scrollTo(0, chatbox.scrollHeight);

            setTimeout(() => {
                // Display "Thinking..." message while waiting for the response
                const incomingChatLi = createChatLi("...", "incoming");
                chatbox.appendChild(incomingChatLi);
                chatbox.scrollTo(0, chatbox.scrollHeight);
                generateResponse(incomingChatLi);
            }, 600);
        }

        chatInput.addEventListener("input", () => {
            // Adjust the height of the input textarea based on its content
            chatInput.style.height = `${inputInitHeight}px`;
            chatInput.style.height = `${chatInput.scrollHeight}px`;
        });

        chatInput.addEventListener("keydown", (e) => {
            // If Enter key is pressed without Shift key and the window 
            // width is greater than 800px, handle the chat
            if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
                e.preventDefault();
                handleChat();
            }
        });

        sendChatBtn.addEventListener("click", handleChat);
        closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
        chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
    </script>


    <script type="importmap">
        {
    "imports": {
      "@google/generative-ai": "https://esm.run/@google/generative-ai"
    }
  }
</script>
</body>

</html>