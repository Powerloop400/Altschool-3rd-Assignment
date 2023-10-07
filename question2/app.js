const express = require('express')
const path = require('path')
const PORT = 3000
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(express.static('public'))
const itemsDbPath = path.join(__dirname,'db', 'items.json')

app.get('/items', (req, res) => {
    fs.readFile(itemsDbPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error')
        } else {
            res.send(data)
        }
    })
})

app.post('/items', (req, res) => {
    fs.readFile(itemsDbPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error')
        } else {
            const items = JSON.parse(data)
            const item = req.body
            item.id = items.length + 1
            items.push(item)
            fs.writeFile(itemsDbPath, JSON.stringify(items, null, 2), (err) => {
                if (err) {
                    res.status(500).send('Internal Server Error')
                } else {
                    res.send(item)
                }
            })
        }
    })
})

app.get('/items/:id', (req, res) => {
    fs.readFile(itemsDbPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Internal Server Error')
        } else {
            const items = JSON.parse(data)
            const item = items.find(item => item.id === parseInt(req.params.id))
            if (item) {
                res.send(item)
            } else {
                res.status(404).send('Item not found')
            }
        }
    })
})

app.put('/items', (req, res) => {
    fs.readFile(itemsDbPath, 'utf8', (err, data) => {
        if (err){
            console.log(err)
            res.status(500).send('Internal Server Error')
        }
        
        const items = JSON.parse(data)
        const itemIndex = items.findIndex(item => item.id === req.body.id)
        
        if (itemIndex === -1){
                console.log('Item not found')
                res.status(404).send('Item not found')
        }
        const updatedItem = {...items[itemIndex], ...req.body}
        items[itemIndex] = updatedItem

        fs.writeFile(itemsDbPath, JSON.stringify(items, null, 2), (err) => {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            }
            res.send(updatedItem)
        })
    })
})

app.delete('/items/:id', (req, res) => {
    fs.readFile(itemsDbPath, 'utf8', (err, data) => {
        if (err){
            console.log(err)
            res.status(500).send('Internal Server Error')
        }
        const items = JSON.parse(data)
        const itemIndex = items.findIndex(item => item.id === parseInt(req.params.id))
        items.splice(itemIndex, 1)
        fs.writeFile(itemsDbPath, JSON.stringify(items, null, 2), (err) => {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            }
            res.send('Item deleted')
        })
    })
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})