$('#signup').on('click', function () {
    const email = $('#signup-email').val();
    const password = $('#signup-password').val();
    // signup users
    createUser(email, password).then(credentials => {
        if (credentials != undefined) {
            // crash the modal. irrespective of results
            $('#modal-signup').modal('toggle');
            $('#signup-email').val('');
            $('#signup-password').val('');
        }
    });
});

$('#signup-cancel').on('click', function () {
    $('#signup-email').val('');
    $('#signup-password').val(''); 
});

