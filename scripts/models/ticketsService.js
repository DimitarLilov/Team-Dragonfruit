let ticketsService = (() => {

    function getMyTickets(userId) {
        return requester.get('appdata', `userTickets?query={"userId":"${userId}"}`, 'kinvey');
    }

    function addTicket(ticket) {
        return requester.post('appdata', `tickets`, 'kinvey',ticket);
    }
    return {
        getMyTickets,
        addTicket
    }
})();