const fs = require('fs');
class FileService {
    constructor(next_id, file) {
        this.id = next_id;
        this.file = `${file}\\data\\db.json`;
    }

    async upgrade(body){
        fs.readFile(this.file, (err, jsonString) => {
            if(err){
                console.log(`ERROR ${err}`);
                return
            }

            try {
                const buffer = new Buffer.from(`${jsonString}`);
                const output = buffer.toString('utf8');

                const parse = JSON.parse(output);
                let size = parse.movies.length + 1 ;
                body.id = size;
                parse.movies.push(body);
                const beforeUpdate = JSON.stringify(parse);

                fs.writeFile(this.file, beforeUpdate, ( err)=>{
                   if(err){
                       console.log(`Save Error ${e}`)
                   }
                });

            } catch (e) {
                console.log(`ERROR ${e}`)
            }
        });
    }
}

module.exports = FileService;
