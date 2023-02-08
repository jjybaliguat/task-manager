const notFound = (req,res) => {return res.status(404)
    .send('<h1>Oopss..seems the route your looking for dos not exist.</h1>')}

module.exports = notFound