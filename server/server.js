const express = require('express');
const { routes } = require('./routing');
const bodyParser = require('body-parser');

class Server {
    async run (){
        this.app = express();
        this.port = process.env.PORT || 8080;
        await this.createServer();
        await routes(this.app);
    }

    async createServer() {
        this.app.use((req, res, next) => {
            res.setHeader("Content-Type", "application/json");
            res.setHeader(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept"
            );
            next();
        });
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json({ type: 'application/json' }));
        this.app.use(bodyParser.json({ limit: '50mb'}));
        this.app.listen(this.port || 3030, () => {
            console.log(`server runing on port  ${this.port}`)
        });
    }
}

const run_server = new Server();
run_server.run().catch((e) => {
    console.log(`Global Error ${e}`)
});

module.exports = {
    server : run_server
};
