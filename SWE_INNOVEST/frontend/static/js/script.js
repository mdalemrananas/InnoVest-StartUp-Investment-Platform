$(document).ready(function() {
    function updateProgress() {
        let totalFields = $('#companyForm input').length;
        let filledFields = $('#companyForm input').filter(function() {
            return $(this).val().trim() !== '';
        }).length;

        let progress = Math.round((filledFields / totalFields) * 100);
        $('#companyProgress').text(progress + '%');
    }

    // Update progress on input change
    $('#companyForm input').on('input change', updateProgress);

    // Ensure progress remains correct after form submission
    $('#companyForm').on('submit', function(event) {
        event.preventDefault(); // Prevent actual form submission

        // Ensure all fields are still counted correctly
        updateProgress(); 
        
        alert('Changes saved successfully!');
    });

    // Preserve input values after clicking Save
    $('#companyForm input').each(function() {
        $(this).on('input', function() {
            $(this).data('savedValue', $(this).val());
        });
    });

    // Restore values after form submit
    $('#companyForm').on('submit', function() {
        $('#companyForm input').each(function() {
            if ($(this).data('savedValue')) {
                $(this).val($(this).data('savedValue'));
            }
        });
    });

    // Initial check when page loads
    updateProgress();
});


$(document).ready(function () {
    $(".section-btn").click(function () {
        var section = $(this).data("section");
        $(".form-section").addClass("d-none");
        $("#" + section).removeClass("d-none");
    });

    $("#companyForm").submit(function (event) {
        event.preventDefault();

        // Simple validation check
        if (
            $("#companyName").val() &&
            $("#quickDesc").val() &&
            $("#industry").val() &&
            $("#location").val() &&
            $("#companyImage").val()
        ) {
            $("#companyProgress").text("100%");
        } else {
            $("#companyProgress").text("50%");
        }
    });

    // Ensure correct display on smaller screens
    $(window).resize(function () {
        if ($(window).width() < 992) {
            $(".sidebar").addClass("mobile-sidebar");
        } else {
            $(".sidebar").removeClass("mobile-sidebar");
        }
    });
});


