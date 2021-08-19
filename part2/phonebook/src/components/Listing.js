import React from 'react'

const Listing = ({ id, name, number, handleDeleteListing }) => {
    return (
        <li>{name} {number}<button onClick={() => handleDeleteListing(id)}>Delete</button></li>
    )
}

export default Listing