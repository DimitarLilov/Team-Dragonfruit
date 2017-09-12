/*
handlers.displayCart = function (ctx) {
    let loggedIn = auth.isAuthorized();
    ctx.loggedIn = loggedIn;
    ctx.username = sessionStorage.getItem('username');
    let eventId = ctx.params.id.substring(1);

    cartService.getTicketByEventId(eventId)
        .then(function (detailsInfo) {
            eventsService.getEventsInfo(eventId)
                .then(function (amountInfo) {

                    console.log(detailsInfo);
                    let details = [];
                    for (let detail of detailsInfo) {
                        let detailsObj = {
                            id:detail._id,
                            title: detail.title,
                            details: detail.details,
                            image: detail.image,
                            amount: detail.ticketAmount,
                            price:detail.price
                        };

                        details.push(detailsObj);
                    }

                    ctx.details = details;
                    ctx.loadPartials({
                        header: './templates/common/header.hbs',
                        footer: './templates/common/footer.hbs',
                        navCategory: "./templates/common/navCategory.hbs",
                        detail: './templates/shoppingCart/shoppingCartForm.hbs',
                    }).then(function () {
                        this.partial('./templates/shoppingCart/shoppingCartPage.hbs')
                            .then(function () {
                                let btn=$('button');
                                btn.click(function () {
                                    let ticketId=$(this).attr('data-id');
                                    deleteTicket(ticketId);
                                })
                    })
                    })
                })
        })
    function deleteTicket(ticketId) {
        console.log(ticketId);
        cartService.deleteTicket(ticketId)
            .then(function (cartInfo) {
                console.log(cartInfo);
                notifications.showInfo('Ticket deleted')
                window.history.go(-1);
            }).catch(auth.handleError)
    }
}
*/
handlers.displayCart = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.id = sessionStorage.getItem('userId');

    let userId = sessionStorage.getItem('userId');

    cartService.getTicketByUserId(userId).then(function (products) {

        categoriesService.getCategories().then(function (categories) {

            let tickets = [];
            let totalPrice = 0;

            for (let product of products) {

                let totalProductPrice = Number(product.ticketAmount) * Number(product.price);
                totalPrice += totalProductPrice;

                let ticket = {
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

                    .then(function () {
                        let btn = $('button');
                        btn.click(function () {
                            let ticketId = $(this).attr('data-id');
                            deleteTicket(ticketId);
                        })
                    })
            })

        }).catch(notifications.handleError);
    });

    function deleteTicket(ticketId) {
        ctx.username = sessionStorage.getItem('username');
        ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

        cartService.getCartTicketById(ticketId).then(function (cartTicketData) {

            let boughtAmount = Number(cartTicketData.ticketAmount);

            ticketsService.getTicket(cartTicketData.ticketId).then(function (eventTicketData) {

                let currAmount = Number(eventTicketData.ticketsCount);
                currAmount += boughtAmount;
                eventTicketData.ticketsCount = currAmount;

                ticketsService.editTicket(eventTicketData).then(function () {

                    cartService.deleteTicket(ticketId).then(function () {

                        notifications.showInfo('Ticket deleted');
                        window.history.go(-1);
                    })
                }).catch(notifications.handleError);

            }).catch(notifications.handleError);

        }).catch(notifications.handleError);
    }
};



