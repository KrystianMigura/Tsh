async function routes(app) {
    this.route = app;

    this.route.post('/add-movie', require('../api/add_movie').addMovie);
    this.route.post('/find', require('../api/find').find);
}

module.exports = { routes };