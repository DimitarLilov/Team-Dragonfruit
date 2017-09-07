handlers.displayEvents = function (ctx) {
    let loggedIn = auth.isAuthorized();
    ctx.loggedIn = loggedIn;
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = auth.isAdmin();
    ctx.type = "All Events";

    if (loggedIn) {
        eventsService.getAllEvents()
            .then(function (events) {
                categoriesService.getCategories().then(function (categories) {
                    renderEventsTemplates(ctx, events, categories);
                })
            }).catch(notifications.handleError);
    } else {

        eventsService.getAllEventsNotLogged()
            .then(function (events) {
                categoriesService.getCategoriesNotLogged().then(function (categories) {
                    renderEventsTemplates(ctx, events, categories);
                })
            }).catch(notifications.handleError);
    }
};

handlers.getAllEventsAdmin = function (ctx) {
    let loggedIn = auth.isAuthorized();
    ctx.loggedIn = loggedIn;

    if (loggedIn) {
        ctx.username = sessionStorage.getItem('username');
        ctx.admin = auth.isAdmin();
        if (ctx.admin) {
            eventsService.getAllEvents()
                .then(function (eventsData) {
                    for (let event of eventsData) {
                        ticketsService.getEventTickets(event._id).then(function (tickets) {
                            event.tickets = tickets;
                            ctx.events = eventsData;

                            ctx.loadPartials({
                                header: "./templates/admin/common/header.hbs",
                                event: "./templates/admin/events/event.hbs",
                                ticket: "./templates/admin/events/tickets/ticket.hbs",
                                footer: "./templates/common/footer.hbs"
                            }).then(function () {
                                this.partial('./templates/admin/events/eventsList.hbs');
                            });

                        });
                    }
                }).catch(notifications.handleError);
        }
        else {
            ctx.redirect('index.html');
        }
    }
};

handlers.deleteEvent = function (ctx) {
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = auth.isAdmin();

    let eventId = ctx.params.id.substr(1);

    if (ctx.admin) {
        let data = {
            "id": eventId
        };

        eventsService.removeEvents(data)
            .then(function () {
                notifications.showInfo(`Event deleted.`);
                ctx.redirect("#/admin/events");
            }).catch(notifications.showError);
    }
    else {
        ctx.redirect('index.html');
    }
};

handlers.displayDetailsEvent = function (ctx) {
    ctx.loggedIn = auth.isAuthorized();
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = auth.isAdmin();

    let id = ctx.params.id.substring(1);

    if (ctx.loggedIn) {
        eventsService.getEventsInfo(id)
            .then(function (eventData) {
                categoriesService.getCategories().then(function (categories) {
                    renderEventDetailsTemplates(ctx, eventData, categories);
                });
            }).catch(notifications.handleError);
    } else {

        eventsService.getEventsInfoNotLogged(id)
            .then(function (eventData) {
                categoriesService.getCategoriesNotLogged().then(function (categories) {
                    renderEventDetailsTemplates(ctx, eventData, categories)
                })
            }).catch(notifications.handleError);
    }
};


handlers.displayCategoryEvents = function (ctx) {
    ctx.loggedIn = auth.isAuthorized();
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = auth.isAdmin();

    let id = ctx.params.id.substring(1);

    eventsService.getEventsByCategoryId(id).then(function (events) {
        categoriesService.getCategoriesNotLogged().then(function (categories) {
            categoriesService.getCategory(id).then(function (category) {
                ctx.type = category.category;
                renderEventsTemplates(ctx, events, categories);
            })
        })
    });
};

handlers.getEditEvent = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    let id = ctx.params.id.substring(1);

    if (ctx.admin) {
        eventsService.getEventsInfo(id)
            .then(function (eventData) {
                categoriesService.getCategories().then(function (categories) {

                    ctx.title = eventData.title;
                    ctx._id = eventData._id;
                    ctx.image = eventData.image;
                    ctx.location = eventData.location;
                    ctx.details = eventData.details;
                    ctx.eventTime = eventData.eventTime;
                    ctx.eventDate = eventData.eventDate;
                    ctx.selected = eventData.categoryId;
                    ctx.categories = categories;

                    ctx.loadPartials({
                        header: "./templates/admin/common/header.hbs",
                        footer: "./templates/common/footer.hbs",
                        category: "./templates/admin/events/category.hbs"
                    }).then(function () {
                        this.partial('./templates/admin/events/eventEdit.hbs');
                    });
                });
            }).catch(notifications.handleError);
    }
    else {
        ctx.redirect('index.html');
    }
};

handlers.editEvent = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    ctx.loggedIn = sessionStorage.getItem('authtoken') !== null;

    let eventId = ctx.params.id.substr(1);

    let title = ctx.params.title;
    let image = ctx.params.image;
    let location = ctx.params.location;
    let details = ctx.params.details;
    let eventTime = ctx.params.eventTime;
    let eventDate = ctx.params.eventDate;
    let categoryId = ctx.params.categoryId;

    let event = {
        "image": image,
        "title": title,
        "location": location,
        "details": details,
        "eventTime": eventTime,
        "eventDate": eventDate,
        "categoryId": categoryId,
        "_id": eventId,
    };
    eventsService.editEvents(event).then(function () {
        notifications.showInfo(`Event ${event.title} updated.`);
        ctx.redirect("#/admin/events");
    }).catch(notifications.handleError);

};


function renderEventDetailsTemplates(ctx, eventData, categories) {
    for (let category of categories) {
        if (category._id === eventData.categoryId) {
            ctx.category = category.category;
        }
    }

    ctx.title = eventData.title;
    ctx._id = eventData._id;
    ctx.image = eventData.image;
    ctx.location = eventData.location;
    ctx.details = eventData.details;
    ctx.eventTime = eventData.eventTime;
    ctx.eventDate = eventData.eventDate;
    ctx.categories = categories;

    ctx.loadPartials({
        header: "./templates/common/header.hbs",
        footer: "./templates/common/footer.hbs",
        navCategory: "./templates/common/navCategory.hbs"
    }).then(function () {
        this.partial('./templates/events/details.hbs');
    });
}

function renderEventsTemplates(ctx, events, categories) {

    for (let category of categories) {
        for (let event of events) {
            if (category._id === event.categoryId) {
                event.category = category.category;
            }
        }
    }

    ctx.events = events;
    ctx.categories = categories;

    ctx.loadPartials({
        header: "./templates/common/header.hbs",
        footer: "./templates/common/footer.hbs",
        event: "./templates/events/event.hbs",
        navCategory: "./templates/common/navCategory.hbs",

    }).then(function () {
        this.partial('./templates/events/events.hbs');
    });
}