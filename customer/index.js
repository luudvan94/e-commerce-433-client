$(document).ready(function () {

    $('html, body').css({
        overflow: 'hidden',
        height: '100%'
    });

    if (getCookie("partnerID") == "") {
        $("#login").css("display", "block");
        $("#signup").css("display", "none");
        $("#partner-info").css("display", "none");
        $("#info").css("display", "none");
    }

    var partnerOrders = [];
    var partnerID = "";
    var partnerLinks = [];
    var partnerInfo = null;

    var getPartnerOrders = function (partnerID) {
        $.getJSON('http://localhost:8080/bookstore/v1/customers/' + partnerID + '/orders', function (orders) {
            partnerOrders = orders;
            console.log(orders);
            partnerOrders.filter(function (order) { return order.status == "pending" }).forEach(function (order) {
                $("#orders-list-body").append(orderItem(order));
            })

        });
    }

    var getPartnerInfo = function (partnerID) {
        $.getJSON('http://localhost:8080/bookstore/v1/customers/' + partnerID, function (data) {
            console.log(data);
            $("#partner-name").html(data.name);
            $("#partner-address").html(data.address);
            partnerInfo = data;
        });
    }

    var getPartnerBooks = function (link) {
        $.getJSON(link, function (data) {
            $("#book-list-ul").empty();
            console.log(data);
            data.forEach(function (book) {
                $("#book-list-ul").append(bookListItem(book));
            })

        });
    }

    var ordersByStatus = function (status) {
        partnerOrders.filter(function (order) { return order.status == status }).forEach(function (order) {
            $("#orders-list-body").append(orderItem(order));
        })
    }

    $("#login-button").on('click', function (e) {
        const username = $("#inputUsername").val();
        const password = $("#inputPassword").val();

        const data = { 'username': username, 'password': password };
        console.log(JSON.stringify(data));

        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'data': JSON.stringify(data),
            'dataType': 'json',
            'type': 'POST',
            'url': 'http://localhost:8080/bookstore/v1/customers/login',
            'success': function (data) {
                setCookie("partnerID", data.partnerID, 365);
                $("#login").css("display", "none");
                $("#info").css("display", "block");
                console.log(data);
                partnerID = data.partnerID;
                partnerLinks = data.link;
                getPartnerOrders(data.customerID);
                getPartnerInfo(data.customerID);
            }
        });
    });

    $("#signup-button").on('click', function (e) {
        const username = $("#inputUsernameSignup").val();
        const password = $("#inputPasswordSignup").val();

        const data = { 'username': username, 'password': password };
        console.log(JSON.stringify(data));

        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'data': JSON.stringify(data),
            'dataType': 'json',
            'type': 'POST',
            'url': 'http://localhost:8080/bookstore/v1/customers',
            'success': function (data) {

                setCookie("partnerID", data.partnerID, 365);
                $("#login").css("display", "none");
                $("#signup").css("display", "none");
                $("#partner-info").css("display", "block");
                $("#info").css("display", "none");
                console.log(data);
                partnerID = data.partnerID;
                partnerLinks = data.link;
                getCookie("partnerID");
            }
        });
    });

    $("#update-button").on('click', function (e) {
        const name = $("#inputPartnerName").val();
        const address = $("#inputPartnerAddress").val();

        const data = { 'name': name, 'address': address, 'customerID': partnerID };
        console.log(JSON.stringify(data));

        var udpate_info_url = partnerLinks.filter(function (link) { return link.rel == "add_customer_info" })[0];

        var method = "POST";
        if (partnerInfo != null) {
            method = "PUT";
            udpate_info_url = partnerLinks.filter(function (link) { return link.rel == "update_customer_info" })[0];
        }

        console.log(method);

        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'data': JSON.stringify(data),
            'dataType': 'json',
            'type': method,
            'url': udpate_info_url.url,
            'success': function (data) {

                $("#login").css("display", "none");
                $("#signup").css("display", "none");
                $("#partner-info").css("display", "none");
                $("#info").css("display", "block");

                $("#partner-name").html(data.name);
                $("#partner-address").html(data.address);
                partnerInfo = data;
                console.log(data);
            }
        });
    });


    $("#log-out").on('click', function (e) {
        partnerOrders = [];
        partnerID = "";
        partnerLinks = [];
        partnerInfo = null;
        $("#login").css("display", "block");
        $("#signup").css("display", "none");
        $("#info").css("display", "none");
    });

    $("#add-new").on('click', function (e) {
        $('html, body').animate({
            scrollTop: $("#new-book").offset().top
        }, 1000);
    });

    $("#partner-back").on('click', function (e) {
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
    });

    $("#orders-tab").on('click', function (e) {
        $("#books-list").css("display", "none");
        $("#orders-info").css("display", "block");
    });

    $("#books-tab").on('click', function (e) {
        const books = partnerLinks.filter(function (link) { return link.rel == "reviews" })[0];
        console.log(books);

        getPartnerBooks(books.url);
        $("#orders-info").css("display", "none");
        $("#books-list").css("display", "block");
    });

    $("#to-sign-up").on('click', function (e) {
        $("#login").css("display", "none");
        $("#signup").css("display", "block");
    });

    $("#back-to-login").on('click', function (e) {
        $("#login").css("display", "block");
        $("#signup").css("display", "none");
    });

    $("#orders-new").on('click', function (e) {
        console.log("new orders");
        ordersByStatus("pending");
    });

    $("#orders-shipping").on('click', function (e) {
        console.log("shipping orders");
        ordersByStatus("shipping");
    });

    $("#orders-delivered").on('click', function (e) {
        console.log("delivered orders");
        ordersByStatus("delivered");
    });

    $("#orders-cancelled").on('click', function (e) {
        console.log("cancel orders");
        ordersByStatus("cancelled");
    });

    $("#update-info").on('click', function (e) {

        $("#inputPartnerName").val(partnerInfo.name);
        $("#inputPartnerAddress").val(partnerInfo.address);


        $("#login").css("display", "none");
        $("#signup").css("display", "none");
        $("#partner-info").css("display", "block");
        $("#info").css("display", "none");
    });


});