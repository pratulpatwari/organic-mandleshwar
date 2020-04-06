$('#refresh').on('click', fetchCustomerDetails);

$(window).on("load", fetchCustomerDetails);

function fetchCustomerDetails() {
    var table = $("#customers tbody");
    table.empty();
    var headers = new Headers();
    $('.loader').show();
    const button = '<button type="button" class="btn btn-success" id="details">View</button>';
    setTimeout(() => {
        $.get("api/customer/accounts/1", function (data) {
            $('.loader').hide();
            alert(headers.get('access-token'));
            $.each(data, function (index, customer) {
                table.append('<tr><td>' + customer.id +
                    '</td><td>' + customer.firstName +
                    '</td><td>' + customer.lastName +
                    '</td><td>' + customer.phoneNumber +
                    '</td><td> Rs. ' + customer.amount +
                    '</td><td>' + button + '</td></tr>');
            });
        }).fail(function () {
            alert('Error while fetching the customer data');
        });
    }, 1000);
}

