//html elements

//api links


//global variables
var now = dayjs();
var latitude;
var longitude;
// var apiKey = '27f987ed5ee13dd96fdf2948248ce840';
var searchHistory = [];


//function - reset (text of city, local time, current weather info, 5-day dates+weather info text is empty)


//function - render time on page
function todayDateRender() {
    setInterval(function() {
        $('#current-date').text(now.format('MM. DD. YYYY'));
    }, 1000)
}

//function - invalid search


//fetch - geocoding api
function fetchCoordinates() {
    var citySearch = $('#input-location').val().trim();

    var geocodeURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + citySearch + '&appid=27f987ed5ee13dd96fdf2948248ce840';
    console.log(geocodeURL);

    fetch(geocodeURL)
        .then(function(response) {
            return response.json();
        })
        .then (function(data) {
            console.log(data);

            if (data.length === 0) {
                console.log('invalid input')
            } else {
                console.log('success')

                latitude = data[0].lat;
                longitude = data[0].lon;

                return (latitude, longitude)
            }

            // nest render function here
            renderCurrentWeather();
        });
}

//fetch - render weather onto page (might have to nest fetch within fetch) & create history button
function renderCurrentWeather() {
    var units = $('#select-units').val();

    var currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&units' + units + '&appid=27f987ed5ee13dd96fdf2948248ce840'

    fetch(currentWeatherURL)
        .then(function(response) {
            return response.json()
        })
        .then (function(data) {
            console.log(data);
            
            $('#city').text(data.name);

            setInterval(function() {
                var localTime = data.dt;

                $('#local-time').text(now.unix(localTime++).format('HH:mm'))
            }, 1000);

            $('#current-temp').text(data.main.temp + '°');
            $('#feels-like').text(data.main.feels_like + '°');
            $('#current-humidity').text(data.main.humidity + '%');
            $('#current-temp').text(data.wind.speed + ' mph');
        })
}

// fetch - five day forecast

//fetch - render weather onto page when past searches list is clicked


//init function - display time
function init() {
    todayDateRender();
}


//=======================================================

init();

//click function - show current weather
$('#search-btn').submit(function(event) {
    event.preventDefault;

    fetchCoordinates();
})

//click function - show past searches