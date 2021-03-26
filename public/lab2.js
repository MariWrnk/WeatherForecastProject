const key = 'cf3d5c2d503cd2cec261b725dc1a4374';

let temp = document.querySelector('#favTemplate');

const defaultCity = 'Saint Petersburg';
mainDisp = mainSection.style.display;


function weatherByCityName(city){
  return fetch('http://localhost:3000/weather/city?q=' + city)
    .then((response) => {
      if(response.ok){
        return response.json();
      }  
    })
}

function weatherByCoords(lon, lat){
  return fetch('http://localhost:3000/weather/coordinates?lat=' + lat + '&lon=' + lon + '&units=metric&appid=' + key)
  .then((response) => {
    if(response.ok){
      return response.json();
    }  
  })
}

function favList(){
  return fetch('http://localhost:3000/favourites/list')
    .then((response) => {
      if(response.ok){
        return response.json();
      }  
    })
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
  weatherByCityName(localStorage.getItem('defaultCity')).then((data) => {
    if(data != null){      
      fullCurrentCity(data);
      if(document.querySelector('header').querySelector('.loader') != null){
        document.querySelector('header').querySelector('.loader').remove();
      } 
      mainSection.style.display = mainDisp;    
    }
  });
}

function addFavouriteCity(city, isNew){
  city = city.charAt(0).toUpperCase () + city.substr(1).toLowerCase ();
  let lclone = loaderTemp.content.cloneNode(true);
  document.querySelector('#cities').prepend(lclone);
  weatherByCityName(city).then((data) => {
    if(data != null){   
      if(isNew){        
        return fetch('http://localhost:3000/favourites/add?q=' + city, {method: 'POST'})  
          .then((response) => {
            if(response.ok){
              fullFavouriteCity(data);
            }
          })  
          .catch((err) => {})                
      } 
      else{
        fullFavouriteCity(data); 
      }          
    }   
  })  
  document.querySelector('#cities').querySelector('.loader').remove();
}

function showFavouriteCities(){
  favList().then((data) => {
    data.forEach(city => {
      addFavouriteCity(city.name, false);
    });
  }); 
}

function activateButton(button, cityName){
  button.addEventListener('click', cls);
  function cls(){
    button.removeEventListener('click', cls);
    return fetch('http://localhost:3000/favourites/delete?q=' + cityName, {method: 'DELETE'})
      .then((response) => {
        if(response.ok){         
          let cn = '#' + cityName;
          city = document.querySelector(cn);
          city.remove(); 
        }
      })
      .catch((err) => {}); 
  }
}

function getLocation() {  
  mainSection.style.display = 'none';
  let mlclone = mlTemp.content.cloneNode(true);
  mainSection.parentElement.append(mlclone);  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position => {
      weatherByCoords(position.coords.longitude, position.coords.latitude).then((data) =>{
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

smallGeoUpdate.addEventListener('click', () => {
  getLocation();
})

geoUpdate.addEventListener('click', () => {
  getLocation();
})

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









