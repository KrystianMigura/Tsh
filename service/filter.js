const db = require('../data/db').movies;
const fieldEnum = require('../data/db').genres;
const { _ } = require('underscore');

class Combination {
    async getCombinations(valuesArray)
    {
        const combi = [];
        let temp = [];
        const length = valuesArray.length;
        const slent = Math.pow(2, length);
        for (let i = 0; i < slent; i++)
        {
            temp = [];
            for (let j = 0; j < length; j++)
            {
                if ((i & Math.pow(2, j)))
                {
                    temp.push(valuesArray[j]);
                }
            }
            if (temp.length > 0)
            {
                combi.push(temp);
            }
        }

        combi.sort((a, b) => b.length - a.length);
        return combi;
    }
}

class Filter {
    async setter(body) {
        this.body = body;
        this.movies = db;
        this.array_size = this.movies.length;
        this.random_id = await this.randomId(this.array_size);
        this.full_pack = [];
        return this.run();
    }

    async run() {
        const keys = Object.keys(this.body);

        if (keys && !keys.length) {
            return this.movies[this.random_id];
        } else if (keys && keys.length) {
            const resolve = await this.keysExist(keys, this.body);
            return resolve;
        }
    }

    async randomId(size) {
        return (size + Date.now())%size;
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

         if( (this.gen && this.gen.length) && ('number' === typeof this.rT) ) {
             return this.flow(this.gen, this.rT);
         } else if ( !(this.gen && this.gen.length) && ('number' === typeof this.rT) ) {
              return this.flow(null, this.rT);
         } else if ( (this.gen && this.gen.length) && ('number' !== typeof this.rT) ) {
             return this.flow(this.gen, null);
         }
    }

    async getMovieTimeAndGen(fullList, time){
        this.movies.reduce((total, next, index) => {
            const movieTime = parseInt(next.runtime);

            if(fullList === null && time !== null){
                if ((movieTime >= time - 10) && (movieTime <= time + 10)){
                    if (!this.full_pack.includes(next))
                        this.full_pack.push(next);
                }
            } else {
                fullList.forEach((n) => {
                    if (time !== null && fullList !== null) {
                        if (((_.isEqual(next.genres, n))) && ((movieTime >= time - 10) && (movieTime <= time + 10))) {
                            if (!this.full_pack.includes(next))
                                this.full_pack.push(next);
                        }
                    } else {
                        if (_.isEqual(next.genres, n)) {
                            if (!this.full_pack.includes(next)) {
                                this.full_pack.push(next);
                            }
                        }
                    }

                    n.forEach((j) => {
                        if (next.genres.includes(j)) {
                            if (!this.full_pack.includes(next))
                                this.full_pack.push(next)
                        }
                    })
                })
            }
        });

        let resolve = this.full_pack;

        resolve.sort((a,b) => { return a.genres.length - b.genres.length });
        return this.full_pack;
    }

    async flow(gen_array, time) {
        let fullList = [];
        if (gen_array && gen_array.length) {
            const test = new Combination();
            fullList = await test.getCombinations(gen_array);
            const movies = await this.getMovieTimeAndGen(fullList, time);
            return movies;
        } else if ( time !== null && (gen_array === null) ) {
            const movies = await this.getMovieTimeAndGen(null, time);
            const id = await this.randomId(this.full_pack.length);
            return this.full_pack[id];
        }
    }
}

module.exports = Filter;