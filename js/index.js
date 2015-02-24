(function(){
	var API_WORLDTIME_KEY = "59c773846b7f98459610078551ef2";
	var API_WORLDTIME = "https://api.worldweatheronline.com/free/v2/tz.ashx?format=json&key=" + API_WORLDTIME_KEY + "&q=";	 
	var API_WEATHER_KEY = "e5d63ee6a8b7d0f78e0a9c28d355b1bf";
	var API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?APPID=" + API_WEATHER_KEY + "&";

	var today = new Date();
	var timeNow = today.getHours() + ":" + today.getMinutes();

	var $body = $("body");
	var $loader = $(".loader");
	var nombreNuevaCiudad = $("[data-input='cityAdd']");
	var buttonAdd = $("[data-button='add']");
	var buttonLoad = $("[data-saved-cities]");

	var cities = [];
	var cityWeather = {};
	cityWeather.zone;
	cityWeather.icon;
	cityWeather.temp;
	cityWeather.temp_max;
	cityWeather.temp_min;
	cityWeather.humi;
	cityWeather.wind;
	cityWeather.descrip;
	cityWeather.main;

	$(buttonAdd).on("click", addNewCity);

	$(nombreNuevaCiudad).on("keypress", function(event) {
		if(event.which == 13) {
			addNewCity(event);
		}
	});

	$(buttonLoad).on("click", loadSavedCities);

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(getCoords, errorFound);
	}else{
		alert("Tu navegador no soporta Geolocation");
	}

	function errorFound(error) {
		alert("Un error ocurrió: " + error.code);
		// 0: Error desconocido
		// 1: Permiso denegado
		// 2: Posicion no disponible
		// 3: Timeout
	};

	function getCoords(position) {
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		console.log("Tu posicion es: " + lat + "," + lon);
		$.getJSON(API_WEATHER_URL + "lat=" + lat + "&lon=" + lon, getCurrentWeather);
	};

	function getCurrentWeather(data) {
		cityWeather.zone = data.name;
		cityWeather.icon = "svg/" + data.weather[0].icon + ".svg";
		cityWeather.temp = data.main.temp - 273.15;
		cityWeather.temp_max = data.main.temp_max - 273.15;
		cityWeather.temp_min = data.main.temp_min - 273.15;
		cityWeather.humi = data.main.humidity;
		cityWeather.wind = data.wind.speed;
		cityWeather.descrip = data.weather[0].description;
		cityWeather.main = data.weather[0].main;

		renderTemplate(cityWeather);
	};
	
	function activateTemplate(id) {
		var t = document.querySelector(id);
		return document.importNode(t.content, true);
	};

	function renderTemplate(cityWeather, localtime) {

		var clone = activateTemplate("#template--city");
		var timeToShow;

		if (localtime) {
			timeToShow = localtime.split(" ")[1];
		}else{
			timeToShow = timeNow;
		}

		clone.querySelector("[data-time]").innerHTML = timeToShow;
		clone.querySelector("[data-icon]").src = cityWeather.icon;
		clone.querySelector("[data-city]").innerHTML = cityWeather.zone;
		clone.querySelector("[data-temp='max']").innerHTML = cityWeather.temp_max.toFixed(1);
		clone.querySelector("[data-temp='min']").innerHTML = cityWeather.temp_min.toFixed(1);
		clone.querySelector("[data-temp='current']").innerHTML = cityWeather.temp.toFixed(1);
		clone.querySelector("[data-temp='wind']").innerHTML = cityWeather.wind;
		clone.querySelector("[data-temp='humi']").innerHTML = cityWeather.humi;
		clone.querySelector("[data-title]").innerHTML = cityWeather.main;

		
		$($loader).hide();
		$($body).append(clone);
	}

	function addNewCity(event) {
		event.preventDefault();
		$.getJSON(API_WEATHER_URL + "q=" + $(nombreNuevaCiudad).val(), getWeatherNewCity);
	}

	function getWeatherNewCity(data) {

		$.getJSON(API_WORLDTIME + $(nombreNuevaCiudad).val(), function(response) {

			$(nombreNuevaCiudad).val("");

			cityWeather = {};
			cityWeather.zone = data.name;
			cityWeather.icon = "svg/" + data.weather[0].icon + ".svg";
			cityWeather.temp = data.main.temp - 273.15;
			cityWeather.temp_max = data.main.temp_max - 273.15;
			cityWeather.temp_min = data.main.temp_min - 273.15;
			cityWeather.humi = data.main.humidity;
			cityWeather.wind = data.wind.speed;
			cityWeather.descrip = data.weather[0].description;
			cityWeather.main = data.weather[0].main;

			renderTemplate(cityWeather, response.data.time_zone[0].localtime);

			cities.push(cityWeather);
			localStorage.setItem("cities", JSON.stringify(cities));
		});

	}

	function loadSavedCities(event) {
		event.preventDefault();

		function renderCities(cities) {
			cities.forEach(function(city) {
				renderTemplate(city);
			});
		};

		var cities = JSON.parse(localStorage.getItem("cities"));
		renderCities(cities);
	}

	$(function() {
	function viewSearch() {
		$('form').slideToggle();

	}

	$('.circle').on('click', viewSearch);
	});

})();



