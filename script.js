var APIKey = "ed722cdc1229b82cb4415abf842e5437";
var city = "";
var currentDate = "";
var tempF = "";
var humidityValue = "";
var windSpeed = "";
var uvIndexValue = "";
var minTempC = "";
var maxTempC = "";
var minTempF = "";
var maxTempF = "";
var dayhumidity = "";
var currentWeatherIconCode = "";
var currentWeatherIconUrl = "";
var iconcode = "";
var iconurl = "";
var country = "";
$('#date-today h4').text(moment().format('dddd') + ", " + moment().format('MMMM Do YYYY, h:mm:ss a'));
var SearchedCities = [];

var getSearchedCities = JSON.parse(localStorage.getItem("logged-cities"));
if (getSearchedCities !== null) {
   // getSearchedCities.forEach(function(city) {city.toUppercase();});
    SearchedCities = getSearchedCities;
}

$(document).ready(function () {
    showCities(SearchedCities);
    if (getSearchedCities !== null) {
        var recentCity = SearchedCities[0];
        searchForCity(recentCity);
    }
});
function showCities(citiesList) {
    $("#logged-cities").removeClass("hide");
    var count = 0;
    citiesList.length > 5 ? count = 5 : count = citiesList.length
    for (var i = 0; i < count; i++) {
        $("#logged-cities").css("list-style-type", "none");
        $("#logged-cities").append(`<a href="#" class="list-group-item" style="text-decoration: none; color: black;">
      <li>${citiesList[i]}</li>
      </a>`);
    }
}
$("#search-btn").on("click", function () {
    event.preventDefault();
    clearWeather();
    reset();
    var cityName = $("input")//.val().toUppercase().trim();
    //FATAL ERROR script.js:49 Uncaught TypeError: $(...).val(...).toUppercase is not a function
    //@ script.js:49
    //Could not figure out why this returned an error but @script.js:23 didn't.
    $("#search-cities").val("");
    searchForCity(cityName);
    if (cityName !== "" && SearchedCities[0] !== cityName) {
        SearchedCities.unshift(cityName);
        localStorage.setItem("logged-cities", JSON.stringify(SearchedCities));
        if (SearchedCities.length === 1) {
            $("#logged-cities").removeClass("hidden");
        }
        if ($("ul#logged-list").length >= 3) {
            ($("ul#logged-list").remove());
        }
        $("#logged-list").prepend(`<a class="list" <li>${cityName}</li> </a>`);
    }
});
$(document).on("click", ".list-refresh", function () {
    var cityName = $(this).text();
    clearWeather();
    reset();
    searchForCity(cityName);
});

function displayCurrentWeather() {
    var cardDiv = $("<div class='container'>");
    var weatherImage = $("<img>").attribute('src', currentWeatherIconUrl);
    var cardHeader = $("<h4>").text(city + " " + currentDate.toString());
    cardHeader.append(weatherImage);
    var temperatureEl = $("<p>").text("Temperature: " + tempF + " °F");
    var humidityEl = $("<p>").text("Humidity: " + humidityValue + "%");
    var windSpeedEl = $("<p>").text("Wind Speed: " + windSpeed + " MPH");
    var uvIndexEl = $("<p>").text("UV Index: ");
    var uvIndexValueEl = $("<span>").text(uvIndexValue).css("background-color", getColorCodeForUVIndex(uvIndexValue));
    uvIndexEl.append(uvIndexValueEl);
    cardDiv.append(cardHeader);
    cardDiv.append(temperatureEl);
    cardDiv.append(humidityEl);
    cardDiv.append(windSpeedEl);
    cardDiv.append(uvIndexEl);
    $("#current-weather").append(cardDiv);
}
function displayDayForeCast() {
    var imgEl = $("<img>").attributw("src", iconurl);
    var cardEl = $("<div class='card'>").addClass("pl-1 bg-primary text-light");
    var cardBlockDiv = $("<div>").attribute("class", "card-block");
    var cardTitleDiv = $("<div>").attribute("class", "card-block");
    var cardTitleHeader = $("<h6>").text(dateValue).addClass("pt-2");
    var cardTextDiv = $("<div>").attr("class", "card-text");
    var minTempEl = $("<p>").text("Min Temp: " + minTempF + " ºF").css("font-size", "30px");
    var maxTempEl = $("<p>").text("Max Temp: " + maxTempF + " ºF").css("font-size", "30px");
    var humidityEl = $("<p>").text("Humidity: " + dayhumidity + "%").css("font-size", "30px");

    cardTextDiv.append(imgEl);
    cardTextDiv.append(minTempEl);
    cardTextDiv.append(maxTempEl);
    cardTextDiv.append(humidityEl);
    cardTitleDiv.append(cardTitleHeader);
    cardBlockDiv.append(cardTitleDiv);
    cardBlockDiv.append(cardTextDiv);
    cardEl.append(cardBlockDiv);
    $(".forecast").append(cardEl);
}
function addCardDeckHeader() {
    deckHeader = $("<h2>").text("5-Day Forecast").attribute("id", "5-day-forecast");
    //deckHeader.addClass("pt-4 pt-2");
    $(".forecast").before(deckHeader);
}
function clearWeather() {
    $("#current-weather").empty();
    $("#5-day-forecast").remove();
    $(".forecast").empty();
}
function getColorCodeForUVIndex(uvIndex) {
    var uvIndexValue = parseFloat(uvIndex);
    var colorcode = "";
    if (uvIndexValue <= 2) {
        colorcode = "#00ff00"; //Green//
    }
    else if ((uvIndexValue > 2) && (uvIndexValue <= 5)) {
        colorcode = "#ffff00"; //Yellow//
    }
    else if ((uvIndexValue > 5) && (uvIndexValue <= 7)) {
        colorcode = "#ffa500"; //Orange//
    }
    else if ((uvIndexValue > 7) && (uvIndexValue <= 10)) {
        colorcode = "#9e1a1a"; //Red//
    }
    else if (uvIndexValue > 10) {
        colorcode = "#7f00ff"; //Purple
    }
    return colorcode;
    //Colorcode found online https://www.epa.gov/sites/production/files/documents/uviguide.pdf //
}

