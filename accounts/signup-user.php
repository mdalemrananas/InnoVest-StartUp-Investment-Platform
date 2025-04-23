<?php require_once "controllerUserData.php"; ?>
<?php
                                
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
    <section class="page-header bg_img" data-background="assets/images/banner/signup-header1.png">
        <div class="container">
            <div class="page-header-content">
                <h1 class="title">Our Register Now</h1>
                <ul class="breadcrumb">
                    <li>
                        <a href="home.php">Home</a>
                    </li>
                    <li>
                        Register Now
                    </li>
                </ul>
            </div>
        </div>
    </section>
    <!-- ==========Banner Section Ends Here========== -->


    <!-- ==========Login Section Section Starts Here========== -->
    <div class="login-section padding-top padding-bottom">
        <div class="container">
            <div class="account-wrapper">
                <h3 class="title">Register Now</h3>
                <p class="text-center">It's quick and easy.</p>
                <!--<form  class="account-form" action="verify_code1.php" method="post" enctype="multipart/form-data" id="myform" autocomplete="on" onsubmit="encryptPassword()">-->
                <form class="account-form" action="controllerUserData.php" method="post" enctype="multipart/form-data" id="myform" autocomplete="on" onsubmit="return encryptPassword()">

                    <?php
                    if (count($errors) == 1) {
                        echo '<div class="alert alert-danger text-center">' . $errors[0] . '</div>';
                    } elseif (count($errors) > 1) {
                        echo '<div class="alert alert-danger"><ul>';
                        foreach ($errors as $showerror) {
                            echo '<li>' . $showerror . '</li>';
                        }
                        echo '</ul></div>';
                    }
                    ?>

                    <div class="form-group">
                        <input type="text" placeholder="Username" name="name" id="name" required>
                    </div>

                    <div class="form-group">
                        <input type="email" placeholder="Email" name="email" id="email" required>
                    </div>

                    <div class="form-group">
                        <input type="password" placeholder="Password" name="password" id="password" required>
                    </div>

                    <!-- Uncomment this if you need a confirm password field -->
                    <div class="form-group">
                        <input type="password" placeholder="Confirm password" name="cpassword" id="cpassword" required>
                    </div>

                    <div class="radio-group">
                        <label>User Type | </label>
                        <label>
                            <input type="radio" name="role" id="regular" value="Regular" required>
                            Regular
                        </label>
                        <label>
                            <input type="radio" name="role" id="fundraiser" value="Fundraiser" required>
                            Fundraiser
                        </label>
                    </div>
                    <style>
                        .radio-group {
                            display: flex;
                            gap: 20px;
                            /* Increased space between radio buttons */
                            align-items: center;
                        }

                        .radio-group label {
                            font-family: Arial, sans-serif;
                            font-size: 16px;
                            /* Larger font size */
                            color: #333;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                        }

                        .radio-group input[type="radio"] {
                            appearance: none;
                            width: 20px;
                            /* Larger size */
                            height: 20px;
                            /* Larger size */
                            border: 2px solid #777;
                            border-radius: 50%;
                            outline: none;
                            cursor: pointer;
                            margin-right: 10px;
                            /* Increased space between radio and label */
                            position: relative;
                        }

                        .radio-group input[type="radio"]:checked {
                            background-color: #333;
                            /* Green color when checked */
                            border-color: #333;
                        }

                        .radio-group input[type="radio"]:checked::after {
                            content: '';
                            position: absolute;
                            top: 4px;
                            left: 4px;
                            width: 10px;
                            height: 10px;
                            background-color: white;
                            border-radius: 50%;
                        }

                        .radio-group input[type="radio"]:hover {
                            border-color: #333;
                            /* Border color change on hover */
                        }
                    </style>

                    <div class="form-group">
                        <button class="d-block custom-button" type="submit" name="signup" value="Signup"><span>Signup</span></button>
                    </div>
                </form>

                <div class="account-bottom">
                    <span class="d-block cate pt-10">Are you a member? <a href="login-user.php">Sign In</a></span>
                    <!--<span class="or"><span>or</span></span>
                    <h5 class="subtitle">Register With Google</h5>
                    <ul class="social-icons justify-content-center">
                        <li>
                            <a href="#" class="instagram"><i class="fa-brands fa-google"></i></a>
                        </li>
                    </ul>-->
                    
                    <!--<br>
                    <p class="terms-text">
                        By creating an account, you are agreeing to the Empower IT
                        <a href="#">Terms of Service</a>.
                    </p>-->
                </div>
            </div>
        </div>
    </div>
    <!-- ==========Login Section Section Ends Here========== -->


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
                <script>document.write(new Date().getFullYear())</script>
                © <a href="home.php">Empower IT</a> - Together, we rise.
            </div>

            </div>
        </div>
    </footer>
    <!-- =========Footer Section Ends Here========== -->


    <!--Entype-->
    <script>
        function encryptPassword() {
            var password = document.getElementById("password").value;
            var encryptedPassword = btoa(password); // Base64 encoding for simplicity
            document.getElementById("encrypted_password").value = encryptedPassword;
        }
    </script>


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