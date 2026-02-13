type WeatherAPIResponse = {
    coord: {
        lon: number,
        lat: number
    },
    weather: [
        {
            id: number,
            main: string,
            description: string,
            icon: string
        }
    ],
    base: string,
    main: {
        temp: number,
        feels_like: number,
        temp_min: number,
        temp_max: number,
        pressure: number,
        humidity: number,
        sea_level: number,
        grnd_level: number
    },
    visibility: number,
    wind: {
        speed: number,
        deg: number,
        gust: number
    },
    clouds: {
        all: number
    },
    dt: number,
    sys: {
        type: number,
        id: number,
        country: string,
        sunrise: number,
        sunset: number
    },
    timezone: number,
    id: number,
    name: string,
    cod: number
}

export const weatherAPI = async ({ lat, lon }: { lat: number, lon: number }) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`);
    const { main, wind, clouds, weather: weatherData } = await response.json() as WeatherAPIResponse;
    return {
        temperature: main.temp,
        feelsLike: main.feels_like,
        humidity: main.humidity,
        pressure: main.pressure,
        windSpeed: wind.speed,
        windDirection: wind.deg,
        cloudiness: clouds.all,
        weather: weatherData[0].main,
        description: weatherData[0].description,
        icon: weatherData[0].icon,
    };
}