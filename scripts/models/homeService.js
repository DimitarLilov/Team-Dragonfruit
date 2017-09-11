let homeService = (() => {

    function getUpcomingEvents(today) {
    return requester.get('appdata', `events?query={"eventDate":{"$gt" : "${today}"}}&sort={"eventDate": 1}&limit=6`, 'master');
}

return {
    getUpcomingEvents
}
})();