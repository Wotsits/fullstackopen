import './App.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios'


////////////////////////////

const ShowButton = ({country, onClick}) => {
  return (
    <button value={country} onClick={onClick} type="button">Show</button>
  )
}

/////////////////////////////

const Search = ({ onChange, searchTerm }) => {
  return (
    <p>find country <input onChange={onChange} value={searchTerm}/></p>
  )
}

/////////////////////////////

const LanguageListItem = ({language}) => {
  return (
    <li>{language}</li>
  )
}

/////////////////////////////

const CurrentCapitalWeather = ({currentCapitalWeather}) => {
  if (currentCapitalWeather === "") {
    return (
      <div>Weather is loading.</div>
    )
    
  }
  else {
    console.log(currentCapitalWeather)
    return (
      <div>
        <h4>Weather in {currentCapitalWeather.location.name}</h4>
        <p>Temperature: {currentCapitalWeather.current.temperature} celsius</p>
        <p>Wind: {currentCapitalWeather.current.wind_speed}mph</p>
        <img alt="current weather conditions" src={currentCapitalWeather.current.weather_icons[0]}/>
      </div>
    )
  }
}

/////////////////////////////

const SingleResultDisplay = ({currentCapitalWeather, country}) => {
  console.log(country)
  return (
    <div>
      <h3>{country.name}</h3>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <h5>Languages</h5>
      <ul>
        {country.languages.map(language => <LanguageListItem language={language.name}/>)}
      </ul>
      <img alt="country flag" src={country.flag} width="100px"/>
      <CurrentCapitalWeather currentCapitalWeather={currentCapitalWeather}/>
    </div>
  )
}

/////////////////////////////

const ResultsDisplay = ({ currentCapitalWeather, showButtonClickHandler, results}) => {
  if (results.length === 0) {
    return (
      <p>No results to show</p>
    )
  }
  else if (results.length > 10) {
    return (
      <p>Too many results to show.  Refine your search</p> 
    )
  }
  else if (results.length === 1) {
    return (
      results.map(result => <SingleResultDisplay currentCapitalWeather={currentCapitalWeather} country={result}/>)
    )
  } 
  else {
    return (
      results.map(result => <p key={result.alpha2Code}>{result.name}<ShowButton country={result.name} onClick={showButtonClickHandler}/></p>)
    )
  }
}

////////////////////////////////

const App = () => {

  ///////////////

  const [searchTerm, setSearchTerm] = useState("")
  const [resultsList, setResultsList] = useState([])
  const [resultsToShow, setResultsToShow] = useState([])
  const [currentCapital, setCurrentCapital] = useState("")
  const [currentCapitalWeather, setCurrentCapitalWeather] = useState("")

  ///////////////

  const api_key = process.env.REACT_APP_API_KEY
  const weatherApiEndPoint = `http://api.weatherstack.com/current?access_key=${api_key}&query=${currentCapital}`

  ///////////////

  const changeSearchTerm = (event) => {
    setSearchTerm(event.target.value)
  }

  const showButtonClickHandler = (event) => {
    const country = event.target.value 
    setResultsToShow(resultsList.filter(listing => listing.name.includes(country)))
  }

  const updateResultsToShow = () => {
    searchTerm === '' 
      ? setResultsToShow([]) 
      : setResultsToShow(resultsList.filter(listing => listing.name.includes(searchTerm)))
  }

  const getResultsList = () => {
    axios
      .get(`https://restcountries.eu/rest/v2/all`)
      .then(response => {
        setResultsList(response.data)
      })
  }

  const handleWeatherCityChange = () => {
    if (resultsToShow.length === 1) {
      setCurrentCapital(resultsToShow[0].capital)
    }
  }

  const updateCityWeather = () => {
    if (resultsToShow.length === 1) {
      axios.get(weatherApiEndPoint)
      .then(response => {
        setCurrentCapitalWeather(response.data)
      })    
    }
  }

  useEffect(handleWeatherCityChange, [resultsToShow])

  useEffect(updateCityWeather, [currentCapital])
  
  useEffect(handleWeatherCityChange, [resultsToShow])

  useEffect(updateResultsToShow, [searchTerm])

  useEffect(getResultsList, [])

  ///////////////

  return (
    <div>
      <h1>Countries</h1>
      <Search onChange={changeSearchTerm} searchTerm={searchTerm}/>
      <ResultsDisplay currentCapitalWeather={currentCapitalWeather} showButtonClickHandler={showButtonClickHandler} results={resultsToShow} />
      </div>
  )
}

export default App