const { Validator } = require('../validators/movie_validator');
const FileService = require('../service/FileService');
let { genres, movies } = require('../data/db');
const path = require('path');
const configFile = path.join(__dirname);

async function addMovie(req, res){
    next_id = movies.length + 1;
    let add_new_movie = new AddMovie();
    const resolve = await add_new_movie.set(req.body);
    res.send(resolve);
}

class AddMovie {
    async set(data){

        this.body = data;
        this.valid = new Validator();
        const resolve = await this.valid.run(this.body, genres, movies);

        if (resolve.success) {
            const updateFile = new FileService(next_id, path.dirname(configFile));
            await updateFile.upgrade(this.body);

            //get index compare in existing movie add movie to file save file try catch !!!
        } else {
            return resolve
        }
    }
 }

module.exports = { addMovie };