const key = 'cf3d5c2d503cd2cec261b725dc1a4374';
const express = require('express');
const mongoose = require('mongoose');
var Cities = require('./dbSchema');
const mydb = 'mongodb+srv://dbusr:dbpss@cluster0.7egpj.mongodb.net/fav_cities?retryWrites=true&w=majority';
const path = require('path');
const fetch = require('node-fetch');
const app = express();

app.use(express.static(__dirname + '/public'));

mongoose.connect(mydb, {useNewUrlParser: true, useUnifiedTopology: true}, function (err) {
    if(err){
      console.log(err);
    }    
    else{
      console.log('DB is connected.');
    }      
});

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

function getWeatherByCoords(lat, lon){
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.get('/weather/city', (req, res) => {
  getWeatherByCityName(req.query.q).then((data) => {
    if(data != null){
      res.json(data);
    }
    else{
      res.status(404);
    }
  })  
})

app.get('/weather/coordinates', (req, res) => {
  getWeatherByCoords(req.query.lat, req.query.lon).then((data) => {
    if(data != null){
      res.json(data);
    }
    else{
      res.status(404);
    }
  })
})

app.post('/favourites/add', (req, res) => {
  let nc = new Cities({name: req.query.q});
  nc.save();
  res.status(200).end();
})

app.delete('/favourites/delete', (req, res) => {
  Cities.findOneAndDelete({name: req.query.q}, function(err, result){             
    if(err) return console.log(err);    
    res.status(200).end();
  });
})

app.get('/favourites/list', (req, res) => {  
  Cities.find({}, function(err, cities){ 
    if(err) return console.log(err);
    cNames = [];
    for(let i = 0; i < cities.length; i++){
      cNames[i] = cities[i].name;
    }
    console.log(cNames);
    res.send(cities);
  });
});

app.listen(3000);