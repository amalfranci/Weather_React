import './App.css';
import hotBg from './assets/hot.jpg'
import coldBg from './assets/cold.jpg'
import Descriptions from './components/Descriptions';
import { useEffect, useState } from 'react';
import { getFormattedWeatherData } from './components/weatherServices';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [city, setCity] = useState('Greater Noida');
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState('metric');
  const [bg, setBg] = useState(hotBg);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getFormattedWeatherData(city, units);
        setWeather(data);

        const threshold = units === 'metric' ? 20 : 60;
        if (data.temp <= threshold) setBg(coldBg);
        else setBg(hotBg);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        toast.error('Invalid data. Please enter a valid city name.');
      }
    };

    fetchWeatherData();
  }, [units, city]);

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);

    const isCelsius = currentUnit === 'C';
    button.innerText = isCelsius ? '°F' : '°C';
    setUnits(isCelsius ? 'metric' : 'imperial');
  };

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
    }
  };

  return (
    <div className='app' style={{ backgroundImage: `url(${bg})` }}>
      <div className='overlay'>
        <ToastContainer />
        {weather && (
          <div className='container'>
            <div className='section section__inputs'>
              <input onKeyDown={enterKeyPressed} type='text' name='city' placeholder='Enter City...' />
              <button onClick={(e) => handleUnitsClick(e)}>°F</button>
            </div>
            <div className='section section__temperature'>
              <div className='icon'>
                <h3>{`${weather.name},${weather.country}`}</h3>
                <img src={weather.IconUrl} width='100px' height='100px' alt='icon_weather'></img>
                <h3>{weather.Description}</h3>
              </div>
              <div className='temperature'>
                <h1>{`${weather.temp.toFixed()} ° ${units === 'metric' ? 'C' : 'F'}`}</h1>
              </div>
            </div>
            {/* botton description */}
            <Descriptions weather={weather} units={units} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;