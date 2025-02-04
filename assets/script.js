// Global Variables

const key = "7aca6d5582fe8abbe1cd2a78e0c485b9";

let savedCity = [];

// Function that runs three different api calls for:
// Current weather,
// UV index,
// Five day forcast.

function getWeather(city) {
  // Call for the current weather.

  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    key;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    var uvUrl =
      "https://api.openweathermap.org/data/2.5/uvi?appid=" +
      key +
      "&lat=" +
      lat +
      "&lon=" +
      lon;

    // Call for the UV index using latitude and longitude from current weather return.

    $.ajax({
      url: uvUrl,
      method: "GET",
    }).then(function (uvresponse) {
      var uvIndex = uvresponse.value;
      var uvBox = $("<div>");

      // Conditional that updates a colored circle based on the uv index.

      if (uvIndex <= 2) {
        uvBox.attr("class", "color-box1");
      } else if (uvIndex >= 3 && uvIndex < 6) {
        uvBox.attr("class", "color-box2");
      } else if (uvIndex >= 6 && uvIndex < 8) {
        uvBox.attr("class", "color-box3");
      } else if (uvIndex >= 8 && uvIndex < 11) {
        uvBox.attr("class", "color-box4");
      } else if (uvIndex >= 11) {
        uvBox.attr("class", "color-box5");
      }

      uvBox.text("UV");
      var p4 = $("<p>").text("UV Index : " + uvIndex);
      p4.attr("class", "weather-body");

      p4.append(uvBox);
      weatherDiv.append(p4);
    });

    // Call for the five day forecast.

    var dailyUrl =
      "https://api.openweathermap.org/data/2.5/onecall?" +
      "lat=" +
      lat +
      "&lon=" +
      lon +
      "&exclude=current,minutely,hourly&units=imperial&appid=" +
      key;

    $.ajax({
      url: dailyUrl,
      method: "GET",
    }).then(function (dailyresponse) {
      // For Loop to display weather info the 5 cards on the page.
      let weekForecast = [];
      let weekDailyHigh = [];
      let weekDailyLow = [];
      for (i = 1; i < 6; i++) {
        $("#weather-card-" + i).empty();

        let dailyDate = new Date(
          dailyresponse.daily[i].dt * 1000
        ).toLocaleDateString("en-US");
        $("#date-" + i).text(dailyDate);
        let weatherImg = dailyresponse.daily[i].weather[0].icon;
        let dailyIcon =
          "https://openweathermap.org/img/wn/" + weatherImg + "@2x.png";
        let img = $("<img>").attr("src", dailyIcon);
        img.attr("alt", "Weather Icon");
        let dailyHigh = dailyresponse.daily[i].temp.max;
        let p1 = $("<p>");
        p1.text("High of: " + dailyHigh);
        let dailyLow = dailyresponse.daily[i].temp.min;
        let p2 = $("<p>");
        p2.text("Low of: " + dailyLow);
        let dailyHumid = dailyresponse.daily[i].humidity;
        let p3 = $("<p>");
        p3.text("Humidity: " + dailyHumid);

        $("#weather-card-" + i).append(img, p1, p2, p3);

        weekForecast.push(dailyDate);
        weekDailyHigh.push(dailyHigh);
        weekDailyLow.push(dailyLow);
      }

      // Added chart for 5 day temperatures from Highcharts utlizing Open Weather API

      Highcharts.chart("container", {
        chart: {
          type: "spline",
        },
        title: {
          text: "Five Day High/Low Forecast",
        },
        subtitle: {
          text: "Source: Open Weather API",
        },
        xAxis: {
          categories: [
            weekForecast[0],
            weekForecast[1],
            weekForecast[2],
            weekForecast[3],
            weekForecast[4],
          ],
        },
        yAxis: {
          title: {
            text: "Temperature",
          },
          labels: {
            formatter: function () {
              return this.value + "°";
            },
          },
        },
        tooltip: {
          crosshairs: true,
          shared: true,
        },
        plotOptions: {
          spline: {
            marker: {
              radius: 4,
              lineColor: "#666666",
              lineWidth: 1,
            },
          },
        },
        series: [
          {
            name: "Daily High",
            tooltip: {
              pointFormat:
                '<span style="color:#ffa500b2">\u25CF</span> {series.name}: <b>{point.y}</b><br/>',
            },
            lineColor: "#ffa500b2",
            marker: {
              symbol: "diamond",
              fillColor: "#ffa500b2",
            },
            data: [
              weekDailyHigh[0],
              weekDailyHigh[1],
              weekDailyHigh[2],
              weekDailyHigh[3],
              weekDailyHigh[4],
            ],
          },
          {
            name: "Daily Low",
            lineColor: "#1ca0a0b2",
            marker: {
              symbol: "diamond",
              fillColor: "#1ca0a0b2",
            },
            data: [
              weekDailyLow[0],
              weekDailyLow[1],
              weekDailyLow[2],
              weekDailyLow[3],
              weekDailyLow[4],
            ],
          },
        ],
      });
    });

    // Current weather forecast displayed on main card.
    // Use of .empty to prevent continuously adding information on each new city searched.

    $("#weather-score").empty();
    $("#city-name").empty();
    $("#country-name").empty();
    $("#daily-date").empty();

    var cityName = response.name;
    var cityDate = new Date(response.dt * 1000).toLocaleDateString("en-US");
    var icon = response.weather[0].icon;
    var weatherIcon = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
    var image = $("<img>").attr("src", weatherIcon);
    image.attr("id", "imgicon");
    image.attr("alt", "Weather Icon");
    $("#city-name").append("City: " + cityName);
    $("#city-name").append(image);
    var countryName = response.sys.country;
    $("#country-name").append("Country: " + countryName);
    $("#daily-date").append(cityDate);

    var weatherDiv = $("<div>");
    var temp = response.main.temp;
    var p1 = $("<p>").text("Temperature : " + temp);
    p1.attr("class", "weather-body");
    var humid = response.main.humidity;
    var p2 = $("<p>").text("Humidity: " + humid);
    p2.attr("class", "weather-body");
    var wind = response.wind.speed;
    var p3 = $("<p>").text("Windspeed : " + wind + " mph");
    p3.attr("class", "weather-body");

    weatherDiv.append(p1, p2, p3);
    $("#weather-score").append(weatherDiv);
  });
}

