import React from 'react'

import Listing from './Listing'



const Persons = ({ persons, handleDeleteListing }) => {
    
  return (
      <div>
        <ul>
          {persons.map((person) => {
            return(
              <div>
                <Listing key={person.name} id={person.id} name={person.name} number={person.number} handleDeleteListing={handleDeleteListing}/>
              </div>
            )
          })}
        </ul>
      </div>
    )
  }

  export default Persons