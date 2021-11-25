import React, { useState } from "react";
import "./Home.css";

import spinner from "../assets/spin.gif";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function Home() {
  const api = {
    key: "112cfbcf50c1426c58831873178768a8",
    base: "https://api.openweathermap.org/data/2.5/",
  };

  const [searchBrowser, setSearchBrowser] = useState("");
  const [weather, setWeather] = useState({});
  const [tempCalc, setTempCalc] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = () => {
    setLoading(true);
    fetch(
      `${api.base}weather?q=${searchBrowser}&units=metric&appid=${api.key}&lang=pt`
    )
      .then((res) => res.json())
      .then((result) => {
        setWeather(result);
        setSearchBrowser("");
        setTempCalc({
          city: result.name,
          country: result.sys.country,
          date: format(new Date(), "cccc, d 'de' LLLL 'de' yyyy	", {
            locale: ptBR,
          }),
          icon: result.weather[0].icon,
          temp_min: Math.floor(result.main.temp_min),
          temp_current: Math.floor(result.main.temp),
          temp_description: result.weather[0].description,
          temp_max: Math.floor(result.main.temp_max),
          humidity: result.main.humidity,
          sunrise: format(result.sys.sunrise * 1000, "HH:mm"),
          sunset: format(result.sys.sunset * 1000, "HH:mm"),
        });
        setError("");
      })
      .catch(() => {
        setError("Error: Informe um nome de cidade Válido");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <main className="container">
      {!weather.main ? (
        <section className="container_input">
          <input
            type="text"
            placeholder="Buscar por cidade"
            onChange={(e) => setSearchBrowser(e.target.value)}
            value={searchBrowser}
          />
          {error && <p className="msg_error">{error}</p>}
          {loading ? (
            <div className="loading">
              <img src={spinner} alt="spinner gif" />
            </div>
          ) : (
            <button disabled={!searchBrowser} onClick={search}>Procurar</button>
          )}
        </section>
      ) : (
        <div className="container_weather">
          <header>
            <h1>
              {tempCalc.city}, {tempCalc.country}
            </h1>
            <span>{tempCalc.date}</span>
          </header>

          <section className="primary_info">
            <div className="temp_min">
              <p>Mínima</p>
              <span>{tempCalc.temp_min}&deg;C</span>
            </div>

            <div className="temp_actual">
              <img
                src={`http://openweathermap.org/img/wn/${tempCalc.icon}@4x.png`}
                alt="Icone Temperatura"
              />
              <p>{tempCalc.temp_current}&deg;C</p>
              <span>{tempCalc.temp_description}</span>
            </div>

            <div className="temp_max">
              <p>Máxima</p>
              <span>{tempCalc.temp_max}&deg;C</span>
            </div>
          </section>

          <div className="secondary_info">
            <div className="properties">
              <p>Umidade</p>
              <p>Nascer do Sol</p>
              <p>Pôr do Sol</p>
            </div>

            <div className="results">
              <p>{tempCalc.humidity}%</p>
              <p>{tempCalc.sunrise}</p>
              <p>{tempCalc.sunset}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
export default Home;