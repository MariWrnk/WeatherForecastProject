const key = 'cf3d5c2d503cd2cec261b725dc1a4374';

let temp = document.querySelector('#favTemplate')

localStorage.setItem('defaultCity', 'Saint Petersburg');
mainDisp = mainSection.style.display;

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
  params = setParameters(mainSection, data); 
  mainIcon.setAttribute('src', 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png')    
}

function fullFavouriteCity(data){  
  let clone = temp.content.cloneNode(true);    
  clone.querySelector('.cityName').innerHTML = data.name;
  clone.querySelector('.tempValue').innerHTML = data.main.temp;
  params = setParameters(clone, data); 
  clone.querySelector('.weatherIcons').setAttribute('src', 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'); 
  let list = document.querySelector('#cities')
  list.prepend(clone)  
  document.querySelector('.otherCities').id = data.name;
  activateButton(cities.querySelector('button'), data.name);
}

function setParameters(element, data){
  params = element.querySelectorAll('.value');
  params[0].innerHTML = data.wind.speed + ' m/s, ' + data.wind.deg + ' degrees';
  params[1].innerHTML = data.clouds.all + ' %';
  params[2].innerHTML = data.main.pressure + ' hpa';
  params[3].innerHTML = data.main.humidity + ' %';
  params[4].innerHTML = '[' + data.coord.lon + ', ' + data.coord.lat + ']';  
  return params;
}

function setDefaultCity(){
  getWeatherByCityName(localStorage.getItem('defaultCity')).then((data) => {
    if(data != null){
      fullCurrentCity(data);
      document.querySelector('header').querySelector('.loader').remove();
      mainSection.style.display = mainDisp;
    }
  });
}

function addFavouriteCity(city, isNew){
  city = city.charAt(0).toUpperCase () + city.substr(1).toLowerCase ();
  let lclone = loaderTemp.content.cloneNode(true);
  document.querySelector('#cities').prepend(lclone);
  if(localStorage.getItem('favouriteCities') != undefined){
    if(localStorage.favouriteCities.includes(city) & isNew){
      document.querySelector('#cities').querySelector('.loader').remove();
      alert('City is already in favourites!');      
      return;
    }
  }
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
    document.querySelector('#cities').querySelector('.loader').remove();
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

function activateButton(button, cityName){
  button.addEventListener('click', () => {
  cn = '#' + cityName;
  city = document.querySelector(cn);
  city.remove();
  let citiesList = localStorage.favouriteCities.split(' ');
  let newCities = '';
  for(let i = 0; i < citiesList.length; i++){
    if(citiesList[i] != cityName){
      if(newCities == ''){
        newCities = citiesList[i];
      }
      else{
        newCities = newCities + ' ' + citiesList[i];
      }      
    }
  }
  if(newCities != ''){
    localStorage.favouriteCities = newCities;
  }
  else{
    localStorage.removeItem('favouriteCities');
  }
  });
}

function getLocation() {  
  mainSection.style.display = 'none';
  let mlclone = mlTemp.content.cloneNode(true);
  mainSection.parentElement.append(mlclone);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position => {
      getWeatherByCoords(position.coords.longitude, position.coords.latitude).then((data) =>{
        if(data != null){
          fullCurrentCity(data);
          if(document.querySelector('header').querySelector('.loader') != null){
            document.querySelector('header').querySelector('.loader').remove();
          }          
          mainSection.style.display = mainDisp;
          return;
        }
      });
    }));
  } 
  setDefaultCity();
}

addCity.addEventListener('submit', function(event){
  event.preventDefault();
  let newCityName = cityInput.value; 
  if(newCityName != ''){
    addFavouriteCity(newCityName, true);
  }   
  cityInput.value = '';
});

getLocation();
showFavouriteCities();
//localStorage.removeItem('favouriteCities');
//console.log(localStorage.favouriteCities);









