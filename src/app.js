// Requires
const express = require('express')
const cors = require('cors')
const ConnectionService = require('./Services/ConnectionService')

// Routes
const routes = require('./Routes/Routes');

const port = 3001;
const app = express()

// Define onde está o banco de dados que será usado
ConnectionService.setDatabase(__dirname + '/../Database.db');

app.use(cors())
app.use(express.json())

app.use(routes)

app.listen(process.env.PORT || port, async () => {
    console.log(`Server escutando a porta ${process.env.PORT || port} http://localhost:${port}`)
})