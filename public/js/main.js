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
  

document.querySelector('img').addEventListener('click', callData)

function callData() {
    let url = '/api/birddata'
    const paramsObj = {state: 'TX'}
    const searchParams = new URLSearchParams(paramsObj)
    // fetch(`${url}&${searchParams.toString()}`, {
        fetch(`/api/birddata`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
        // body: JSON.stringify(data) // body data type must match "Content-Type" header
      })
        .then(res => res.json() )// res.json()) // parse response as JSON
        .then(data => {
            console.log(data, "long")
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}

function getFetch(){
    const location = document.querySelector('input').value
    if (location)
        data.locationCriteria = [{
            "paramType" : "subnation",
            "subnation" : location,
            "nation" : "US"
          }]
    else
        delete data.locationCriteria
  
    fetch('/api/birddata', {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
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