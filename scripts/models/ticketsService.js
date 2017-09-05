let ticketsService = (() => {

    function getAllTickets() {
        return requester.get('appdata', 'tickets', 'kinvey');
    }

    function getAllTicketsNotLogged() {
        return requester.get('appdata', 'tickets', 'master');
    }

    function getEditTicketInfo(ticketId) {
        return requester.get('appdata', `tickets/${ticketId}`, 'kinvey');
    }

    function editTicket(data) {
        return requester.post('rpc', 'custom/editTicket', 'kinvey', data);
    }

    function getCategories() {
        return requester.get('appdata', `categories`, 'kinvey');
    }


    function removeTicket(data) {
        return requester.post('rpc', `custom/deleteTicket`, 'kinvey', data);
    }

    return {
        getAllTickets,
        getAllTicketsNotLogged,
        getEditTicketInfo,
        getCategories,
        editTicket,
        removeTicket
    }
})();