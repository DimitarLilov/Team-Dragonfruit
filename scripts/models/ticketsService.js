let ticketsService = (() => {

    function getMyTickets(userId) {
        return requester.get('appdata', `userTickets?query={"userId":"${userId}"}`, 'kinvey');
    }

    function addTicket(ticket) {
        return requester.post('appdata', `tickets`, 'kinvey',ticket);
    }

    function getEventTickets(eventId) {
        return requester.get('appdata', `tickets?query={"eventId":"${eventId}"}`, 'kinvey');
    }

    function editTicket(data) {
        return requester.post('rpc', 'custom/editTicket', 'kinvey', data);
    }

    function getTicket(ticketId) {
        return requester.get('appdata', `tickets/${ticketId}`, 'kinvey');
    }

    return {
        getMyTickets,
        addTicket,
        getEventTickets,
        getTicket,
        editTicket
    }
})();