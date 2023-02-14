import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [weather, setWeather] = useState({});
  const [news, setNews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // get user's geolocation
    navigator.geolocation.getCurrentPosition(
      position => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      error => console.log(error)
    );
  }, []);

  useEffect(() => {
    // get weather data
    if (latitude && longitude) {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=0b0ccbf3b3685ddaabc82310330c1977`)
        .then(response => setWeather(response.data))
        .catch(error => console.log(error));
    }
  }, [latitude, longitude]);

  useEffect(() => {
    // get news data
    if (latitude && longitude) {
      axios.get(`https://newsapi.org/v2/top-headlines?country=in&apiKey=33ee96a686fa433fa16582a0dbb3dd95`)
        .then(response => setNews(response.data.articles))
        .catch(error => console.log(error));
    }
  }, [latitude, longitude]);

  const handleSearch = (event) => {
    event.preventDefault();
    // search for news based on search term
    axios.get(`https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=33ee96a686fa433fa16582a0dbb3dd95`)
      .then(response => setNews(response.data.articles))
      .catch(error => console.log(error));
  };

  return (
    <div className='container'>
      <div className="weather">
      <div className="top">
                <div>
                    <h1 className="temperature">Temp: {Math.round(weather.main?.temp-273 ) } °C</h1>
                </div>  
      </div>
      <div className="bottom">        
                <div className="details">
                    <div className="parameter-row">
                        <span className="parameter-label">Details</span>
                    </div>
                    <div className="parameter-row">
                        <span className="parameter-label">Feels like: </span>
                        <span className="parameter-value">{Math.round(weather.main?.feels_like-273 )}°C</span>
                    </div>              
                    <div className="parameter-row">
                        <span className="parameter-label">Humidity: </span>
                        <span className="parameter-value">{Math.round(weather.main?.humidity ) }%</span>
                    </div>
                    <div className="parameter-row">
                        <span className="parameter-label">Pressure: </span>
                        <span className="parameter-value">{Math.round(weather.main?.pressure) }hPa</span>
                    </div>
                </div>
            </div>    
      </div>
  <br />
      <center><form onSubmit={handleSearch}>
        <input type="text" value={searchTerm} onChange={event => setSearchTerm(event.target.value)} />
        <button type="submit">Search</button>
      </form>
      </center>  
      <center><h2>Top Stories</h2></center>   
      <div className="news">     
        <ul>
        <div className="news-item">
        {news.map((article, index) => (
          <li key={index}>
            <h3><a href={article.url}>{article.title}</a></h3>
            <p className="desc">{article.description}</p>
          </li>
        ))}
        </div> 
      </ul></div>
    </div>
  );
};

export default App;
