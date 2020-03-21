const fs = require('fs');
class FileService {
    constructor(next_id, file) {
        this.id = next_id;
        this.file = `${file}\\data\\db.json`;
        this.resolve = { status: true, message: '' };
    }

   async upgrade(body){
        await fs.readFile(this.file, (err, jsonString) => {
            if(err){
                this.resolve = `Error ${err}`;
                return 0;
            }

            try {
                const buffer = new Buffer.from(`${jsonString}`);
                const output = buffer.toString('utf8');
                const parse = JSON.parse(output);
                let size = parse.movies.length + 1 ;
                body.id = size;
                parse.movies.push(body);
                fs.writeFile(this.file, JSON.stringify(parse, null, 2),'utf8', ( err)=>{
                    if(err){
                        this.resolve.message = `Save Error ${e}`;
                        this.resolve.status = false;
                    }
                    this.resolve.message = `success movie is added.`;
                    this.resolve.status = true;
                });
            } catch (e) {
                this.resolve.message = `Error ${e}`;
                this.resolve.status = false;
            }
        });

       return this.resolve

    }
}

module.exports = FileService;
