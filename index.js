$(document).ready(function () {



    $('html, body').css({
        overflow: 'hidden',
        height: '100%'
    });

    var bindReview = function () {
        $("#book-detail-container").css("display", "block");
        $("#book-order-container").css("display", "none");
        $("#login-container").css("display", "none");
        $("#order-success").css("display", "none");

        $(document).on("click", ".book_detail", function (e) {
            const reviewLink = $(this).attr("reviews");

            $.getJSON(reviewLink, function (reviews) {
                $("#comments-container").empty();
                reviews.forEach(function (review) {
                    $("#comments-container").append(bookDetail(review));
                })
            })

            $("#book-detail-container").css("display", "block");
            $("#book-order-container").css("display", "none");

            $('html, body').animate({
                scrollTop: $("#book-detail-container").offset().top
            }, 1000);
        });
    }

    var payUrl = "";
    var buyUrl = "";
    var loginUrl = "";
    var userInfo = null;
    var bookID = null;
    var orderInfo = null;

    var bindOrder = function () {
        $(document).on("click", ".buy-btn", function (e) {
            buyUrl = $(this).attr("buy");
            payUrl = $(this).attr("pay");
            bookID = $(this).attr("bookID");

            $("#book-detail-container").css("display", "none");
            $("#book-order-container").css("display", "block");

            $('html, body').animate({
                scrollTop: $("#book-order-container").offset().top
            }, 1000);


        });
    }

    $("#book-search").on('click', function (e) {
        $("#book-list-container").empty();
        const searchString = $("#search-input").val();
        // if (searchString.trim() == "") {
        //     return;
        // }

        $.getJSON('http://localhost:8080/bookstore/v1/books/title/' + searchString, function (books) {
            console.log(books);
            $("#search-title").html(searchString);
            books.forEach(function (book) {
                const reviewLink = book.link.filter(function (link) { return link.rel == "reviews" })[0];

                const orderLink = book.link.filter(function (link) { return link.rel == "order" })[0];

                const payLink = book.link.filter(function (link) { return link.rel == "pay" })[0];

                const loginLink = book.link.filter(function (link) { return link.rel == "login" })[0];

                if (loginUrl == "") {
                    loginUrl = loginLink.url;
                }

                $("#book-list-container").append(bookItem(book, reviewLink.url, orderLink.url, payLink.url));
            })

            bindReview();
            bindOrder();

            $('html, body').animate({
                scrollTop: $("#book-list").offset().top
            }, 1000);
        });
    });

    $("#book-search-back").on('click', function (e) {
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
    });

    $("#book-search-back2").on('click', function (e) {
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
    });

    $("#book-list-back").on('click', function (e) {
        $('html, body').animate({
            scrollTop: $("#book-list").offset().top
        }, 1000);
    });

    $("#book-search-back3").on('click', function (e) {
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
    });

    $("#book-list-back2").on('click', function (e) {
        $('html, body').animate({
            scrollTop: $("#book-list").offset().top
        }, 1000);
    });

    $("#book-search-back4").on('click', function (e) {
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
    });

    $("#book-list-back3").on('click', function (e) {
        $('html, body').animate({
            scrollTop: $("#book-list").offset().top
        }, 1000);
    });

    $("#book-pay").on('click', function (e) {
        const card_number = $("#card-number").val();
        const expire = $("#expire").val();
        const amount = $("#amount").val();

        const data = { 'cardNumber': card_number, 'expires': expire, 'amount': amount };
        console.log(JSON.stringify(data));

        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'data': JSON.stringify(data),
            'dataType': 'json',
            'type': "POST",
            'url': payUrl,
            'success': function (data) {
                console.log(data);
                const data2 = {
                    "bookID": bookID,
                    "qty": 1,
                    "total": parseInt(amount),
                };

                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    'data': JSON.stringify(data2),
                    'dataType': 'json',
                    'type': "POST",
                    'url': buyUrl,
                    'success': function (data) {
                        console.log(data);
                        orderInfo = data;
                    }
                });

                $("#pay-container").css("display", "none");
                if (userInfo == null) {
                    $("#login-container").css("display", "block");
                } else {
                    $("#shipping-container").css("display", "block");
                }
            }
        });

    });

    $("#book-confirm").on('click', function (e) {
        const shipping = $("#shipping").val();
        const billing = $("#billing").val();
        const data = {
            "customerID": userInfo.customerID,
            "shippingAddress": shipping,
            "billingAddress": billing,
            "total": 50.0
        };

        var fulfillUrl = null;
        fulfillUrl = orderInfo.link.filter(function(link) { return link.rel == "self" })[0];
        console.log(JSON.stringify(data));
        console.log(userInfo);
        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'data': JSON.stringify(data),
            'dataType': 'json',
            'type': "PUT",
            'url': fulfillUrl.url,
            'success': function (data) {
                console.log(data);
                $("#shipping-container").css("display", "none");
                $("#order-success").css("display", "block");
            }
        });
    });

    $("#login").on('click', function (e) {
        const username = $("#username").val();
        const password = $("#password").val();
        const data = { 'username': username, 'password': password };
        console.log(JSON.stringify(data));

        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            'data': JSON.stringify(data),
            'dataType': 'json',
            'type': "POST",
            'url': loginUrl,
            'success': function (data) {
                userInfo = data;
                $("#login-container").css("display", "none");
                $("#shipping-container").css("display", "block");
            }
        });
    });
});