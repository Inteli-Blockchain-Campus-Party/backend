// Requires
const express = require('express')
const ConnectionService = require('./Services/ConnectionService')

// Routes
const routes = require('./Routes/Routes');

const port = 3001;
const app = express()

// Define onde está o banco de dados que será usado
ConnectionService.setDatabase('./../Database.db');

app.use(express.json())

app.use(routes)

app.listen(port, async () => {
    console.log(`Server escutando a porta ${port} http://localhost:${port}`)
})