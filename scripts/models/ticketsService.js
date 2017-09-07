let ticketsService = (() => {

    function getMyTickets(userId) {
        return requester.get('appdata', `tickets?query={"userId":"${userId}"}`, 'kinvey');
    }

    return {
        getMyTickets,
    }
})();