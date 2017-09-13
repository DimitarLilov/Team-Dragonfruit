handlers.displayCart = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.id=sessionStorage.getItem('userId');

    let userId = sessionStorage.getItem('userId');

    cartService.getTicketByUserId(userId).then(function (products) {
        categoriesService.getCategories().then(function (categories) {
            let tickets = [];
            let totalPrice = 0;
            for (let product of products) {
                let totalProductPrice = Number(product.ticketAmount) * Number(product.price);
                totalPrice += totalProductPrice;
                let ticket = {
                    isAuthor:product._acl.creator===sessionStorage.getItem('userId'),
                    id: product._id,
                    image: product.image,
                    title: product.title,
                    quantity: product.ticketAmount,
                    eventDate: product.eventDate,
                    eventTime: product.eventTime,
                    price: product.price,
                    totalProductPrice: totalProductPrice
                };

                tickets.push(ticket);
            }

            ctx.categories = categories;
            ctx.tickets = tickets;
            ctx.totalPrice = totalPrice;

            ctx.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                ticket: './templates/cart/ticket.hbs',
                navCategory: "./templates/common/navCategory.hbs",
            }).then(function () {
                this.partial('./templates/cart/cart.hbs')
            })

        }).catch(notifications.handleError);
    })

}
handlers.deleteTicketByCart=function (ctx) {
    let loggedIn = auth.isAuthorized();
    ctx.loggedIn = loggedIn;
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    let ticketId = ctx.params.id.substr(1);

    cartService.deleteTicket(ticketId)
        .then(function () {
            notifications.showInfo('Ticket deleted!')
            window.history.go(-1);
        }).catch(auth.handleError)

}



