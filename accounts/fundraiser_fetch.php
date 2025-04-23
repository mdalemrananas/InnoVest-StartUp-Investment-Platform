<?php
// Establish database connection
$servername = "localhost";
$username = "root";
$password = "";
$database_name = "empower_it";

$conn = mysqli_connect($servername, $username, $password, $database_name);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Get the selected category from the AJAX request and sanitize it
$category = isset($_GET['category']) ? mysqli_real_escape_string($conn, $_GET['category']) : 'All';

// Build the SQL query based on the selected category
if ($category == 'All') {
    $query = "SELECT * FROM fundraising_company_product";
} else {
    $query = "SELECT * FROM fundraising_company_product WHERE industry = '$category'";
}

// Execute the query
$data = mysqli_query($conn, $query);

// Build HTML for blogs
if ($data && mysqli_num_rows($data) > 0) {
    while ($row = mysqli_fetch_assoc($data)) {
        $description = $row['description'];
        $words = explode(' ', $description);
        $short_description = (count($words) > 12) ? implode(' ', array_slice($words, 0, 12)) . '...' : $description;

        // Only decode if JSON is valid and contains data
        $cover_pictures = json_decode($row["cover_pictures"]);
        if (!empty($cover_pictures) && is_array($cover_pictures)) {
?>
            <div class="col-xl-4 col-md-6">
                <div class="post-item">
                    <div class="post-thumb">
                        <?php foreach ($cover_pictures as $cover) : ?>
                            <a href="fundraiser_startup_details.php?ci_id=<?php echo $row['ci_id']; ?>">
                                <img src="cover_images/<?php echo $cover; ?>" alt="no-img" style="width: 370px; height: 300px;">
                            </a>
                        <?php endforeach; ?>
                    </div>
                    <div class="post-content">
                        <div class="post-top">
                            <h4 class="title">
                                <a href="fundraiser_startup_details.php?ci_id=<?php echo $row['ci_id']; ?>">
                                    <?php echo $row['product_name']; ?> - <?php echo $row['quick_pitch']; ?>
                                </a>
                            </h4>
                            <div class="post-meta cate">
                                <a href="#"><i class="far fa-calendar mr-1"></i><?php echo date('M d, Y', strtotime($row['created_at'])); ?></a>
                                <a href="#"><i class="fas fa-map-marker-alt mr-1"></i><?php echo $row['address']; ?>, <?php echo $row['state']; ?>, <?php echo $row['country']; ?></a>
                            </div>
                            <p><?php echo $short_description; ?></p>
                        </div>
                        <div class="post-bottom">
                            <a href="fundraiser_startup_details.php?ci_id=<?php echo $row['ci_id']; ?>" class="read">See Details</a>
                            <a href="#" class="comments"><i class="fa-solid fa-users"></i> <span class="comment-number">2</span></a>
                        </div>
                    </div>
                </div>
            </div>
<?php
        }
    }
} else {
    // If no data found
    echo "No Data found!";
}

// Close the connection
mysqli_close($conn);
?>
