import { useState } from "react";
import axios from "axios";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "2f9eddaa3b55a7f7a0bd48d005a875f4";

  // 🔍 Search Weather
  const getWeather = async () => {
    if (!city) return;

    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`
      );

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city.trim()}&appid=${API_KEY}&units=metric`
      );

      setWeather(res.data);
      setForecast(forecastRes.data.list.slice(0, 5));
    } catch (err) {
      setError("City not found / API issue");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // 📍 Location Weather
  const getLocationWeather = () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        setLoading(true);

        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        const forecastRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );

        setWeather(res.data);
        setForecast(forecastRes.data.list.slice(0, 5));
        setError("");
      } catch {
        setError("Location fetch failed");
      } finally {
        setLoading(false);
      }
    });
  };

  // 🎨 Dynamic Background
  const getBackground = () => {
    if (!weather) return "from-blue-400 to-indigo-600";

    const main = weather.weather[0].main;

    if (main === "Clear") return "from-yellow-400 to-orange-500";
    if (main === "Clouds") return "from-gray-400 to-gray-600";
    if (main === "Rain") return "from-blue-700 to-gray-800";
    if (main === "Snow") return "from-blue-200 to-white";
    return "from-blue-400 to-indigo-600";
  };

  // 🌤 Icon
  const getIcon = () => {
    if (!weather) return "🌍";

    const main = weather.weather[0].main;

    if (main === "Clear") return "☀️";
    if (main === "Clouds") return "☁️";
    if (main === "Rain") return "🌧️";
    if (main === "Snow") return "❄️";
    return "🌍";
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        className={`min-h-screen flex flex-col items-center justify-center transition-all duration-500 bg-gradient-to-br ${getBackground()} dark:from-gray-900 dark:to-gray-800`}
      >
        {/* Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-5 right-5 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white shadow"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        {/* Card */}
        <div className="bg-white/30 dark:bg-gray-800/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-96 text-center">

          <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            🌦 Weather App
          </h1>

          {/* Input */}
          <input
            type="text"
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded-lg outline-none bg-white dark:bg-gray-700 text-black dark:text-white"
          />

          {/* Buttons */}
          <button
            onClick={getWeather}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
          >
            Search
          </button>

          <button
            onClick={getLocationWeather}
            className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
          >
            📍 Use My Location
          </button>

          {/* Loading */}
          {loading && (
            <p className="mt-4 text-white animate-pulse">
              ⏳ Fetching weather...
            </p>
          )}

          {/* Error */}
          {error && <p className="text-red-400 mt-3">{error}</p>}

          {/* Weather */}
          {weather && !loading && (
            <div className="mt-6 text-gray-800 dark:text-white">

              <div className="text-5xl mb-2">{getIcon()}</div>

              <h2 className="text-xl font-semibold">{weather.name}</h2>

              <p className="capitalize">
                {weather.weather[0].description}
              </p>

              <div className="text-4xl font-bold my-2">
                {weather.main.temp}°C
              </div>

              <div className="flex justify-between text-sm mt-3">
                <p>💧 {weather.main.humidity}%</p>
                <p>🌬 {weather.wind.speed} m/s</p>
              </div>
            </div>
          )}

          {/* Forecast */}
          {forecast.length > 0 && !loading && (
            <div className="mt-6 text-white">
              <h3 className="mb-2 font-semibold">Next Hours</h3>
              <div className="flex gap-2 overflow-x-auto">
                {forecast.map((item, index) => (
                  <div key={index} className="bg-white/20 p-2 rounded-lg text-sm">
                    <p>{new Date(item.dt_txt).getHours()}:00</p>
                    <p>{item.main.temp}°C</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;