// Function that creates a list of clickable cities and also stores them into local storage.

function cityList(city) {
  if (savedCity.length == 6) {
    savedCity.splice(0, 1);
  }

  city = city.charAt(0).toUpperCase() + city.slice(1);
  $("#city-list").empty();
  let cityArray = {
    city: city,
  };

  savedCity.push(cityArray);

  for (i = 0; i < savedCity.length; i++) {
    let cityList = $("<button>");
    cityList.attr("class", "list-group-item button");
    cityList.attr("id", "clist-" + i);
    cityList.attr("type", "click");
    cityList.attr("data-li", i);
    cityList.text(savedCity[i].city);

    $("#city-list").prepend(cityList);
  }
  localStorage.setItem("savedCity", JSON.stringify(savedCity));

  $(".list-group-item").on("click", function () {
    let cityClick = $(this).text();
    getWeather(cityClick);
  });
}

// Function that loads local storage onto the page through a refresh.
//Runs the get weather function to display last searched city.
// Also loads a default city if no local storage is available.

function getCity() {
  if (localStorage.getItem("savedCity") !== null) {
    let loadCity = JSON.parse(localStorage.getItem("savedCity"));
    for (i = 0; i < loadCity.length; i++) {
      let cityList = $("<button>");
      cityList.attr("class", "list-group-item button");
      cityList.attr("id", "clist-" + i);
      cityList.attr("type", "click");
      cityList.attr("data-li", i);
      cityList.text(loadCity[i].city);

      $("#city-list").prepend(cityList);

      let cityArray = {
        city: loadCity[i].city,
      };
      savedCity.push(cityArray);
    }

    let theCity = savedCity[savedCity.length - 1];
    let loadedCity = theCity.city;
    getWeather(loadedCity);
  } else {
    var city = "estero";
    getWeather(city);
  }
}

getCity();

// Event listener to get the city name data.

$("#city-btn").on("click", function () {
  if (city == " ") {
    return;
  } else {
    var city = $("#city-search").val().trim();
  }
  getWeather(city);
  cityList(city);
});

// Event listener to click on a listed city and load the weather data.

$(".list-group-item").on("click", function () {
  let cityClick = $(this).text();
  getWeather(cityClick);
});
