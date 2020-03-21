const { Validator } = require('../validators/movie_validator');
const FileService = require('../service/FileService');
let { genres, movies } = require('../data/db');
const path = require('path');
const configFile = path.join(__dirname);

async function addMovie(req, res){
    next_id = movies.length + 1;
    let add_new_movie = new AddMovie();
    const callback = await add_new_movie.set(req.body);

    setTimeout(() => {
        res.send(callback);
    },1000)
}

class AddMovie {
    async set(data){
        this.resolve = { status: true, message: '' };
        this.body = data;
        this.valid = new Validator();
        let test = {status : true, message: 'Movie is added to Db.'};
        const resolve = await this.valid.run(this.body, genres, movies);
        if (resolve.success) {
            const updateFile = new FileService(next_id, path.dirname(configFile));
            const info = await updateFile.upgrade(this.body);
               setTimeout(() => {
                   this.resolve.status = info.status;
                   this.resolve.message = info.message;
               },500)
            //get index compare in existing movie add movie to file save file try catch !!!
        } else {
            test.status = false;
            test.message = 'valid error!'
        }
        return this.resolve
    }
 }

module.exports = { addMovie };