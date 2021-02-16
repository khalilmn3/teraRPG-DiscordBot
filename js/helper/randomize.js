 function randomizeChance(list, discoveredZone) {
    let rand = Math.random() // get a random number between 0 and 1
    let accumulatedChance = 0 // used to figure out the current
  
    let found = list.find((element) => { // iterate through all elements 
        accumulatedChance += element.chance / 100  // accumulate the chances
        return accumulatedChance >= rand // tests if the element is in the range and if yes this item is stored in 'found'
    })
  
    if( found ) {
        return found;
    } else {
        return 0;
    }
     
     
 }
  
export default randomizeChance;