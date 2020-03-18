"user strict";
const express = require('express');
const configuration = require('./config')
const { routes } = require('./routing')
const bodyParser = require('body-parser');

class Server {
    async run (){
        this.app = express();
        this.port = 3030;
        await this.createServer();
        await routes(this.app);
    }

    async createServer() {
        this.app.use(bodyParser.json());
        this.app.listen(this.port, () => {
            console.log(`server runing on port  ${this.port}`)
        })
    }


}

const start_server = new Server();
start_server.run().catch((e) => {
    console.log(`e ${e}`)
});

module.exports = {
    server : start_server
}
