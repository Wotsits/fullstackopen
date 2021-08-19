import React from 'react';

const Total = ({ course }) => {
    const sum = course.parts.reduce((num, part) => {
      return part.exercises + num
    }, 0)
    return(
      <h3>Number of exercises {sum}</h3>
    ) 
  }

  export default Total