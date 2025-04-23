<?php
session_start();
//Unknown

// Initialize $user_id variable
$user_id = NULL;

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
if (isset($_SESSION['email']) || isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];
    $email = $_SESSION["email"];
    $email = mysqli_real_escape_string($conn, $email);
}

// Always sanitize user inputs
$ci_id = isset($_GET['ci_id']) ? (int)$_GET['ci_id'] : 0;
$fundraiser_id = isset($_GET['fundraiser_id']) ? (int)$_GET['fundraiser_id'] : 0;

// If $ci_id is invalid, handle the error
if ($ci_id <= 0) {
    die("Invalid company ID.");
}

// Main query to get company product details
$query = "SELECT 
fcp.fundraiser_id as fundraiser_id,
fcp.product_name as product_name,
fcp.quick_pitch as quick_pitch,
fcp.cover_pictures as cover_pictures,
fpp.p_slide_image as fpp_slide,
fpp.p_subject as fpp_subject,
fbp.b_slide_image as fbp_slide,
fbp.b_subject as fbp_subject,
fbp.visibility as request_status,
fs.raise_amount,
fs.funding_committed_offline,
fs.pre_money_valuation,
fs.previous_investments,
fs.valuation_cap_amount,
fs.convertible_note_discount
FROM
        fundraising_company_product fcp
        INNER JOIN fundraising_setup fs ON fcp.ci_id = fs.ci_id
        INNER JOIN fundraising_public_profile fpp ON fcp.ci_id = fpp.ci_id
        INNER JOIN fundraising_bussiness_plan fbp ON fcp.ci_id = fbp.ci_id
        WHERE fcp.ci_id = $ci_id";

// Execute the query and check for errors
$data3 = mysqli_query($conn, $query);

if (!$data3) {
    die("Query failed: " . mysqli_error($conn)); // Shows the query error
}

$row = mysqli_fetch_assoc($data3);

// Another query for products
$sql = "SELECT * FROM ecommerce_product";
$data = $conn->query($sql);

// Wishlist query
$sql2 = "SELECT * FROM ecommerce_product AS p INNER JOIN ecommerce_wishlist AS sc ON sc.product_id = p.product_id WHERE sc.user_id = $user_id";
$data2 = $conn->query($sql2);

// Check if user_id is null
if ($user_id == NULL) {
    $count_cart = 0;
} else {
    // Cart wishlist
    $sql3 = "SELECT COUNT(id) AS count_cart FROM ecommerce_wishlist AS sc INNER JOIN ecommerce_product AS p ON p.product_id = sc.product_id WHERE sc.user_id = $user_id";
    $data3 = $conn->query($sql3);
    if ($data3) {
        $row3 = mysqli_fetch_assoc($data3);
        $count_cart = $row3['count_cart'];
    } else {
        $count_cart = 0;
    }
}

// Investor query
$query4 = "SELECT * FROM fundraising_investor WHERE ci_id = $ci_id AND user_id = $user_id AND request_status = 'Accept'";
$data4 = mysqli_query($conn, $query4);

