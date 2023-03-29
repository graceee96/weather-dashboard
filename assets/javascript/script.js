//html elements

//api links


//global variables
var now = dayjs();
var latitude;
var longitude;
var cityName;
var units = $('#select-units').val();
// var apiKey = '27f987ed5ee13dd96fdf2948248ce840';
var searchHistory = [];

//function - render time on page
function todayDateRender() {
    setInterval(function() {
        $('#current-date').text(now.format('MM. DD. YYYY'));
    }, 1000)
}

//function - reset (set display of invalid-msg & result success to none)
function resetDisplay() {
    $('#invalid-msg').css('display', 'none');
    $('#result-success').css('display', 'none');
}

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
                $('#invalid-msg').css('display', 'block');
                $('#invalid-search').text(citySearch);
            } else {
                console.log('success')
                $('#result-success').css('display', 'block');

                latitude = data[0].lat;
                longitude = data[0].lon;
                cityName = data[0].name;

                renderCurrentWeather();
                renderFiveDay();
            }
        });
}

//fetch - render weather onto page (might have to nest fetch within fetch) & create history button
function renderCurrentWeather() {
    var currentWeatherURL = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&units=' + units + '&appid=27f987ed5ee13dd96fdf2948248ce840'

    fetch(currentWeatherURL)
        .then(function(response) {
            return response.json();
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
function renderFiveDay() {
    var fiveDayURL ='https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude +'&lon=' + longitude + '&units=' + units + '&appid=27f987ed5ee13dd96fdf2948248ce840'
    console.log(fiveDayURL)

    fetch(fiveDayURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);

            for (var i = 0; i < data.list.length; i+=8) {
                var weatherStats = data.list[i];

                for (var i = 1; i <=5; i++) {
                    var fiveDayDate = weatherStats.dt

                    $('#day' + [i] + '-date').text(dayjs(fiveDayDate).format('MM. DD. YYYY'));
                    $('#day' + [i] + '-icon').attr('src','https://openweathermap.org/img/wn/' + weatherStats.weather[0].icon + '@2x.png');
                    $('#day' + [i] + '-icon').attr('alt', weatherStats.weather[0].description);
                    $('#day' + [i] + '-temp').text(weatherStats.main.temp + '°');
                    $('#day' + [i] + '-wind').text(weatherStats.wind.speed);
                    $('#day' + [i] + '-humidity').text(weatherStats.main.humidity);
                }
            }
        })
}

//fetch - render weather onto page when past searches list is clicked


//init function - display time
function init() {
    todayDateRender();
    resetDisplay();
}


//=======================================================

init();

//click function - show current weather
$('#search-btn').click(function(event) {
    event.preventDefault();

    resetDisplay();
    setTimeout(fetchCoordinates , 500)
})

//click function - show past searches