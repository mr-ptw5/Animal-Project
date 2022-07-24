const express = require('express')
const MongoClient = require('mongodb').MongoClient
const app = express()
app.use(express.static('public'))
app.use(express.json())
app.set('view-engine', 'ejs')
require('dotenv').config()
const PORT = 8000
const connectionStr = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PW}@cluster0.y7idt.mongodb.net/?retryWrites=true&w=majority`

let db,
birdCollection,
dbName = 'bird-data'

MongoClient.connect(connectionStr)
.then(client => {
    db = client.db(dbName)
    birdCollection = db.collection('bird-data')
    console.log('connected to the database')
})
.catch (err => {
    console.log(`problem: ${err}`)
})



app.get('/', (req, res) => {
    getBirdData()
    .then(data => {
        const creatures = tidyCreatureData(data)
        creatures.sort(sortByClade)
        console.log('initial pageload example data:', creatures[0])
        res.render('index.ejs', {birds: creatures})
    })
    .catch(err => console.log(err))
})

app.get('/loginput', (req, res) => {
    res.sendFile(__dirname + '/loginput.html')
})

app.get('/api/birds', (req, res) => {
    getBirdData(req.query)
    .then(data => {
        const creatures = tidyCreatureData(data)
        creatures.sort(sortByClade)
        console.log('parameter selected, example data:', creatures[0])
        res.render('index.ejs', {birds: creatures})
        // res.json(creatures)
    })
    .catch(err => console.log(err))
})

app.post('/api/addNote', (req, res) => {
    console.log(`adding note: ${req.body.note}`)
    birdCollection.insert([req.body, {note: 'first'}, {note: 'second'}, {note: 'ok now'}])
    .then(result => res.json({redirect: '/'}))
    .catch(err => console.log(err))
})

app.delete('/api/clearItems', (req, res) => {
    birdCollection.deleteMany({})
    .then(result => res.send({redirect: '/'}))
    .catch(err => console.log(err))
})



app.listen(process.env.PORT || PORT, () => {
    console.log(`the server is running on port ${PORT}`)
})

function getBirdData(query = {}) {
    const locationParameter = query.state ? {
        "nations.subnations.subnationCode": query.state
    }
    : {}
    return birdCollection.find(locationParameter).toArray()
}


function tidyCreatureData(data) {
    const creatures = data.map(creature => {
        const classification = {
            name: creature.primaryCommonName,
            phylum: creature.speciesGlobal.phylum,
            class: creature.speciesGlobal.taxclass,
            order: creature.speciesGlobal.taxorder,
            family: creature.speciesGlobal.family,
            genus: creature.speciesGlobal.genus,
            species: creature.scientificName.split(' ').slice(1).join(' '),
        }
        return {
            phylumAndClass: `${classification.phylum} ${classification.class}`,
            usefulName: `${classification.order} ${classification.family} ${classification.genus} ${classification.species}`,
            commonName: classification.name,
            id: creature._id
        }
    })
    return creatures
}

function sortByClade(a, b) {
    a = `${a.phylumAndClass} ${a.usefulName}`
    b = `${b.phylumAndClass} ${b.usefulName}`
    return a.localeCompare(b)
}




//receive 
/*
bird sighting
    coordinate?
    bird species?
    notes?
    photo
    maybe behavior

new filter



get requests
get list of birds for the filter criteria

get data for a bird
    list of sightings
    list of photos
    
login data


*/