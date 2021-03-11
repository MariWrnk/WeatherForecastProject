const key = 'cf3d5c2d503cd2cec261b725dc1a4374';

let temp = document.querySelector('#favTemplate')

localStorage.setItem('defaultCity', 'Saint Petersburg');

function getWeatherByCityName(city){
  return fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=' + key)
    .then((response) => {
      if(response.ok){
          return response.json();
      }
      else{
          alert('The city was not found!')
          return null;
      }    
    })
    .catch(() => {
      alert('Connection problem.');
    });
}

function getWeatherByCoords(lon, lat){
  return fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&units=metric&appid=' + key)
    .then((response) => {
      if(response.ok){
          return response.json();
      }
      else{
          alert('Wrong coordinates!')
          return null;
      }    
    })
    .catch(() => {
      alert('Connection problem.');
    });
}



function fullCurrentCity(data){
  currentCity.innerHTML = data.name;
  currTempValue.innerHTML = data.main.temp;
  params = mainSection.querySelectorAll('.value');
  params[0].innerHTML = data.wind.speed + ' m/s, ' + data.wind.deg + ' degrees';
  params[1].innerHTML = data.clouds.all + ' %';
  params[2].innerHTML = data.main.pressure + ' hpa';
  params[3].innerHTML = data.main.humidity + ' %';
  params[4].innerHTML = '[' + data.coord.lon + ', ' + data.coord.lat + ']';  
  mainIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png')
}

function fullFavouriteCity(data){
  let clone = temp.content.cloneNode(true);
  clone.querySelector('.cityName').innerHTML = data.name;
  clone.querySelector('.tempValue').innerHTML = data.main.temp;
  params = clone.querySelectorAll('.value');
  params[0].innerHTML = data.wind.speed + ' m/s, ' + data.wind.deg + ' degrees';
  params[1].innerHTML = data.clouds.all + ' %';
  params[2].innerHTML = data.main.pressure + ' hpa';
  params[3].innerHTML = data.main.humidity + ' %';
  params[4].innerHTML = '[' + data.coord.lon + ', ' + data.coord.lat + ']';
  clone.querySelector('.weatherIcons').setAttribute('src', 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png');
  let list = document.querySelector('#cities')
  list.prepend(clone)
  
}

function setDefaultCity(){
  getWeatherByCityName(localStorage.getItem('defaultCity')).then((data) => {
    if(data != null){
      fullCurrentCity(data);
    }
  });
}

function addFavouriteCity(city, isNew){
  getWeatherByCityName(city).then((data) => {
    if(data != null){
      fullFavouriteCity(data);
      if(isNew){
        if (localStorage.getItem('favouriteCities') != undefined){
          localStorage.favouriteCities = localStorage.favouriteCities + ' ' + city;
        }
        else{
          localStorage.setItem('favouriteCities', city);
        }
      }      
    }
  });
}

function showFavouriteCities(){
  if (localStorage.getItem('favouriteCities') != null){
    fc = localStorage.favouriteCities.split(' ');
    fc.forEach(element => {
      addFavouriteCity(element, false);
    });
  }
}

getWeatherByCoords(38.928333, 55.997223).then((data) =>{
  if(data != null){
    console.log(data);
  }
});

addFavButton.onclick = function(){
  let newCityName = cityInput.value;
  addFavouriteCity(newCityName, true);
  cityInput.value = '';  
};



setDefaultCity();
showFavouriteCities();






