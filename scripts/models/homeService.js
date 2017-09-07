let homeService = (() => {

    function getUpcomingEvents() {
    return requester.get('appdata', `events?query={}&sort={"eventDate": -1}&limit=6`, 'master');
}

return {
    getUpcomingEvents
}
})();