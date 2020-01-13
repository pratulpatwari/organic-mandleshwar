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

createUser = async (email, password) => {
    try {
        const credentials = await auth.createUserWithEmailAndPassword(email, password);
        return credentials.user;
    } catch (error) {
        console.error("Error while signing up the user: " + email + ". Error message: ", error.message);
        return undefined;
    }
}