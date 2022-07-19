const { response } = require('express')
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const app = express()
require('dotenv').config()
const PORT = 8000
const connectionStr = `mongodb+srv://wetterdewbb:${process.env.MONGODB_PW}@cluster0.y7idt.mongodb.net/?retryWrites=true&w=majority`

let db,
dbName = 'bird-data'

MongoClient.connect(connectionStr)
.then(client => {
    db = client.db(dbName)
    console.log('connected to the database')
})
.catch (err => {
    console.log(`problem: ${err}`)
})

app.use(express.static('public'))
app.use(express.json())

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
})

app.get('/loginput', (req, res) => {
    res.sendFile(__dirname + '/loginput.html')
})

app.get('/api/birddata', (req, res) => {
    let result = getBirdData(req.query)
        .then(data => res.json(data))
})

app.post('/api/addNote', (req, res) => {
    console.log(`adding note: ${req.body.note}`)
    res.json({note: req.body.note})
})



app.listen(process.env.PORT || PORT, () => {
    console.log(`the server is running on port ${PORT}`)
})


function getBirdData(input) {

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
    //fetch the POST request and return the data


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
        .then(data => {
            const creatures = tidyCreatureData(data.results)
            creatures.sort(sortByClade)
            console.log(`${creatures.length} creatures found in ${input.state}`)
            return {
                list: creatures,
                location: input.state || 'America'
            }
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}


function tidyCreatureData(data) {
    const creatures = data.map(creature => {
        return {
            name: creature.primaryCommonName,
            phylum: creature.speciesGlobal.phylum,
            class: creature.speciesGlobal.taxclass,
            order: creature.speciesGlobal.taxorder,
            family: creature.speciesGlobal.family,
            genus: creature.speciesGlobal.genus,
            species: creature.scientificName.split(' ').slice(1).join(' ')
        }
    })
    return creatures
}

function sortByClade(a, b) {
    // const hierarchy = ['phylum', 'class', 'order', 'family', 'genus', 'species']
    a = `${a.phylum} ${a.class} ${a.order} ${a.family} ${a.genus} ${a.species}`
    b = `${b.phylum} ${b.class} ${b.order} ${b.family} ${b.genus} ${b.species}`
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