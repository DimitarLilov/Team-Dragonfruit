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
            let ticketsCount = 0;

            for (let product of products) {

                let totalProductPrice = Number(product.ticketAmount) * Number(product.price);
                totalPrice += totalProductPrice;
                ticketsCount++;

                let ticket = {
                    id: product._id,
                    image: product.image,
                    title: product.title,
                    quantity: product.ticketAmount,
                    eventDate: product.eventDate,
                    eventTime: product.eventTime,
                    price: product.price,
                    totalProductPrice: totalProductPrice,
                };

                tickets.push(ticket);
            }

            ctx.categories = categories;
            ctx.ticketsCount = ticketsCount;
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
    });
};

handlers.cartDeleteTicket = function (ctx) {
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    let ticketId = ctx.params.id.substring(1);

    cartService.getCartTicketById(ticketId).then(function (cartTicketData) {

        let boughtAmount = Number(cartTicketData.ticketAmount);

        ticketsService.getTicket(cartTicketData.ticketId).then(function (eventTicketData) {

            let currAmount = Number(eventTicketData.ticketsCount);
            currAmount += boughtAmount;
            eventTicketData.ticketsCount = currAmount;

            ticketsService.editTicket(eventTicketData).then(function () {

                cartService.deleteTicket(ticketId).then(function () {

                    notifications.showInfo('Ticket deleted');
                    ctx.redirect('#/cart')
                })
            }).catch(notifications.handleError);

        }).catch(notifications.handleError);

    }).catch(notifications.handleError);
};

handlers.displayPayment = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;
    ctx.id = sessionStorage.getItem('userId');

    console.log(ctx.params);

    categoriesService.getCategories().then(function (categories) {

        let ticketsId = [];
        ctx.categories = categories;
        ctx.totalPrice = ctx.params.totalPrice;

        for(let ticket of ctx.params.id){
            let ticketId = {
                id: ticket
            };
            ticketsId.push(ticketId)
        }

        ctx.tickets = ticketsId;
        ctx.ticketsCount = ctx.params.ticketsCount;



        ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            hiddenTicket: './templates/cart/hiddenTicket.hbs',
            navCategory: "./templates/common/navCategory.hbs",
        }).then(function () {
            this.partial('./templates/cart/payment.hbs')
        })

    }).catch(notifications.handleError);

};

handlers.payment = function (ctx) {
    console.log(ctx.params);



};