let eventsService = (() => {

    function getAllEvents() {
        return requester.get('appdata', 'events', 'kinvey');
    }

    function getAllEventsNotLogged() {
        return requester.get('appdata', 'events', 'master');
    }

    function getEventsInfo(eventId) {
        return requester.get('appdata', `events/${eventId}`, 'kinvey');
    }

    function getEventsInfoNotLogged(eventId) {
        return requester.get('appdata', `events/${eventId}`, 'master');
    }

    function editEvents(data) {
        return requester.post('rpc', 'custom/editEvent', 'kinvey', data);
    }

    function getEventsByCategoryId(categoryId) {
        return requester.get('appdata', `events?query={"categoryId":"${categoryId}"}`, 'master');
    }

    function removeEvents(data) {
        return requester.post('rpc', `custom/deleteEvent`, 'kinvey', data);
    }

    return {
        getAllEvents,
        getAllEventsNotLogged,
        getEventsInfo,
        getEventsInfoNotLogged,
        editEvents,
        removeEvents,
        getEventsByCategoryId
    }
})();