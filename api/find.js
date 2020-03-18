const Find = require('../service/filter');

async function find(req, res) {
    const find = new Find();
    const callback = await find.setter(req.body);
    res.send(callback);
}

module.exports = { find };