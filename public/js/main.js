const url = '/api'
document.querySelector('img').addEventListener('click', callData)
document.querySelector('section input + button').addEventListener('click', sendNote)

function callData() {
    const queryParams = getQueryParametersString()

    fetch(url + '/birdData' + queryParams, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())// res.json()) // parse response as JSON
        .then(data => {
            emptyBirdList()
            populateBirdList(data.list)
            updateMessage(data)
                })
        .catch(err => {
            console.log(`error ${err}`)
        });
}


function getQueryParametersString() {
    const paramsObj = {}
    const locationElem = document.querySelector('select')

    if (locationElem.value) {
        paramsObj.state = locationElem.value
    }
    const searchParams = new URLSearchParams(paramsObj)
    return searchParams ? `?${searchParams}` : ''
}

function updateMessage (data) {
    const location = data.location
    const count = data.list.length
    document.querySelector('h1').textContent = `${count} birds in ${location}`
}

function emptyBirdList() {
    const list = document.querySelector('ul')
    while (list.firstChild) {
        list.removeChild(list.firstChild)
    }
}

function populateBirdList(creatures) {
    const list = document.querySelector('ul')
    creatures.forEach(creature => {
        let elem = document.createElement('li')
        let span = document.createElement('span')
        span.textContent = `${creature.name} ...... ${creature.order} ${creature.family} ${creature.genus} ${creature.species}`
        elem.appendChild(span)
        list.appendChild(elem)
    })
}

function sendNote () {
    const note = document.querySelector('section input').value
    fetch(url + '/addNote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({note: note})
    })
        .then(res => res.json())// res.json()) // parse response as JSON
        .then(response => {
            console.log(response)
                })
        .catch(err => {
            console.log(`error ${err}`)
        });
}