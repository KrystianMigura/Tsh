async function notFound(req, res) {
    res.status(404).send( { error: 'This page not found' } );
}

module.exports = { notFound };