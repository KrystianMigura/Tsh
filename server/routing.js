const { post, get, put, del } = require('../data/routes');

async function routes(app) {
    this.route = app;

    if(post && post.length) {
        post.forEach((o) => {
            const {name, path, fn} = o;
            this.route.post(`${name}`, require(`${path}`)[`${fn}`]);
        });
    }

    if(get && get.length) {
        get.forEach((o) => {
            const {name, path, fn} = o;
            this.route.get(`${name}`, require(`${path}`)[`${fn}`]);
        });
    }
    if(put && put.length) {
        put.forEach((o) => {
            const {name, path, fn} = o;
            this.route.put(`${name}`, require(`${path}`)[`${fn}`]);
        });
    }

    if(del && del.length) {
        del.forEach((o) => {
            const {name, path, fn} = o;
            this.route.delete(`${name}`, require(`${path}`)[`${fn}`]);
        });
    }
}

module.exports = { routes };