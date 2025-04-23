<?php
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

// Sanitize user input
$title = mysqli_real_escape_string($conn, $_POST['title']);
$description = mysqli_real_escape_string($conn, $_POST['description']);

$sql = "SELECT * FROM fundraising_company_product WHERE product_name LIKE '%$title%'";
$query = mysqli_query($conn, $sql);

// Check if query executed successfully
if (!$query) {
    die("Query failed: " . mysqli_error($conn));
}

while ($row = mysqli_fetch_assoc($query)) {
    $description = $row['description'];
    $words = explode(' ', $description);
    if (count($words) > 12) {
        $short_description = implode(' ', array_slice($words, 0, 12)) . '...';
    } else {
        $short_description = $description;
    }
?>

    <div class="col-xl-4 col-md-6">
        <div class="post-item">
            <div class="post-thumb">
                <?php foreach (json_decode($row["cover_pictures"]) as $cover) : ?>
                    <div class="post-thumb">
                        <a href="fundraiser_startup_details.php?ci_id=<?php echo $row['ci_id']; ?>">
                            <img src="cover_images/<?php echo $cover; ?>" alt="no-img" style="width: 370px; height: 300px;">
                        </a>
                    </div>
                <?php endforeach; ?>
            </div>
            <div class="post-content">
                <div class="post-top">
                    <h4 class="title"><a href="fundraiser_startup_details.php?ci_id=<?php echo $row['ci_id']; ?>"><?php echo $row['product_name']; ?> - <?php echo $row['quick_pitch']; ?></a></h4>
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

// If no results found
if (mysqli_num_rows($query) === 0) {
    echo "No Data found!";
}

// Close connection
mysqli_close($conn);
?>
