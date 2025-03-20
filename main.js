// Per accedere all'API utilizzare l'url base: https://boolean-spec-frontend.vercel.app/freetestapi

// In questo esercizio, utilizzerai Promise.all() per creare la funzione getDashboardData(query), che accetta una città come input e recupera simultaneamente:
/*
Nome completo della città e paese da  /destinations?search={query}
(result.name, result.country, nelle nuove proprietà city e country).
Il meteo attuale da /weathers?search={query}
(result.temperature e result.weather_description nella nuove proprietà temperature e weather).
Il nome dell’aeroporto principale da /airports?search={query}
(result.name nella nuova proprietà airport).
*/

// Utilizzerai Promise.all() per eseguire queste richieste in parallelo e poi restituirai un oggetto con i dati aggregati.

// Attenzione: le chiamate sono delle ricerche e ritornano un’array ciascuna, di cui devi prendere il primo risultato (il primo elemento).

/* Note del docente
Scrivi la funzione getDashboardData(query), che deve:
Essere asincrona (async).
Utilizzare Promise.all() per eseguire più richieste in parallelo.
Restituire una Promise che risolve un oggetto contenente i dati aggregati.
Stampare i dati in console in un messaggio ben formattato.
Testa la funzione con la query "london"
*/

const baseUrl = "https://boolean-spec-frontend.vercel.app/freetestapi"

async function getDashboardData(query) {
    try{
        const destinationPromise = fetch(baseUrl+`/destinations?search=${query}`)
   .then(response => response.json());

   const weatherPromise = fetch(baseUrl+`/weathers?search=${query}`)
   .then(response => response.json());

   const airportPromise = fetch(baseUrl+`/airports?search=${query}`)
   .then(response => response.json());

   const data = await Promise.all([destinationPromise, weatherPromise, airportPromise])
   
   const destinations = data[0];
   const weathers = data[1];
   const airports = data[2];

   return {
    name : destinations[0].name,
    country: destinations[0].country,
    temperature: weathers[0].temperature,
    weather: weathers[0].weather_description,
    airport: airports[0].name

   }
    } catch(error) {
        throw new Error('Could not get data:', error)
    }
   
};

getDashboardData('london')
.then(data => {
    console.log('Dashboard data:', data)
    console.log(
      `${data.name} is in ${data.country}.\n` +
      `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n`+
      `The main airport is ${data.airport}.\n`)
})
.catch(err => console.error(err));


// Bonus 1 - Risultato vuoto

// Se l’array di ricerca è vuoto, invece di far fallire l'intera funzione, semplicemente i dati relativi a quella chiamata verranno settati a null e  la frase relativa non viene stampata. Testa la funzione con la query “vienna” (non trova il meteo).

async function fetchJson(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

async function getDashboardDataNull(query) {
    try {
        const destinationPromise = fetchJson(baseUrl+`/destinations?search=${query}`);
    const weatherPromise = fetchJson(baseUrl+`/weathers?search=${query}`);
    const airportPromise = fetchJson(baseUrl+`/airports?search=${query}`);

    const promises = [destinationPromise, weatherPromise, airportPromise];
    const [destinations, weathers, airports] = await Promise.all(promises);

    const destination = destinations[0];
    const weather = weathers[0];
    const airport = airports[0]

    return {
      city : destination ? destinations[0].name : null,
      country: destination ? destinations[0].country : null,
      temperature:weather ? weathers[0].temperature : null,
      weather: weather ? weathers[0].weather_description : null,
      airport: airport ? airports[0].name : null
      }
    } catch(error) {
        throw new Error('Could not get data:', error)
    }
    
}

getDashboardDataNull('vienna')
.then(data => {
    console.log('Dashboard data:', data);
    let message = '';
    const {city, country, temperature, weather, airport} = data

    if(city !== null && country !== null){
        message += `${city} is in ${country}.\n`;
    }
    if(temperature !== null && weather !== null) {
        message += `Today there are ${temperature} degrees and the weather is ${weather}.\n`;
    }
    if(airport !== null) {
        message += `The main airport is ${airport}.\n`;
    }
    console.log(message);
})
.catch(err => console.error(err));


// Bonus 2 - Chiamate fallite
// Attualmente, se una delle chiamate fallisce, **Promise.all()** rigetta l'intera operazione.

// Modifica `getDashboardData()` per usare **Promise.allSettled()**, in modo che:
// Se una chiamata fallisce, i dati relativi a quella chiamata verranno settati a null.
// Stampa in console un messaggio di errore per ogni richiesta fallita.
// Testa la funzione con un link fittizio per il meteo (es. https://www.meteofittizio.it).

async function getDashboardDataSettled(query) {
    try {
        const destinationPromise = fetchJson(baseUrl+`/destinations?search=${query}`);
        const weatherPromise = fetchJson(baseUrl,`/fakeweathers?search=${query}`);
        const airportPromise = fetchJson(baseUrl+`/airports?search=${query}`);

        const promises = [destinationPromise, weatherPromise, airportPromise];
        const [destinations, weathers, airports] = await Promise.allSettled(promises);

        const data = {};
        
        if(destinations.status === 'fulfilled') {

            const destination = destinations.value[0];
            data.city= destination?.name ?? null;
            data.country = destination?.country ?? null;

        } else {

            console.error('Error in destination: ', destinations.reason)
            data.city = null;
            data.country = null;

        }
        if(weathers.status === 'fulfilled') {

            const weather = weathers.value[0];
            data.temperature = weather?.temperature ?? null;
            data.weather = weather?.weather_description ?? null;

        } else {

            console.error('Error in weather: ', weathers.reason)
            data.temperature = null;
            data.weather = null;
            
        }
        if(airports.status === 'fulfilled') {
            const airport = airports.value[0];
            data.airport = airport?.name ?? null;
        } else {
            console.error('Error in airport: ', airports.reason)
            data.airport = null;
        }

        return data;

    } catch(error) {
        throw new Error('Could not get data:', error)
    }
    
}

getDashboardDataSettled('london')
.then(data => {
    console.log('Dashboard data:', data);
    let message = '';
    const {city, country, temperature, weather, airport} = data

    if(city !== null && country !== null){
        message += `${city} is in ${country}.\n`;
    }
    if(temperature !== null && weather !== null) {
        message += `Today there are ${temperature} degrees and the weather is ${weather}.\n`;
    }
    if(airport !== null) {
        message += `The main airport is ${airport}.\n`;
    }
    console.log(message);
})
.catch(err => console.error(err));