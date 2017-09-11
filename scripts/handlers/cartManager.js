handlers.displayCart = function (ctx) {
    let loggedIn = auth.isAuthorized();
    ctx.loggedIn = loggedIn;
    ctx.username = sessionStorage.getItem('username');
    let eventId = ctx.params.id.substring(1);

    cartService.getTicketByEventId(eventId)
        .then(function (detailsInfo) {
            eventsService.getEventsInfo(eventId)
                .then(function (amountInfo) {

                    let details = [];
                    for (let detail of detailsInfo) {
                        let detailsObj = {
                            title: amountInfo.title,
                            details: amountInfo.details,
                            image: amountInfo.image,
                            amount: detail.ticketAmount,
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
                        this.partial('./templates/shoppingCart/shoppingCartPage.hbs');
                    })
                })
        })
}


