const db = require('../data/db').movies;
const fieldEnum = require('../data/db').genres;
const { _ } = require('underscore');

class Filter {
    async setter(body) {
        this.body = body;
        this.movies = db;
        this.array_size = this.movies.length;
        this.random_id = await this.randomId();
        this.full_pack = {};
        return this.run();
    }

    async run() {
        const keys = Object.keys(this.body);

        if (keys && !keys.length) {
            return this.movies[this.random_id];
        } else if (keys && keys.length) {
            const resolve = await this.keysExist(keys, this.body);
        }
    }

    async randomId() {
        return (this.array_size + Date.now())%this.array_size;
    }


    async keysExist(keys, body) {
        this.gen = [];
        this.rT = {};
         await keys.forEach((i) => {
             if (i.toLowerCase() === 'genres') {
               this.gen = body[`${i}`];
             }

             if(i.toLowerCase() === 'runtime'){
                 this.rT = body[`${i}`];
             }
        });

         if((this.gen && this.gen.length) && ('number' === typeof this.rT)){
             return this.flow(this.gen, this.rT);
         } else if (!(this.gen && this.gen.length) && ('number' === typeof this.rT)) {
              return this.flow(null, this.rT);
         } else if ((this.gen && this.gen.length) && ('number' !== typeof this.rT)){
             return this.flow(this.gen, null);
         }
    }

    async flow(gen_array, time) {
        let pack = {};
        let options = '';

        //split to small 
        this.movies.reduce((total, next, index) => {
           if (_.isEqual(next.genres, gen_array )){
               this.full_pack[`${index}`] = next;
           }
        });
        console.log(this.full_pack)
        console.log(gen_array ," " , time)
    }



    /*
    //option += ` (${`param`} -10 >= ${body[`${i}`] - 10}) && (${`param`} + 10 <= ${body[`${i}`]})`;
                 if (i.toLowerCase() === 'runtime') {
            const min = body[`${i}`] - 30;
            const max = body[`${i}`] + 30;

            const movie = this.movies.reduce((total, next, prew, a) => {
               let param = parseInt(next.runtime);
               if(param -10 >= min && param + 10 <= max){
                   console.log(next)
               }
            });
        }
     */
}

module.exports = Filter;