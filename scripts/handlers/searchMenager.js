handlers.searchByTown=function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null



    ctx.loadPartials({
        header: "./templates/common/header.hbs",
        towns: "./templates/towns/towns.hbs",
        navCategory: "./templates/common/navCategory.hbs",
        footer: "./templates/common/footer.hbs"
    }).then(function () {
        this.partial('./templates/search/searchFormTown.hbs')
    }).catch(notifications.handleError);


};
handlers.displayAllTicketsByTown=function(ctx) {
    console.log(ctx.params);
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    let townName=ctx.params.town;

    searchService.getTicketByTownName(townName)
        .then(function (ticketsArr) {
            let tickets=[];
            for(let ticket of ticketsArr){
                let ticketObj={
                    title:ticket.title,
                    details:ticket.details,
                    image:ticket.image,
                    location:ticket.location,
                    town:ticket.town,
                    eventDate:ticket.eventDate,
                    eventTime:ticket.eventTime,

                }
                tickets.push(ticketObj);
            }
            ctx.tickets=tickets;
            ctx.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs",
                ticket: "./templates/search/ticketForm.hbs",
                navCategory: "./templates/common/navCategory.hbs",
            }).then(function () {
                this.partial('./templates/search/ticketPage.hbs');
            });
        })

};
handlers.searchByTime=function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    ctx.loadPartials({
        header: "./templates/common/header.hbs",
        navCategory: "./templates/common/navCategory.hbs",
        footer: "./templates/common/footer.hbs"
    }).then(function () {
        this.partial('./templates/search/searchFormTime.hbs')
    }).catch(notifications.handleError);
};
handlers.displayAllTicketsByTime=function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    let time=ctx.params.eventTime;

    searchService.getTicketByTime(time)
        .then(function (ticketsArr) {

            let tickets=[];
            for(let ticket of ticketsArr){

                    let ticketObj = {
                        title: ticket.title,
                        details: ticket.details,
                        image: ticket.image,
                        location: ticket.location,
                        town: ticket.town,
                        eventDate: ticket.eventDate,
                        eventTime: ticket.eventTime,

                    }
                    tickets.push(ticketObj);
                }

            ctx.tickets=tickets;
            ctx.loadPartials({
                header: "./templates/common/header.hbs",
                footer: "./templates/common/footer.hbs",
                ticket: "./templates/search/ticketForm.hbs",
                navCategory: "./templates/common/navCategory.hbs",
            }).then(function () {
                this.partial('./templates/search/ticketPage.hbs');
            });
        })

}
handlers.searchByPrice=function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    ctx.loadPartials({
        header: "./templates/common/header.hbs",
        navCategory: "./templates/common/navCategory.hbs",
        footer: "./templates/common/footer.hbs"
    }).then(function () {
        this.partial('./templates/search/searchFormPrice.hbs')
    }).catch(notifications.handleError);
};
handlers.displayAllTicketsByPrice=function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.username = sessionStorage.getItem('username');
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    let price=ctx.params.eventPrice;


    searchService.getTicketByPrice(price)
        .then(function (ticketsArr) {
            for(let ticket of ticketsArr){
                displayTicketById(ctx,ticket);
            }
        });

}
function displayTicketById(ctx,ticket) {
    let ticketId=ticket.eventId;

    searchService.getTiketById(ticketId)
            .then(function (ticket) {

                let tickets = {
                    title: ticket.title,
                    image: ticket.image,
                    town: ticket.town,
                    eventDate: ticket.eventDate,
                    eventTime: ticket.eventTime,

                };

                ctx.tickets=tickets;
                console.log(ctx.tickets);
                ctx.loadPartials({
                    header: "./templates/common/header.hbs",
                    footer: "./templates/common/footer.hbs",
                    ticket: "./templates/search/ticketForm.hbs",
                    navCategory: "./templates/common/navCategory.hbs",
                }).then(function () {
                    this.partial('./templates/search/ticketPage.hbs');
                });
            })



}