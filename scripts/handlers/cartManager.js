handlers.displayCart = function (ctx) {
    let loggedIn = auth.isAuthorized();
    ctx.loggedIn = loggedIn;
    ctx.username = sessionStorage.getItem('username');
    let userId=sessionStorage.getItem('userId');
    let eventId = ctx.params.id.substring(1);

    let ticketCountPromise=cartService.getTicketByEventId(eventId);
    let ticketTitlePromise=eventsService.getEventsInfo(eventId);
    let ticketInfoByUserIdPromise=cartService.getTicketByUserId(userId);

    Promise.all([ticketTitlePromise,ticketCountPromise,ticketInfoByUserIdPromise])
        .then(function ([ticketInfo,eventInfo,userInfo]) {
                ctx.image=ticketInfo.image;
                ctx.title=ticketInfo.title;
                ctx.details=ticketInfo.details;

                ctx.amount=eventInfo.ticketAmount;


            ctx.loadPartials({
                header:'./templates/common/header.hbs',
                footer:'./templates/common/footer.hbs',
                navCategory: "./templates/common/navCategory.hbs",
            }).then(function () {
                this.partial('./templates/shoppingCart/shoppingCartForm.hbs');
            })
        })
}