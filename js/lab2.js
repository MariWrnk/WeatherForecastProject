const key = 'cf3d5c2d503cd2cec261b725dc1a4374';

let temp = document.querySelector('#favTemplate')

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

getWeatherByCityName('Saint Petersburg').then((data) => {
  if(data != null){
    console.log(data);
    fullCurrentCity(data);
  }
});

function fullCurrentCity(data){
  currentCity.innerHTML = data.name;
  currTempValue.innerHTML = data.main.temp;
  params = mainSection.querySelectorAll('.value');
  params[0].innerHTML = data.wind.speed + ' m/s, ' + data.wind.deg + ' degrees';
  params[1].innerHTML = data.clouds.all + ' %';
  params[2].innerHTML = data.main.pressure + ' hpa';
  params[3].innerHTML = data.main.humidity + ' %';
  params[4].innerHTML = '[' + data.coord.lon + ', ' + data.coord.lat + ']';
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
  let list = document.querySelector('#cities')
  list.prepend(clone)
  
}

getWeatherByCityName('Minsk').then((data) => {
  if(data != null){
    console.log(data);
    fullFavouriteCity(data);
  }
});

getWeatherByCoords(38.928333, 55.997223).then((data) =>{
  if(data != null){
    console.log(data);
  }
});




