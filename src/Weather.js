import dayImage from './day.jpg';
import nightImage from './night.jpg';
import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';


export default function Weather() {
    // set default state
    const DATA = {
        weather: [
            {
                id: undefined,
                main: undefined,
                description: undefined,
                icon: undefined
            }
        ],
        main: {
            temp: undefined,
            feels_like: undefined,
            temp_min: undefined,
            temp_max: undefined,
            pressure: undefined,
            humidity: undefined,
        },
        visibility: undefined,
        wind: {
            speed: undefined,
            deg: undefined
        },
        rain: {
            "1h": undefined
        },
        clouds: {
            all: undefined
        },
        sys: {
            sunrise: undefined,
            sunset: undefined
        },
        timezone: undefined,
        name: undefined,
    };
    const [currentData, setCurrentData] = useState(DATA);

    // setState to json from openweather
    useEffect(() => {
        // change the city name and all of the data, time and date included, will change with it!
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=Toronto&appid=83afba082fe908a9c2644fdb5ab9a7e8&units=metric`)
            .then((response) => response.json())
            .then((json) => {
                setCurrentData(json);
                console.log(json)
            })
    }, []);

    let currentTime = new Date();
    // get current date
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let currentTimeOffset = new Date().getTimezoneOffset() * 60;
    let currentTimeUnix = new Date((Math.floor(currentTime.getTime())) + (currentData.timezone * 1000) + (currentTimeOffset * 1000));
    let day = days[currentTimeUnix.getDay()];
    let month = months[currentTimeUnix.getMonth()];
    let dayOfMonth = currentTimeUnix.getDate();
    let year = currentTimeUnix.getFullYear();
    let dateString = `${day}, ${month} ${dayOfMonth}, ${year}`;

    const timestamp = (time) => {
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes}${ampm}`;
    }

    // determine if it is day or night
    let currentDayMinutes = currentTimeUnix.getHours() * 60 + currentTimeUnix.getMinutes();
    console.log(currentDayMinutes)

    // get sunset
    let currentSunsetTime = new Date((currentData.sys?.["sunset"] * 1000) + (currentData.timezone * 1000) + (currentTimeOffset * 1000));
    let currentSunsetMinutes = currentSunsetTime.getHours() * 60 + currentSunsetTime.getMinutes();
    console.log(currentSunsetMinutes)

    //get sunrise
    let currentSunriseTime = new Date((currentData.sys?.["sunrise"] * 1000) + (currentData.timezone * 1000) + (currentTimeOffset * 1000));
    let currentSunriseMinutes = currentSunriseTime.getHours() * 60 + currentSunriseTime.getMinutes();
    console.log(currentSunriseMinutes)


    const timeOfDay = () => {
        if (currentDayMinutes >= currentSunsetMinutes || currentDayMinutes < currentSunriseMinutes) {
            return nightImage;
        }
        else {
            return dayImage;
        }
    };

    function directionMap(degrees) {
        if(degrees >= 22.5 && degrees < 67.5) {
            return "NE";
        }
        else if(degrees >= 67.5 && degrees < 112.5) {
            return "E";
        }
        else if(degrees >= 112.5 && degrees < 157.5) {
            return "SE";
        }
        else if(degrees >= 157.5 && degrees < 202.5) {
            return "S";
        }
        else if(degrees >= 202.5 && degrees < 247.5) {
            return "SW";
        }
        else if(degrees >= 247.5 && degrees < 292.5) {
            return "W";
        }
        else if(degrees >= 292.5 && degrees < 337.5) {
            return "NW";
        }
        else {
            return "N";
        }
    }   

    return (
        <div className="App-header" style={{color: `${timeOfDay() === nightImage ? '#000000' : '#2C2C2C'}`}}>
            <h1 className="mb-4" style={{color: '#AACCFF'}}>OpenWeatherMap API Weather App</h1>
            <div className="justify-content-center align-items-center" style={{
                border: "1px solid white", height: "610px", width: "310px",
                backgroundImage: `url(${timeOfDay()})`
            }}>
                <div>
                    <h1 className="text-center mt-5">{currentData?.name}</h1>
                    <h5 className="text-center">{dateString}</h5>
                    <h5 className="text-center">{timestamp(currentTimeUnix)}</h5>
                    <Row className="justify-content-around">
                        <Col className="col-lg-5">
                            <div className="text-center">
                                <img className="mx-auto d-block" src={`https://openweathermap.org/img/wn/${currentData.weather?.[0]["icon"]}@2x.png`} alt="weather icon"></img>
                                <div className="image-text">
                                    <h5 className="text-center">{currentData.weather?.[0]["main"]}</h5>
                                    <h6 className="text-center">{currentData.weather?.[0]["description"]}</h6>
                                </div>
                            </div>
                        </Col>
                        <Col className="col-lg-5">
                            <div className="text-center">
                                <p className="mt-1 mb-0 d-inline-block temp-text">{Math.round(currentData.main?.["temp"]) + '\xB0'}</p>
                                <h5>{`H: ${Math.round(currentData.main?.["temp_max"])}\xB0 L: ${Math.round(currentData.main?.["temp_min"])}\xB0`}</h5>
                                <h6>{`Feels like: ${Math.round(currentData.main?.["feels_like"])}\xB0`}</h6>
                            </div>                                    
                        </Col>
                    </Row>                    
                    <Row className="mt-3 justify-content-around">
                        <Col className="col-lg-6">
                            <div className="text-center">
                                <h5>Sunrise</h5>
                                <h6>{timestamp(currentSunriseTime)}</h6>
                            </div>
                        </Col>
                        <Col className="col-lg-6">
                            <div className="text-center">
                                <h5>Sunset</h5>
                                <h6>{timestamp(currentSunsetTime)}</h6>
                            </div>
                        </Col>                        
                    </Row>
                    <hr className="my-1"/>
                    <Row className="justify-content-around">
                        <Col className="col-lg-6">
                            <div className="text-center">
                                <h5>Wind</h5>
                                <h6>{`${directionMap(currentData.wind?.["deg"])} ${Math.round(currentData.wind?.["speed"] * 3.6)} km/h`}</h6>
                            </div>
                        </Col>
                        <Col className="col-lg-6">
                            <div className="text-center">
                                <h5>Precipitation</h5>
                                <h6>{`${Math.round(isNaN(currentData.rain?.["1h"]) ? '0' : currentData.rain?.["1h"])} mm`}</h6>
                            </div>
                        </Col>                        
                    </Row>
                    <hr className="my-1"/>
                    <Row className="justify-content-around">
                        <Col className="col-lg-6">
                            <div className="text-center">
                                <h5>Pressure</h5>
                                <h6>{`${currentData.main?.["pressure"]} hPa`}</h6>
                            </div>
                        </Col>
                        <Col className="col-lg-6">
                            <div className="text-center">
                                <h5>Humidity</h5>
                                <h6>{`${currentData.main?.["humidity"]}%`}</h6>
                            </div>
                        </Col>                        
                    </Row>
                </div>
            </div>
        </div>
    )
}