function searchForCity(cityName) {
    console.log(cityName);
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName + "&appid=" + APIKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            var result = response;
            city = result.name.trim();
    currentDate = moment.unix(result.dt).format("l");
    console.log(currentDate);
    var tempC = result.main.temp;
    TempF = ((TempC / 5) * 9 + 32).toFixed(1)
    humidityValue = result.main.humidity;
    windSpeed = result.wind.speed;
    currentWeatherIconCode = result.weather[0].icon;
    currentWeatherIconUrl = "https://openweathermap.org/img/w/" + currentWeatherIconCode + ".png";
    var latitude = result.coord.lat;
    var longitude = result.coord.lon;
    var uvIndexQueryUrl = "https://api.openweathermap.org/data/2.5/uvi?&appid=" + APIKey + "&lat=" + latitude + "&lon=" + longitude;
    $.ajax({
        url: uvIndexQueryUrl,
        method: "GET"
    })
        .then(function (response) {
            uvIndexValue = response.value;
            displayCurrentWeather()

            var fiveDayQueryUrl = "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + "&appid=" + APIKey + "&cnt=5";
            $.ajax({
                url: fiveDayQueryUrl,
                method: "GET"
            })
                .then(function (response) {
                    var fiveDayForecast = response.list;
                    addCardDeckHeader()
                    for (var i = 0; i < 5; i++) {
                        iconcode = fiveDayForecast[i].weather[0].icon;
                        iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
                        //  dateValue = moment().tz(country + "/" + city).add(i, 'days').format('l');
                        dateValue = moment.unix(fiveDayForecast[i].dt).format('l');
                        minTempK = fiveDayForecast[i].temp.min;
                        minTempF = ((minTempK - 273.15) * 1.80 + 32).toFixed(1);
                        maxTempK = fiveDayForecast[i].temp.max;
                        maxTempF = (((fiveDayForecast[i].temp.max) - 273.15) * 1.80 + 32).toFixed(1);
                        dayhumidity = fiveDayForecast[i].humidity;
                        displayDayForeCast()
                    }
                });
        });
     })
}
function reset() {
    city = "";
    currentDate = "";
    tempF = "";
    humidityValue = "";
    windSpeed = "";
    uvIndexValue = "";
    latitude = "";
    longitude = "";
    minTempK = "";
    maxTempK = "";
    minTempF = "";
    maxTempF = "";
    dayhumidity = "";
    currentWeatherIconCode = "";
    currentWeatherIconUrl = "";
    iconcode = "";
    iconurl = "";
    country = "";
}

  //https://www.w3schools.com/jquery/jquery_ref_ajax.asp
  //https://www.w3schools.com/jquery/jquery_ajax_get_post.asp For help on .ajax GET method
  //https://www.w3schools.com/jquery/html_prepend.asp
  //https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
  //https://fonts.google.com/specimen/Montserrat?sidebar.open=true&selection.family=Montserrat:wght@500


  //https://www.youtube.com/watch?v=nWiZzoFLnDcv  <---  Used to help understand API implentation 


