//html elements

//api links


//global variables
var now = dayjs();
var latitude;
var longitude;
var cityName;
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
                cityName = data[0].name;

                renderCurrentWeather();
            }

            // nest render function here
            
        });
}

//fetch - render weather onto page (might have to nest fetch within fetch) & create history button
function renderCurrentWeather() {
    // fetchCoordinates();
    var units = $('#select-units').val();

    var currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&units=' + units + '&appid=27f987ed5ee13dd96fdf2948248ce840'

    fetch(currentWeatherURL)
        .then(function(response) {
            return response.json()
        })
        .then (function(data) {
            console.log(data);
            
            $('#city').text(cityName);
            $('<button class="past-search">' + cityName + '</button>').appendTo('#search-list');

            var localTime = data.dt;
            $('#local-time').text(dayjs(localTime).format('HH:mm'));

            console.log(typeof data.dt);

            $('#current-icon').attr('src', 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png');
            $('#current-icon').attr('alt', data.weather[0].description);
            $('#current-temp').text(data.main.temp + '°');
            $('#feels-like').text(data.main.feels_like + '°');
            $('#current-humidity').text(data.main.humidity + '%');
            $('#current-wind').text(data.wind.speed + ' mph');
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
$('#search-btn').click(function(event) {
    event.preventDefault();

    fetchCoordinates();

    console.log('i am being clicked');
})

//click function - show past searches