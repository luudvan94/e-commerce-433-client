function bookItem(book, reviewUrl, buyUrl, payUrl) {
    return '<li class="list-group-item row book"> <div class="col-2"> <img src="https://www.adazing.com/wp-content/uploads/2019/02/closed-book-clipart-01-300x300.png" class="img-fluid" alt="Responsive image" /> </div> <div class="col-6"> <h5>' + book.title + '</h5> <p>' + book.author + '</p> <p>' + book.partnerInfoRepresentation.name + '</p> <p>' + book.description + '</p> </div> <div class="col-2 center"> <h4 class="price">' + '$ '+  book.price.toLocaleString('en-US') + '</h4> </div> <div class="col-2 center"> <button type="button" class="btn btn-danger buy-btn"buy="'+ buyUrl +'" pay="'+payUrl+'" bookID="'+ book.bookId +'">order >></button><button type="button" class="book_detail btn btn-success" reviews="'+ reviewUrl +'">comments >></button> </div> </li>';
}

function orderItem(order) {
    return '<tr> <th scope="row">'+ order.quantity +'</th> <td>'+ order.bookRepresentation.title  +'</td> <td>October 12, 2019</td> <td>' + '$ '+  order.total.toLocaleString('en-US') + '</td> <td><a href="#">detail >></a></td> </tr>';
}

function bookListItem(book) {
    return '<li class="list-group-item row book"> <div class="col-6"> <h5>title: ' + book.title +'</h5> <p>author: ' + book.author + '</p> <p>partner name: ' + book.partnerInfoRepresentation.name +'</p> <p>description: ' + book.description + '</p> <p>quantity: ' + book.quantity +'</p> <p>price: ' + '$ '+  book.price.toLocaleString('en-US') + '</p> </div> </li>';
}

function bookDetail(comment) {
    return '<li class="list-group-item row"> <h4>' + comment.content+ '</h4> <p>by - '+comment.customerInfoRepresentation.name+'</p></li>';
}