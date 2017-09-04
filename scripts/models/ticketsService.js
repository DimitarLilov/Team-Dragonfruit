let ticketsService = (() => {

    function getAllTickets() {
        return requester.get('appdata', 'tickets', 'kinvey');
    }

    function getAllTicketsNotLogged() {
        return requester.get('appdata', 'tickets', 'master');
    }

    return {
        getAllTickets,
        getAllTicketsNotLogged
    }
})();