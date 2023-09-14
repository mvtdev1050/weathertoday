import logo from "./logo.svg";
import { useEffect, useState } from "react";
import "./App.css";
import cities from "cities.json";
// import city from "cities-json";
// const { city } = require("cities-json");

function App() {
    const [location, setLocation] = useState();
    const [current, setCurrent] = useState();
    const [bgImg, setBgImg] = useState("");
    const [searchcity, setSearchcity] = useState("");
    const [showlist, setShowlist] = useState(false);
    const [totalCity, setTotalCity] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);
    const updateDimensions = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };
    useEffect(() => {
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);
    console.log("width : ", width, "height : ", height);
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function async(position) {
                hitWeatherAPI(
                    position.coords.latitude,
                    position.coords.longitude
                );
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, []);

    useEffect(() => {
        let cityDetails = cities.filter((city) => {
            if (
                city.name.includes(searchcity) ||
                city.name.toLowerCase().includes(searchcity) ||
                city.name.toUpperCase().includes(searchcity)
            ) {
                return city;
            }
        });
        setTotalCity(cityDetails);
        if (searchcity) {
            setShowlist(true);
        } else {
            setShowlist(false);
        }
    }, [searchcity]);

    const handleSearch = () => {
        setShowlist(false);
        let cityDetails = cities.filter((city) => searchcity === city.name);
        hitWeatherAPI(cityDetails[0]?.lat, cityDetails[0]?.lng);
    };

    const hitWeatherAPI = (latVal, longVal) => {
        setShowlist(false);
        let lat = latVal;
        let long = longVal;
        let newHeight;
        let newWidth;
        if (width < 2000 && width > 1501) {
            newWidth = 1920;
            newHeight = 1080;
        } else if (width > 1401 && width < 1500) {
            newWidth = 1440;
            newHeight = 720;
        } else if (width > 1301 && width < 1400) {
            newWidth = 1366;
            newHeight = 768;
        } else if (width > 1201 && width < 1300) {
            newWidth = 1280;
            newHeight = 800;
        } else if (width > 1001 && width < 1200) {
            newWidth = 1024;
            newHeight = 768;
        } else {
            newWidth = 1080;
            newHeight = 1920;
        }
        if (lat && long) {
            const url = `https://weatherapi-com.p.rapidapi.com/current.json?q=${
                lat ? lat : "53.1"
            }%2C${long ? long : "2.3508"}`;
            const options = {
                method: "GET",
                headers: {
                    "X-RapidAPI-Key":
                        "1a9b0fb267msh6baa89733baea49p1b7dbfjsnab05e6fa9631",
                    "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
                },
            };
            fetch(url, options)
                .then((res) => res.json())
                .then((res) => {
                    console.log("res : ", res);
                    setLocation(res?.location);
                    setCurrent(res?.current);
                    setBgImg(
                        `https://source.unsplash.com/random/${newWidth}x${newHeight}/?${res?.current.condition.text}`
                    );
                })
                .catch((err) => console.log("err - ", err));
        }
    };

    const handleSelection = (latVal, longVal, nameVal) => {
        hitWeatherAPI(latVal, longVal);
        // setSearchcity(nameVal);
        setShowlist(false);
        setTotalCity([]);
    };

    return (
        <div className="weatherPage">
            {!!current && !!location && bgImg ? (
                <>
                    <img className="bgImg" src={bgImg} alt="" />
                    <div className="overlay"></div>
                    <div className="weather">
                        <h1 className="mainHeading"> Weather Today </h1>
                        <div className="cityList">
                            <div className="inputSection">
                                <input
                                    type="Search City"
                                    value={searchcity}
                                    onChange={(e) =>
                                        setSearchcity(e.target.value)
                                    }
                                    placeholder="Enter city name..."
                                />
                                <button
                                    className="searchBtn"
                                    onClick={handleSearch}
                                >
                                    Search
                                </button>
                            </div>
                            {showlist && (
                                <div className="cityNameList">
                                    <ul>
                                        {totalCity.length > 0 &&
                                            totalCity.map((cityName, i) => (
                                                <li
                                                    key={i}
                                                    onClick={() =>
                                                        handleSelection(
                                                            cityName.lat,
                                                            cityName.lng,
                                                            cityName.name
                                                        )
                                                    }
                                                    className="listofcities"
                                                >
                                                    {cityName.name},{" "}
                                                    {cityName.country}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="location">
                            <strong>
                                Location : {location && location?.name + ","}{" "}
                                {location && location?.region + ","}{" "}
                                {location && location?.country}
                            </strong>
                            <div>
                                <span>
                                    Last Update :{" "}
                                    {current && current?.last_updated}
                                </span>
                            </div>
                        </div>
                        <div className="currentWeatherSec">
                            <div className="currentWeatherHead">
                                <h1>Current Weather</h1>
                                <strong className="currentWeather">
                                    <img
                                        src={current && current.condition.icon}
                                        alt=""
                                    />
                                    {current && current.condition.text}
                                </strong>
                            </div>
                        </div>
                        <div className="weatherDetails">
                            <div>
                                Temprature : {current && current.temp_c}°C
                            </div>
                            <div>
                                Feels Like : {current && current.feelslike_c}°C
                            </div>
                            <div>Humidity : {current && current.humidity}</div>
                            <div>
                                Wind speed : {current && current.gust_kph}/kmph
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="center">
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                    <div className="wave"></div>
                </div>
            )}
        </div>
    );
}

export default App;
