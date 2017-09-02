let ticketsService = (() => {
    function getAllTickets(comment) {
        return requester.get('appdata', 'tickets', 'kinvey');
    }


    return {
        getAllTickets,

    }
})();