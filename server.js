const { response } = require('express')
const express = require('express')
const app = express()
const PORT = 8000

app.use(express.static('public'))

app.get('/', (request, response) => {
    response.sendFile(__dirname + '/index.html')
})

app.get('/loginput', (req, res) => {
    res.sendFile(__dirname + '/loginput.html')
})

app.get('/api/birddata', (req, res) => {
    const url = 'https://explorer.natureserve.org/api/data/speciesSearch'
    let data = {
        "criteriaType" : "species",
        "textCriteria" : [ ],
        "statusCriteria" : [ ],
        "pagingOptions" : {
          "page" : null,
          "recordsPerPage" : 2000
        },
        "recordSubtypeCriteria" : [ ],
        "modifiedSince" : null,
        "locationOptions" : null,
        "classificationOptions" : null,
        "speciesTaxonomyCriteria" : [
             {
        "paramType" : "scientificTaxonomy",
        "level" : "class",
        "scientificTaxonomy" : "aves",
        "kingdom" : "animalia"
              }
          ]
      }
    res.json(data)
})



app.listen(process.env.PORT || PORT, () => {
    console.log(`the server is running on port ${PORT}`)
})





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