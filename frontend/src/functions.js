import React from 'react'
const getStations = async () => {
    const headers = {
        'Content-Type': 'application/json',
        "Client-Identifier": "Ardoq-hjemmeoppgave"
    }
    const res = await fetch("https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json", { headers: headers })
    const data = await res.json()
    return await transformer(data.data.stations)
}

const getStationsData = async () => {
    const headers = {
        'Content-Type': 'application/json',
        "Client-Identifier": "Ardoq-hjemmeoppgave"
    }
    const res = await fetch("https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json", { headers: headers })
    const data = await res.json()
    return await transformer(data.data.stations)
}

const transformer = async (jsonArr) => {
    const output = {}
    for (const obj of jsonArr) {
        const station_id = obj.station_id;
        output[station_id] = obj;
    }
    return output
}

export const generatePopUp = (obj) => {
    console.log(obj)

    return `<div>
        <h1> ${obj.properties.title} </h1>
        ${obj.properties.availableBikes !== null && obj.properties.availableBikes !== 0 ? `<h2> <img src="/bicycle.png" height=30px /> Available Bikes: ${obj.properties.availableBikes}</h2>` : '<h2> This station does not currently have any bikes available </h2>'}
        ${obj.properties.availableDocks ? `  <h2>  <img src="parking.png" height=30px/> Available Docks: ${obj.properties.availableDocks} </h2> ` : '<h2> This station does not allow you to return bikes at present </h2>'}
    </div > `


}


const dataMerger = async (stations, stationData) => {
    const output = {}
    for (const id of Object.keys(stations)) {
        if (id in stationData) {
            output[id] = {
                information: stations[id],
                data: stationData[id]
            }
        }
    }
    return output

}

const toGeoJSON = async (obj) => {

    const features = Object.values(obj).map(entry => {
        const availableBikes = entry.data.is_renting ? entry.data.num_bikes_available : null
        const availableDocks = entry.data.is_returning ? entry.data.num_docks_available : null
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [entry.information.lon, entry.information.lat]
            },
            properties: {
                title: entry.information.name,
                capacity: entry.information.capacity,
                availableBikes,
                availableDocks,
                'marker-color': '#3bb2d0',
                'marker-size': 'medium',
                'marker-symbol': 'bicycle'
            }
        }

    })

    return { type: 'FeatureCollection', features }

}

export const getData = async () => {
    const data = await toGeoJSON(await dataMerger(await getStations(), await getStationsData()))
    return data
}