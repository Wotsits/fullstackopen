import React, { useEffect, useState } from 'react'
import axios from 'axios'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

import phonebookService from './services/phonebook.js'

const Notification = ({message, errorMessageType }) => {

  let messageStyle = {
    bakcgroundColor: 'cream',
    fontSize: 20,
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px"
  }

  if (errorMessageType === 1) {
    messageStyle.color = 'green'
    messageStyle.border = "2px green solid"
    messageStyle.backgroundColor = 'cream'
  }
  if (errorMessageType === 2) {
    messageStyle.color = 'red'
    messageStyle.border = "2px red solid"
    messageStyle.backgroundColor = 'lightgray'
  }

  if (message === null) {
    return null
  }
  return (
    <div style={messageStyle}>
      {message}
    </div>
  )
}

const App = () => {
  
  ////////////////////// Set State ///////////////////////
    
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('name')
  const [ newNumber, setNewNumber ] = useState('number')
  const [ searchField, setSearchField ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState(null)
  const [ errorMessageType, setErrorMessageType ] = useState(0)


  const fetch = () => {
    phonebookService.getAll()
    .then(initialItems => {
      setPersons(initialItems)
    })
  }

  useEffect(fetch, [])

  //////////////////////////////////////////////////////

  ////////////////////// Event Handlers /////////////////

  const updateNewName = (event) => {
    setNewName(event.target.value)
  }

  const updateNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const updateSearchField = (event) => {
    setSearchField(event.target.value)
  }

  const addNewName = (event) => {
    
    event.preventDefault()
    const newPersonObject = {
      name: newName,
      number: newNumber
    }

    const match = persons.some(person => person.name === newName)
    if (match) {
      const confirmation = window.confirm(`${newName} already exists in the phonebook.  Would you like to replace the number?`)
      if (!confirmation) {
        setNewName("")
        setNewNumber("")
      } 
      else {
        const matchedListing = persons.find(person => person.name === newName)
        phonebookService.update(matchedListing, newPersonObject.number)
        .then(updatedObject => {
          setPersons(persons.map(person => person.id !== updatedObject.id ? person : updatedObject))
          setNewName("")
          setNewNumber("")
        }) 
      }
      return 1
    }

    phonebookService
      .create(newPersonObject)
      .then(newObject => {
        setPersons(persons.concat(newObject))
        setNewName("")
        setNewNumber("")
        setErrorMessageType(1)
        setErrorMessage(`Added ${newPersonObject.name}`)
        setTimeout(() => {
          setErrorMessage(null)
          setErrorMessageType(0)
          }, 5000)
      })
      .catch(error => {
        setErrorMessageType(2)
        setErrorMessage(`Server error - Failed to add ${newPersonObject.name}`)
        setTimeout(() => {
          setErrorMessage(null)
          setErrorMessageType(0)
          }, 5000)
        })
      }

  const handleDeleteListing = (id) => {
    phonebookService
      .deleteListing(id)
      .then(data => {
        setErrorMessageType(1)
        setErrorMessage(`Person deleted successfully.`)
        setTimeout(() => {
          setErrorMessage(null)
          setErrorMessageType(0)
          }, 5000)
        })
      .catch(error => {
        setErrorMessageType(2)
        setErrorMessage(`Server error - Failed to delete - the person no longer exists`)
        setTimeout(() => {
          setErrorMessage(null)
          setErrorMessageType(0)
          }, 5000)
        })
      setPersons(persons.filter(person => person.id !== id))
      
  }

  const personsToShow = searchField === "" ? persons : persons.filter(person => person.name.includes(searchField))

  //////////////////////////////////////////////////////

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} errorMessageType={errorMessageType}/>
      <Filter onChange={updateSearchField} value={searchField}/>
      <h3>Add a new listing</h3>
      <PersonForm onSubmit={addNewName} nameValue={newName} nameOnChange={updateNewName} numberValue={newNumber} numberOnChange={updateNewNumber}/>
      <h2>Numbers</h2>
      <Persons 
        persons={personsToShow} 
        handleDeleteListing={handleDeleteListing}
      />
    </div>
  )
}

export default App
