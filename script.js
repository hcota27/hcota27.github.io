const searchBar = document.getElementById('search-bar');
const searchButton = document.getElementById('search-button');
const documentCity = document.getElementById('city');
const weatherIcon = document.getElementById("weather-icon");
const documentTime = document.getElementById("time");
const documentTemperature = document.getElementById("temperature");
const suggestionList = document.getElementById("suggestion-list");
const currentWeatherIcon = document.getElementById('weather-icon');
let listItems = document.getElementsByClassName('list-item');
let userLatitude;
let userLongitude;
const APIKey = "02f5e6324a51623164a378283b5eb303";


async function getUserLocation() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const userCoordinates = [{
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                }];
                resolve(userCoordinates);
            });
        } else {
            reject("Geolocation is not supported by this browser.");
        }
    });
}


function unixToHours(unixTime) {
    unixTimeMiliseconds = unixTime * 1000;
    regularTime = new Date(unixTimeMiliseconds);
    const dateString = regularTime.toUTCString();
    return(dateString)

};


function getCoordinates(searchValue) {
    return fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchValue},&limit=5&appid=${APIKey}`)
        .then(res => res.json())
        .then(data => {
            return data
        });
};

function getWeatherData(coordinateData) {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinateData[0].lat}&lon=${coordinateData[0].lon}&appid=${APIKey}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            const weatherData = {
                country: data.sys.country,
                city: data.name,
                time: unixToHours(data.dt),
                temperature: (data.main.temp - 273.15).toFixed(0),
                description: data.weather[0].description
            };
            return weatherData;
        });
};

function updateIcon(weatherData) {
        const weatherIcons = {
            'clear sky': 'images/sun-icon.png',
            'few clouds': 'images/cloudy-icon.png',
            'scattered clouds': 'images/partly-cloudy-icon.png',
            'broken clouds': 'images/partly-cloudy-icon.png',
            'overcast clouds': 'images/partly-cloudy-icon.png',
            'shower rain': 'images/heavy-rain-icon.png',
            'rain': 'images/normal-rain-icon.png',
            'thunderstorm': 'images/thunderstorm-icon.png' ,
            'snow': 'images/snow-icon.png',
            'mist': 'images/mist-icon.png',
            'light rain': 'images/normal-rain-icon.png',
            'moderate rain': 'images/normal-rain-icon.png'
        }

        weatherDescription = weatherData.description;
        iconToBeUsed = weatherIcons[weatherDescription];
        currentWeatherIcon.src = iconToBeUsed;
    }

function updatePage(weatherData) {
    documentCity.textContent = `${weatherData.city}, ${weatherData.country}`;
    documentTime.textContent = weatherData.time;
    documentTemperature.textContent = `${weatherData.temperature} \u00B0C`
    updateIcon(weatherData);
};

async function initialize() {
    const userCoordinates = await getUserLocation();
    const weatherData = await getWeatherData(userCoordinates);
    updatePage(weatherData);
};

function addClickTolistItem() {
     for (let i = 0; i < listItems.length; i++){
        listItems[i].addEventListener('click', async () => {
        const searchValue = listItems[i].textContent;
        const coordinateData = await getCoordinates(searchValue);
        const weatherData = await getWeatherData(coordinateData);
        updatePage(weatherData);
        suggestionList.innerHTML = '';
        });
    };
};
initialize();
searchButton.addEventListener('click', async () => {
    const searchValue = searchBar.value;
    const coordinateData = await getCoordinates(searchValue);
    const weatherData = await getWeatherData(coordinateData);
    updatePage(weatherData);
    suggestionList.innerHTML = '';
 });


 searchBar.addEventListener('input', async () => {
    const searchValue = event.target.value;
    try {
        const suggestionCoordinates = await getCoordinates(searchValue);
        suggestionList.innerHTML ='';
        for (let i = 0; i < suggestionCoordinates.length; i++) {
            const newListItem = document.createElement('li');
            newListItem.textContent = `${suggestionCoordinates[i].name}, ${suggestionCoordinates[i].country}`;
            newListItem.classList.add('list-item');
            suggestionList.appendChild(newListItem);
            listItems = document.getElementsByClassName('list-item');
            addClickTolistItem();
        }
    } catch(error) {
        suggestionList.innerHTML = '';
        console.log('no suggestions retrived')
    }
 });





