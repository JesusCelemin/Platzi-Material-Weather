(function(){

	var API_WEATHER_KEY = "e5d63ee6a8b7d0f78e0a9c28d355b1bf";
	var API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?APPID=" + API_WEATHER_KEY + "&";

	var today = new Date();
	var timeNow = today.toLocaleTimeString();

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

		renderTemplate();
	};

	function activateTemplate(id) {
		var t = document.querySelector(id);
		return document.importNode(t.content, true);
	};

	function renderTemplate() {
		var clone = activateTemplate("#template--city");
		

		clone.querySelector("[data-time]").innerHTML = timeNow;
		clone.querySelector("[data-icon]").src = cityWeather.icon;
		clone.querySelector("[data-city]").innerHTML = cityWeather.zone;
		clone.querySelector("[data-temp='max']").innerHTML = cityWeather.temp_max.toFixed(1);
		clone.querySelector("[data-temp='min']").innerHTML = cityWeather.temp_min.toFixed(1);
		clone.querySelector("[data-temp='current']").innerHTML = cityWeather.temp.toFixed(1);
		clone.querySelector("[data-temp='wind']").innerHTML = cityWeather.wind;
		clone.querySelector("[data-temp='humi']").innerHTML = cityWeather.humi;
		clone.querySelector("[data-title]").innerHTML = cityWeather.main;



		$(".loader").hide();
		$('body').append(clone);
	}

})();

$(function() {
	function viewSearch() {
		$('form').slideToggle();

	}

	$('.circle').on('click', viewSearch);
	});

