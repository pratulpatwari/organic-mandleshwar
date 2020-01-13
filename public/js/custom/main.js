$('#summary').on('click', function () {
    var table = $("#customers tbody");
    table.empty();
    const button = '<button type="button" class="btn btn-success" id="details">View</button>';
    $.get("customer/accounts/1", function (data) {
        $.each(data, function (index, customer) {
            table.append('<tr><td>' + customer.id + 
                        '</td><td>' + customer.firstName + 
                        '</td><td>' + customer.lastName + 
                        '</td><td>' + customer.phoneNumber + 
                        '</td><td> Rs. ' + customer.amount + 
                        '</td><td>' + button +'</td></tr>');
        });
    }).fail(function() {
        alert('Error while fetching the customer data');
    });
});

