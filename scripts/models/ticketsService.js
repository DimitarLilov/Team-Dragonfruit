let ticketsService = (() => {

    function getAllTickets() {
        return requester.get('appdata', 'tickets', 'kinvey');
    }

    function getAllTicketsNotLogged() {
        return requester.get('appdata', 'tickets', 'master');
    }

    function getTicketInfo(ticketId) {
        return requester.get('appdata', `tickets/${ticketId}`, 'kinvey');
    }

    function getTicketInfoNotLogged(ticketId) {
        return requester.get('appdata', `tickets/${ticketId}`, 'master');
    }

    function editTicket(data) {
        return requester.post('rpc', 'custom/editTicket', 'kinvey', data);
    }

    function getTicketsByCategoryId(categoryId) {
        return requester.get('appdata', `tickets?query={"categoryId":"${categoryId}"}`, 'master');
    }

    function removeTicket(data) {
        return requester.post('rpc', `custom/deleteTicket`, 'kinvey', data);
    }

    return {
        getAllTickets,
        getAllTicketsNotLogged,
        getTicketInfo,
        getTicketInfoNotLogged,
        editTicket,
        removeTicket,
        getTicketsByCategoryId
    }
})();