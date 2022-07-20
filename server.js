const { response } = require('express')
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const app = express()
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
app.use(express.static('public'))
app.use(express.json())



app.get('/', (req, res) => {
    getBirdData(req.query)
    .then(data => {
        const creatures = tidyCreatureData(data)
        creatures.sort(sortByClade)
        res.render('index.ejs', {birds: creatures})
    })
    .catch(err => console.log(err))
})

app.get('/loginput', (req, res) => {
    res.sendFile(__dirname + '/loginput.html')
})

app.get('/api/birddata', (req, res) => {
    getBirdData(req.query)
    .then(data => {
        const creatures = tidyCreatureData(data)
        creatures.sort(sortByClade)
        res.render('index.ejs', {birds: creatures})
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


function getBirdData() {
    return birdCollection.find().toArray()
}

function getBirdDataFromNatureServe(input) {

    //format input data
    let data = {
        "criteriaType": "species",
        "textCriteria": [],
        "statusCriteria": [],
        "pagingOptions": {
            "page": null,
            "recordsPerPage": 2000
        },
        "recordSubtypeCriteria": [],
        "modifiedSince": null,
        "locationOptions": null,
        "classificationOptions": null,
        "speciesTaxonomyCriteria": [
            {
                "paramType": "scientificTaxonomy",
                "level": "class",
                "scientificTaxonomy": "aves",
                "kingdom": "animalia"
            }
        ]
    }

    if (input.state) {
        data.locationCriteria = [{
            "paramType": "subnation",
            "subnation": input.state,
            "nation": "US"
        }]
    }


    const url = 'https://explorer.natureserve.org/api/data/speciesSearch'
    return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    })
        .then(res => res.json()) // parse response as JSON
        .then(data => data.results)
        .then(data => {
            birdCollection.insertMany(data)
            return data
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
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
            species: creature.scientificName.split(' ').slice(1).join(' ')
        }
        return {
            phylumAndClass: `${classification.phylum} ${classification.class}`,
            usefulName: `${classification.order} ${classification.family} ${classification.genus} ${classification.species}`,
            commonName: classification.name
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

*/