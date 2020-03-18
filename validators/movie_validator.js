const fieldsEnum = {
    genres: {
        type: 'Array'
    },
    title: {
        type: 'string',
        size: 255
    },
    year: {
        type: 'number',
        size: 4
    },
    runtime: {
        type: 'number',
    },
    director: {
        type: 'string',
        size: 255
    },
    actors: {
        type: 'string'
    },
    plot: {
        type: 'string'
    },
    posterUrl: {
        type: 'string'
    }
};

class Validator {
    async run(body, db_genres, movies) {
        const { genres, title, year, runtime, director, actors, plot, posterUrl } = body;
        this.resolve_type = await this.type(genres, db_genres);
        this.resolve_title = await this.title(title);
        this.resolve_year = await this.year(year);
        this.resolve_runtime = await this.runtime(runtime);
        this.resolve_director = await this.director(director);
        this.resolve_actors = await this.actors(actors);
        this.resolve_plot = await this.plot(plot);
        this.resolve_posterUrl = await this.posterUrl(posterUrl);
        return await this.all();
    }

    async all() {
        const x = {
            type: this.resolve_type,
            title: this.resolve_title,
            year: this.resolve_year,
            runtime: this.resolve_runtime,
            director: this.resolve_director,
            actors: this.resolve_actors,
            plot: this.resolve_plot,
            posterUrl: this.resolve_posterUrl,

        };
        const resolve = {success: true};
        for(const n in x){
            const param = x[`${n}`];
            const array_type = (param instanceof Array)? await this.compareInArray(param) : param;
            if (array_type !== 'Ok') {
                resolve[`${n}`] = array_type;
                resolve.success = false
            }
        }
        return resolve;
    }

    async compareInArray(data) {
        let resolve = '';
        await data.forEach((i) => {
            if(i !== 'Ok'){
                resolve += `${i} `;
            }
        });

        return (resolve === '') ? 'Ok' : resolve;
    }

    async type(data, db_data) {
        const answer = [];
        if(!(data instanceof Array)){
            return `Error genres must be Array`;
        }

        await data.forEach((i) => {
            i = i.replace(i[0], i[0].toUpperCase());
            const bool = db_data.includes(i);
            answer.push((!bool)?`Error in geners param ${i}`:'Ok')
        });
        return answer;
    }

    async title(data) {
        const length = data.length;
        const min_max = (length > 0 && length <= 255)? length : (length === 0) ? `You don't write title size is:  ${length}`: ` ${length} char`;
        const { title: { type, size } } = fieldsEnum;
        const data_type = typeof data;
        return (min_max <= size && data_type === type) ? 'Ok' : `${min_max} , type ${data_type}`;
    }

    async year(data) {
        const  { year: { type, size } } = fieldsEnum;
        const length = `${data}`.length;
        const type_value = (type === typeof data);
        const size_value = (length <= size && length > 0);
        if (data <= 0) {
            return `You year is incorrect!`
        } else if (type_value && size_value){
            return 'Ok';
        } else if (!type_value && !size_value) {
            return `type ${typeof data} should be ${type} AND You char: ${length} max is ${size}`;
        } else if (type_value && !size_value){
            return `Year char: ${length} max is ${size}`
        } else if(!type_value && size_value){
            return `type ${typeof data} should be ${type}`;
        }
    }

    async runtime(data) {
        const { runtime: { type }} = fieldsEnum;
        return (type === typeof data && data > 0) ? 'Ok': (data <= 0)? `Wrong time ${data}` : `type is ${typeof data} should be ${type} `
    }

    async director(data) {
        const length = data.length;
        const min_max = (length > 0 && length <= 255)? length : (length === 0) ? `You don't write director size is:  ${length}`: ` ${length} char`;
        const { director: { type, size } } = fieldsEnum;
        const data_type = typeof data;
        return (min_max <= size && data_type === type) ? 'Ok' : `${min_max} , type ${data_type}`;
    }

    async checkString(data_type, type){
        return (data_type === type) ? 'Ok' : `data type is ${data_type} expected ${type}`
    }

    async actors(data) {
        const { actors : { type } } = fieldsEnum;
        const data_type = typeof data;
        return await this.checkString(data_type, type);
    }

    async plot(data) {
        const { plot : { type } } = fieldsEnum;
        const data_type = typeof data;
        return await this.checkString(data_type, type);
    }

    async posterUrl(data) {
        const { posterUrl : { type } } = fieldsEnum;
        const data_type = typeof data;
        return await this.checkString(data_type, type);
    }
}

module.exports = { Validator };