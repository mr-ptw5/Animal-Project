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
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        // redirect: 'follow', // manual, *follow, error
        // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
      })
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            console.log(data)
            data.results = data.results.sort(sortByClade)
            let list = document.querySelector('ul')

            while (list.firstChild) {
                list.removeChild(list.firstChild)
            }
            // const names = [...new Set(data.results.map(creature => creature.primaryCommonName))]
            const creatures = data.results.map(creature => {
                let species = creature.scientificName.split(' ').slice(1).join(' ')
                return {
                    name: creature.primaryCommonName,
                    phylum: creature.speciesGlobal.phylum,
                    class: creature.speciesGlobal.taxclass,
                    order: creature.speciesGlobal.taxorder,
                    family: creature.speciesGlobal.family,
                    genus: creature.speciesGlobal.genus,
                    species: species
                }
            })
            console.log(`${data.results.length} results, ${creatures.length} after being whittled down`)
            console.log(data.results)


            creatures.forEach(creature => {
                let elem = document.createElement('li')
                let span = document.createElement('span')
                span.textContent = `${creature.name} ...... ${creature.order} ${creature.family} ${creature.genus} ${creature.species}`
                elem.appendChild(span)
                list.appendChild(elem)
            })
        //   document.querySelector('img').src = data.message
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
}

function sortByClade(a, b) {
    const hierarchy = ['phylum', 'class', 'order', 'family', 'genus']
    a = a.speciesGlobal
    b = b.speciesGlobal
    for (clade of hierarchy) {
        if (a[clade] !== b[clade])
            return a[clade].localeCompare(b[clade])
    }
    return 0
}