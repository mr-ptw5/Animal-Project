let data = {
    "criteriaType" : "species",
    "textCriteria" : [
        
    ],
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
    "level" : "class",      //options: KINGDOM,PHYLUM,CLASS,ORDER,FAMILY,GENUS (species unavailable)
    "scientificTaxonomy" : "aves",
    "kingdom" : "animalia"
          }
      ]
  }
  

document.querySelector('img').addEventListener('click', getFetch)

function getFetch(){
    const url = 'https://explorer.natureserve.org/api/data/speciesSearch'
    const location = document.querySelector('input').value
    if (location)
        data.locationCriteria = [{
            "paramType" : "subnation",
            "subnation" : location,
            "nation" : "US"
          }]
    else
        delete data.locationCriteria
    console.log(data)
  
    fetch(url, {
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
            console.log(data)
            
            const creatures = tidyCreatureData(data.results)
            creatures.sort(sortByClade)
            emptyBirdList()
            fillBirdList(creatures)
            console.log(`${data.results.length} results, ${creatures.length} after being whittled down`)
            console.log(creatures)


            
        //   document.querySelector('img').src = data.message
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}

function sortByClade(a, b) {
    const hierarchy = ['phylum', 'class', 'order', 'family', 'genus', 'species']
    a = `${a.phylum} ${a.class} ${a.order} ${a.family} ${a.genus} ${a.species}`
    b = `${b.phylum} ${b.class} ${b.order} ${b.family} ${b.genus} ${b.species}`
    return a.localeCompare(b)
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

function emptyBirdList() {
    const list = document.querySelector('ul')
            while (list.firstChild) {
                list.removeChild(list.firstChild)
            }
}

function fillBirdList(creatures) {
    const list = document.querySelector('ul')
    creatures.forEach(creature => {
        let elem = document.createElement('li')
        let span = document.createElement('span')
        span.textContent = `${creature.name} ...... ${creature.order} ${creature.family} ${creature.genus} ${creature.species}`
        elem.appendChild(span)
        list.appendChild(elem)
    })
}