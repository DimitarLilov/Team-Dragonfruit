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

handlers.getSearchedEvent = function (ctx) {
    ctx.admin = sessionStorage.getItem('userRole') === 'admin';
    let title = ctx.params.title;

    if (ctx.admin) {
        eventsService.getSearchedEvent(title)
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
                categoriesService.getCategories()
                    .then(function (categories) {
                        renderEventDetailsTemplates(ctx, eventData, categories);
                    });
            }).catch(notifications.handleError);
    } else {

        eventsService.getEventsInfoNotLogged(id)
            .then(function (eventData) {
                categoriesService.getCategoriesNotLogged()
                    .then(function (categories) {
                        renderEventDetailsTemplates(ctx, eventData, categories);
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

handlers.getAddEvent = function (ctx) {
    ctx.loggedIn = auth.isAuthorized();
    ctx.username = sessionStorage.getItem('username');
    ctx.admin = auth.isAdmin();

    if (ctx.admin) {

        categoriesService.getCategories()
            .then(function (categoriesData) {

                ctx.categories = categoriesData;

                ctx.loadPartials({
                    header: "./templates/admin/common/header.hbs",
                    towns: "./templates/towns/towns.hbs",
                    category: "./templates/admin/events/category.hbs",
                    footer: "./templates/common/footer.hbs"
                }).then(function () {
                    this.partial('./templates/admin/events/eventAdd.hbs');
                });
            });
    }
};

handlers.addEvent = function (ctx) {

    let title = ctx.params.title;
    let image = ctx.params.image;
    let location = ctx.params.location;
    let details = ctx.params.details;
    let eventTime = ctx.params.eventTime;
    let eventDate = ctx.params.eventDate;
    let town = ctx.params.town;
    let categoryId = ctx.params.categoryId;

    let newEvent = {
        "image": image,
        "title": title,
        "location": location,
        "details": details,
        "eventTime": eventTime,
        "eventDate": eventDate,
        "town": town,
        "categoryId": categoryId
    };

    let isValidEvent = validateEvent(newEvent);

    if (isValidEvent) {

        eventsService.addEvent(newEvent)
            .then(function (dd) {
                console.log(dd);
                ctx.redirect("#/admin/events");
            }).catch(notifications.handleError);
    }
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
                    ctx.selectTown = eventData.town;
                    ctx.categories = categories;

                    ctx.loadPartials({
                        header: "./templates/admin/common/header.hbs",
                        footer: "./templates/common/footer.hbs",
                        towns: "./templates/towns/towns.hbs",
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
    let town = ctx.params.town;
    let categoryId = ctx.params.categoryId;

    let event = {
        "image": image,
        "title": title,
        "location": location,
        "details": details,
        "eventTime": eventTime,
        "eventDate": eventDate,
        "town": town,
        "categoryId": categoryId,
        "_id": eventId,
    };

    let isValidEvent = validateEvent(event);

    if (isValidEvent) {

        eventsService.editEvents(event).then(function () {
            notifications.showInfo(`Event ${event.title} updated.`);
            ctx.redirect("#/admin/events");
        }).catch(notifications.handleError);
    }
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
    ctx.town = eventData.town;
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

function validateEvent(event) {

    if (event.title === null || event.title.length < 4) {

        notifications.showError('Title length must be greater than 4 characters!');
        $('#title').addClass('error');
        return false;
    } else {

        $('#title').removeClass('error');
    }

    let urlRegex = new RegExp(/^(ftp|http[s]*|smtp):\/\/.*$/, 'i');

    if (urlRegex.test(event.image)) {

        $('#image').removeClass('error');
    } else {

        notifications.showError('Please enter valid image url!');
        $('#image').addClass('error');
        return false;
    }

    if (event.location === null || event.location.length < 3) {

        notifications.showError('Location length must be greater than 3 characters!');
        $('#location').addClass('error');
        return false;
    } else {

        $('#location').removeClass('error');
    }

    if (event.eventDate.length === 0) {

        notifications.showError('Event date must not be present day or in the past!');
        $('#eventDate').addClass('error');
        return false;
    } else {

        $('#eventDate').removeClass('error');
    }

    let dateNow = new Date();
    let dateOfEvent = new Date(event.eventDate);

    if (dateOfEvent <= dateNow) {

        notifications.showError('Event date must not be present day or in the past!');
        $('#eventDate').addClass('error');
        return false;
    } else {

        $('#eventDate').removeClass('error');
    }

    if (event.eventTime.indexOf(':') > 0) {

        let timeTokens = event.eventTime.split(/:/);

        let hours = Number(timeTokens[0]);
        let minutes = Number(timeTokens[1]);

        if (hours < 0 || hours > 24) {

            notifications.showError('Enter valid hour of event.');
            $('#eventTime').addClass('error');
            return false;
        } else {
            $('#eventTime').removeClass('error');
        }

        if (minutes < 0 || minutes > 59) {

            notifications.showError('Enter valid minutes of event.');
            $('#eventTime').addClass('error');
            return false;
        } else {
            $('#eventTime').removeClass('error');
        }
    } else {

        notifications.showError('Enter valid time in format HH:mm.');
        $('#eventTime').addClass('error');
        return false;
    }

    if (event.details === null || event.details.length < 10) {

        notifications.showError('Description length must be greater than 10 characters!');
        $('#details').addClass('error');
        return false;
    } else {

        $('#details').removeClass('error');
    }

    return true;
}