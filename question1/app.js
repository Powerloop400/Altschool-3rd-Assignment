const express = require('express')
const path = require('path')
const PORT = 3000
const app = express()

app.use(express.static('public'))

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.use((req, res) => {
    res.status(404).end('404 Not Found')
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})