import express from "express";
import env from "dotenv";
import axios from "axios";
const app = express();
const port = 3000;
env.config();
const apiKey = process.env.API_KEY;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


function getDate(unixTime) {
    let today = new Date(unixTime * 1000);
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;

    return today;
}
function convertTime(unixTime) {
    let date = new Date(unixTime * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    let formattedTime = hours + ':' + minutes.slice(- 2) + ':' + seconds.slice(-2);
    return formattedTime;
}

app.get("/", (req, res) => {
   
    res.render("index.ejs");
})



app.post("/weather", async(req, res) => {
    

            try {
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${req.body.city}&appid=${apiKey}&units=metric`);
              
                const result = response.data;
                let dayTime = "am";
                if (convertTime(result.dt) >= convertTime(result.sys.sunset) && convertTime(result.dt) < convertTime(result.sys.sunrise)) {
                    dayTime = "pm";
                }

                let img;

                if (result.weather[0].main === "Clear") {
                    img = "images/sun.jpg";
                } else if (result.weather[0].main === "Snow") {
                    img = "images/snow.jpg";
                } else if (result.weather[0].main === "Rain" || result.weather[0].main === "Drizzle" || result.weather[0].main === "Thunderstorm") {
                    img = "images/rain.jpg";
                } else if (result.weather[0].main === "Clouds") {
                    img = "images/cloud.jpg";
                } else if (result.weather[0].main === "Mist" || result.weather[0].main === "Smoke" || result.weather[0].main === "Haze" || result.weather[0].main === "Fog") {
                    img = "images/mist.jpg";
                } else if (result.weather[0].main === "Dust" || result.weather[0].main === "Sand" || result.weather[0].main === "Ash") {
                    img = "images/dust.jpg";
                } else {
                    img = "images/wind.jpg";
                }
                
               
               const weather = {
                    date: getDate(result.dt),
                    time: convertTime(result.dt),
                    dayTime: dayTime,
                    img: img,
                    name: result.name,
                    temp: Math.floor(result.main.temp),
                    feels_like: Math.floor(result.main.feels_like),
                    main: result.weather[0].main,
                    description: result.weather[0].description,
                    icon_src: `https://openweathermap.org/img/wn/${result.weather[0].icon}@2x.png`,
                    humidity: result.main.humidity,
                    wind: Math.floor(result.wind.speed),
                    windGust: Math.floor(result.wind.gust),
                    clouds: result.clouds.all,
                    pressure: result.main.pressure,
                    visibility: result.visibility

                }
                    
            
               
                res.render("weather.ejs", {weather: weather});
              
            }
            catch(err) {
                console.log(err);
                res.render("index.ejs", {err: "City not found. Try again."});
            }   
  
})

app.get("/weather", (req, res) => {
    res.render("weather.ejs");
})



app.listen(port, (req, res) => {
    console.log(`Server running on port ${port}`);
});