// Check if the investor query was successful before fetching
if ($data4 && mysqli_num_rows($data4) > 0) {
    // Fetch the result
    $result4 = mysqli_fetch_assoc($data4);
} else {
    $result4 = NULL; // Handle case when no results are returned
    // Optional: add a message or error handling
}
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

    <!--<script src="https://cdn.tailwindcss.com"></script>-->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
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
                        <a href="fundraiser_startup.php">Startup</a>
                    </li>
                    <li>
                        Startup Details
                    </li>
                </ul>
            </div>
        </div>
    </section>
    <!-- ==========Banner Section Ends Here========== -->


    <!-- ==========Shop Section Starts Here========== -->
    <div class="shop-page padding-top padding-bottom">
        <div class="container">



            <!-- Combined Section: Navbar, Main Image, Social Buttons, and Private Fundraise -->
            <div class="container mx-auto px-4 py-8 bg-white shadow-lg">

                <!-- Navbar and Company Info -->
                <div class="flex justify-between items-center pb-6">
                    <h1 class="text-2xl font-bold"><b><?php echo $row['product_name'] ?></b> | <?php echo $row['quick_pitch'] ?></h1>
                    <div class="flex items-center space-x-4">
                        <button class="styled-button" title="Follow"><i class="fa-regular fa-star"></i></button>
                        <style>
                            .styled-button {
                                border: 1px solid grey;
                                /* Add border with color */
                                border-radius: 6px;
                                /* Rounded corners, adjust as needed */
                                padding: 10px 15px;
                                /* Increase padding to make button larger */
                                font-size: 20px;
                                /* Increase icon size */
                                background-color: #eef3f6;
                                /* Background color of the button */
                                color: grey;
                                /* Color of the icon */
                                cursor: pointer;
                                /* Change cursor to pointer on hover */
                                transition: all 0.3s ease;
                                /* Smooth transition for hover effects */
                            }

                            .styled-button:hover {
                                background-color: #eef3f6;
                                /* Light background on hover */
                                border-color: black;
                                /* Darker border color on hover */
                            }
                        </style>
                    </div>

                </div>


                <!-- Main Content with Cover Image and Private Fundraise Info -->
                <div class="flex flex-col md:flex-row gap-8">

                    <!-- Main Cover Image and Social Share Buttons (Left side) -->
                    <div class="flex flex-col w-full md:w-2/3">

                        <!-- Cover Image -->
                        <!--<div class="bg-cover bg-center h-80 mb-6"
                            style="background-image:url('https://s3.amazonaws.com/media.fundable.com/companies/258084/covers/cover-ips5mpgg2g.png');  width: auto; height: 450px;">
                        </div>-->

                        <?php
                        foreach (json_decode($row["cover_pictures"]) as $cover) : ?>
                            <div class="bg-cover bg-center h-80 mb-6">
                                <img src="cover_images/<?php echo $cover; ?>" alt="no-img" style="width: auto; height: 450px;">
                            </div>

                        <?php endforeach; ?>

                    </div>


                    <!-- Business Plan Content (Initially Hidden) -->
                    <?php if (($result4 && $result4['request_status'] == "Accept") || ($row['fundraiser_id'] == $user_id) ){  ?>
                        <div class="widget widget-feature">
                            <div class="widget-header">
                                <h3 class="title" style="width: auto;"><b>Fundraise Details</b></h3>
                            </div>
                            <div class="widget-body">
                                <ul>
                                    <li>
                                        <div class="ques cl-i-one"><i class="fas fa-calendar"></i>Raise Amount</div>
                                        <div class="ans"><?php echo $row['raise_amount']; ?></div>
                                    </li>
                                    <li>
                                        <div class="ques cl-i-two"><i class="fas fa-clock"></i>Funding committed offline</div>
                                        <div class="ans"><?php echo $row['funding_committed_offline']; ?></div>
                                    </li>
                                    <li>
                                        <div class="ques cl-i-three"><i class="fas fa-calendar"></i>Pre Money valuation</div>
                                        <div class="ans"><?php echo $row['pre_money_valuation']; ?></div>
                                    </li>
                                    <li>
                                        <div class="ques cl-i-four"><i class="fas fa-clock"></i>Previous investments</div>
                                        <div class="ans"><?php echo $row['previous_investments']; ?></div>
                                    </li>
                                    <li>
                                        <div class="ques cl-i-five"><i class="fas fa-home"></i>Valuation cap amount</div>
                                        <div class="ans"><?php echo $row['valuation_cap_amount']; ?></div>
                                    </li>
                                    <!--<li>
                                        <div class="ques cl-i-six"><i class="fas fa-user"></i>Event Organizer</div>
                                        <div class="ans"><?php echo $row['convertible_note_discount']; ?></div>
                                    </li>
                                    <li>
                                        <div class="ques cl-i-seven"><i class="fas fa-star"></i>Rating</div>
                                        <div class="ans cl-i-seven"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                                    </li>
                                    <li>
                                        <div class="ques cl-i-eight"><i class="fas fa-coins"></i>Event Ticket</div>
                                        <div class="ans">$2500.00</div>
                                    </li>-->
                                </ul>
                            </div>
                        </div>
                    <?php
                    } else {
                    ?>
                        <!-- Private Fundraise Section (Right side) -->
                        <div class="w-full md:w-1/3 bg-gray-50 p-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-center" style="height: 450px;">
                            <!-- Fundraise Info Header -->
                            <div class="flex items-center space-x-3 justify-center">
                                <i class="fa-solid fa-lock fa-2xl text-gray-500"></i>
                                <h2 class="text-2xl font-bold">Private Fundraise</h2>
                            </div>

                            <!-- Description -->
                            <p class="mt-4 text-gray-700">
                                This company may be interested in raising funds from accredited investors. You must request access to see more information about this company.
                            </p>

                            <!-- Button centered -->
                            <br>
                            <a href="fundraiser_request_access.php?ci_id=<?php echo $ci_id; ?>" class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
                                Request Access <i class="fa-solid fa-key"></i>
                            </a>
                        </div>
                    <?php
                    }
                    ?>












                </div>

                <!-- Social Share Buttons -->
                <br>
                <div class="flex justify-start space-x-6 items-center">
                    <!-- Facebook Like Button -->
                    <div class="link facebook">
                        <iframe src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.fundable.com%2Ftop-shelf-cooler-corp&send=false&layout=standard&width=350&show_faces=true&action=like&colorscheme=light&font=arial&height=24&appId=237515676329060"
                            scrolling="no" frameborder="0" class="border-none overflow-hidden w-80 h-6" allowTransparency="true"></iframe>
                    </div>

                    <!-- Twitter Share Button -->
                    <a target="_blank" href="https://twitter.com/intent/tweet?text=Top%20Shelf%20Cooler%20Corp.%20-%20Discover%20the%20Ultimate%20Cooler&url=https%3A%2F%2Fwww.fundable.com%2Ftop-shelf-cooler-corp">
                        <i class="fa-brands fa-twitter fa-xl text-blue-400"></i>
                    </a>

                    <!-- Pinterest Share Button -->
                    <a target="_blank" href="http://pinterest.com/pin/create/button/?url=https%3A%2F%2Fwww.fundable.com%2Ftop-shelf-cooler-corp&media=https://s3.amazonaws.com/media.fundable.com/companies/258084/covers/cover-ips5mpgg2g.png&description=Top+Shelf+Cooler+Corp.+-+Discover+the+Ultimate+Cooler">
                        <i class="fa-brands fa-pinterest fa-xl text-red-600"></i>
                    </a>

                    <!-- LinkedIn Share Button -->
                    <a target="_blank" href="http://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fwww.fundable.com%2Ftop-shelf-cooler-corp&title=Top+Shelf+Cooler+Corp.&summary=Discover+the+Ultimate+Cooler">
                        <i class="fa-brands fa-linkedin fa-xl text-blue-700"></i>
                    </a>
                </div>

            </div>


            <div class="clear"></div>

            <div class="container mx-auto px-4 py-6">
                <!-- Tabs -->
                <div class="tabs bg-white shadow-md rounded-md p-4 border border-gray-300">
                    <div class="flex space-x-4 border-b">
                        <a href="#public-profile" class="pb-2 border-b-2 border-blue-600 text-blue-600 tab" id="profile-tab" data-target="profile">
                            <i class="fa-solid fa-file fa-sm"></i> PROFILE
                        </a>
                        <a href="#business-plan" class="pb-2 tab" id="business-tab" data-target="business-plan">
                            <i class="fa-solid fa-lock fa-sm"></i> BUSINESS PLAN
                        </a>
                        <a href="#updates" class="pb-2 tab" id="updates-tab" data-target="updates">
                            <i class="fa-solid fa-wifi fa-sm"></i> UPDATES
                        </a>
                    </div>
                </div>

                <!-- Page Body -->
                <!-- Profile Content -->
                <div id="profile" class="page-body grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 content-section">
                    <!-- Left Body: Image Content -->
                    <div class="left-body col-span-2 space-y-6">
                        <?php
                        $fpp_subjects = explode(',', $row["fpp_subject"]);
                        $fpp_slides = json_decode($row["fpp_slide"]);

                        if (count($fpp_subjects) === count($fpp_slides)) {
                            foreach ($fpp_subjects as $index => $fpp_subject) {
                                $fpp_subject = trim($fpp_subject);
                                $p_slides = htmlspecialchars($fpp_slides[$index], ENT_QUOTES, 'UTF-8');
                        ?>
                                <div id="<?php echo htmlspecialchars($fpp_subject, ENT_QUOTES, 'UTF-8'); ?>" class="bg-white p-6 shadow-md rounded-md">
                                    <div class="user-generated-content text-center">
                                        <img src="slide_images/<?php echo $p_slides; ?>" alt="Top Shelf Cooler" class="mx-auto">
                                    </div>
                                </div>
                                <hr>
                        <?php
                            }
                        } else {
                            echo "Error: The number of subjects and slides do not match.";
                        }
                        ?>
                    </div>

                    <!-- Right Body: Navigation Links (Sticky) -->
                    <div class="right-body bg-white p-6 shadow-md rounded-md sticky top-6 overflow-y-auto max-h-screen">
                        <ul class="ps-nav space-y-4">
                            <h1>Subjects</h1>
                            <br>
                            <?php
                            $fpp_subjects = explode(',', $row["fpp_subject"]);
                            foreach ($fpp_subjects as $fpp_subject) {
                                $fpp_subject = trim($fpp_subject);
                            ?>
                                <li><a href="#<?php echo htmlspecialchars($fpp_subject, ENT_QUOTES, 'UTF-8'); ?>" class="text-blue-600 scroll-link"><?php echo htmlspecialchars($fpp_subject, ENT_QUOTES, 'UTF-8'); ?></a></li>
                                <hr>
                            <?php } ?>
                        </ul>
                    </div>
                </div>

                <!-- Business Plan Content (Initially Hidden) -->
                <?php if (($result4 && $result4['request_status'] == "Accept") || ($row['fundraiser_id'] == $user_id) ) {  ?>
                    <div id="business-plan" class="page-body grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 hidden content-section">
                        <!-- Left Body: Image Content -->
                        <div class="left-body col-span-2 space-y-6">
                            <?php
                            $fbp_subjects = explode(',', $row["fbp_subject"]);
                            $fbp_slides = json_decode($row["fbp_slide"]);

                            if (count($fbp_subjects) === count($fbp_slides)) {
                                foreach ($fbp_subjects as $index => $fbp_subject) {
                                    $fbp_subject = trim($fbp_subject);
                                    $b_slides = htmlspecialchars($fbp_slides[$index], ENT_QUOTES, 'UTF-8');
                            ?>
                                    <div id="<?php echo htmlspecialchars($fbp_subject, ENT_QUOTES, 'UTF-8'); ?>" class="bg-white p-7 shadow-md2 rounded-md2">
                                        <div class="user-generated-content text-center">
                                            <img src="slide_images/<?php echo $b_slides; ?>" alt="Slide image" class="mx-auto">
                                        </div>
                                    </div>
                                    <hr>
                            <?php
                                }
                            } else {
                                echo "Error: The number of subjects and slides do not match.";
                            }
                            ?>
                        </div>

                        <!-- Right Body: Navigation Links (Sticky) -->
                        <div class="right-body bg-white p-7 shadow-md2 rounded-md2 sticky top-7 overflow-y-auto max-h-screen">
                            <ul class="ps-nav-b space-y-5">
                                <h1>Subjects</h1>
                                <br>
                                <?php
                                $fbp_subjects = explode(',', $row["fbp_subject"]);
                                foreach ($fbp_subjects as $fbp_subject) {
                                    $fbp_subject = trim($fbp_subject);
                                ?>
                                    <li><a href="#<?php echo htmlspecialchars($fbp_subject, ENT_QUOTES, 'UTF-8'); ?>" class="text-blue-600 scroll-link-b"><?php echo htmlspecialchars($fbp_subject, ENT_QUOTES, 'UTF-8'); ?></a></li>
                                    <hr>
                                <?php } ?>
                            </ul>
                        </div>
                    </div>
                <?php
                } else {
                ?>
                    <div id="business-plan" class="page-body grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 hidden content-section">
                        <div class="text-center p-6 border border-gray-300 bg-gray-50 rounded-md">
                            <p class="mb-4">The Business Plan area is locked. You must request access to see more information including the Business Plan.</p>
                            <a href="fundraiser_request_access.php?ci_id=<?php echo $ci_id; ?>" id="request-access" class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Request Access <i class="fa-solid fa-key"></i></a>
                        </div>
                    </div>
                <?php
                }
                ?>





                <!-- Updates Content (Hidden by Default) -->
                <div id="updates" class="page-body grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 hidden content-section">
                    <div class="text-center p-6 border border-gray-300 bg-gray-50 rounded-md">
                        <p>No updates yet.</p>
                    </div>
                </div>
            </div>

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



    <!-- Include jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha384-+0fX/pIA8lAW2/X5qUYB9aJvzS0Y6qZu2q9t8A0F/VxgV+kX6V+k9KehPLU1TkgP" crossorigin="anonymous"></script>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Function to attach scroll listeners
            function attachScrollListeners(selector) {
                document.querySelectorAll(selector).forEach(link => {
                    link.addEventListener('click', function(event) {
                        event.preventDefault();
                        const targetId = this.getAttribute('href').substring(1);
                        const targetElement = document.getElementById(targetId);

                        if (targetElement) {
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    });
                });
            }

            // Attach listeners for the profile section (scroll-link)
            attachScrollListeners('.scroll-link');

            // Toggle the Business Plan visibility and attach listeners when visible
            const businessPlanSection = document.getElementById('business-plan');
            const businessPlanBtn = document.getElementById('toggle-business-plan-btn'); // Assume a button to toggle visibility

            if (businessPlanBtn) {
                businessPlanBtn.addEventListener('click', function() {
                    // Toggle hidden class
                    businessPlanSection.classList.toggle('hidden');

                    if (!businessPlanSection.classList.contains('hidden')) {
                        // Attach scroll listeners for business plan only when it becomes visible
                        attachScrollListeners('.scroll-link-b');
                    }
                });
            }
        });
    </script>


    <!-- jQuery for Tab Navigation -->
    <script>
        $(document).ready(function() {
            // Tab switching logic
            $(".tab").click(function(e) {
                e.preventDefault();
                // Remove active classes from all tabs
                $(".tab").removeClass("border-blue-600 text-blue-600");
                // Add active class to clicked tab
                $(this).addClass("border-blue-600 text-blue-600 border-b-2");

                // Hide all content sections
                $(".content-section").addClass("hidden");

                // Show the relevant content section
                const target = $(this).data("target");
                $("#" + target).removeClass("hidden");
            });

            // Set the default active tab to "Profile"
            $("#profile-tab").addClass("border-blue-600 text-blue-600");
            $("#profile").removeClass("hidden");
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