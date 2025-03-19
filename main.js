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

const baseUrl = "https://boolean-spec-frontend.vercel.app/freetestapi/"

async function getDashboardData(query) {
    const cityResponse = await fetch(baseUrl+`destinations?search=${query}`);
    const city = await cityResponse.json();
    const weatherResponse = await fetch(baseUrl+`weathers?search=${query}`);
    const weather = await weatherResponse.json();
    const airportResponse = await fetch(baseUrl+`airports?search=${query}`);
    const airport = await airportResponse.json();

    const data = await Promise.all([city, weather, airport]);
    return data;
};

getDashboardData('london')
.then(data => {
    console.log('Dashboard data', data)
    console.log(
        `${data[0][0].name} is in ${data[0][0].country}.\n` +
        `Today there are ${data[1][0].temperature} degrees and the weather is ${data[1][0].weather_description}.\n`+
        `The main airport is ${data[2][0].name}.\n`)
})
.catch(err => console.error(err));

