import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(countries);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      const data = response.data;
      setCountries(data);
    });
  }, []);

  const handleQueryChange = (e) => {
    let value = e.target.value;
    setQuery(value);
    setTimeout(() => {
      filterCountries(countries, value);
    }, 300);
  };

  const filterCountries = (arr, query) => {
    const newResult = arr.filter((c) =>
      c.name.common.toLowerCase().includes(query.toLowerCase())
    );
    console.log(newResult);
    setResult(newResult);
  };

  return (
    <div>
      <Filter query={query} onChange={handleQueryChange} />
      <Countries result={result} />
    </div>
  );
};

const Filter = ({ query, onChange }) => {
  return (
    <div>
      filter countries <input value={query} onChange={onChange} />
    </div>
  );
};

const Countries = ({ result }) => {
  const [selCountry, setSelCountry] = useState();
  
  const showView = (country) => () => {
    setSelCountry(country);
  };

  if (result.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (result.length === 1) {
    const c = result[0];
    return <CountryView country={c} />;
  }
  return (
    <div>
      <ul>
        {result.map((c) => (
          <li key={c.name.official}>
            {c.name.common} <button onClick={showView(c)}>show</button>
          </li>
        ))}
      </ul>
      {JSON.stringify(selCountry) ? <CountryView country={selCountry} /> : ""}
    </div>
  );
};

const CountryView = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <span>capital {country.capital[0]}</span>
      <h4>languages:</h4>
      <ul>
        {Object.values(country.languages).map((l) => (
          <li>{l}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt="flag"></img>
    </div>
  );
};

export default App;
