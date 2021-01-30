let crew = document.getElementById("crew");
let effeciency = document.getElementById("effeciency");
let offLight = document.getElementById("offLight");
let turbo = document.getElementById("turbo");
let cargo = document.getElementById("cargo");
let button = document.getElementById("changeForm");
let lengthLabel = document.getElementById("lengthLabel");

let lengthEl = document.getElementById("length");   //values to extract later
let resultEl = document.getElementById("result");
let statsEl = document.getElementById("stats");
let powerEl = document.getElementById("power");
let weightEl = document.getElementById("weight");
let fuelEl = document.getElementById("fuel");
let suppliesEl = document.getElementById("supplies");

lengthLabel.hidden=false;

let form = document.querySelector("form");

//Is it worth importing jQuery just to shrink this document a little?
//I think it's not.

const calculateSpeed = (power, weight) => {
  return (20 + 5e-3 * power) * (1 - 1e-4 * weight);
};


button.onclick = ()=>{
  let temp = lengthLabel.hidden;
  lengthLabel.hidden = cargo.hidden;
  cargo.hidden = temp;
  cargo.style.display = cargo.hidden ? "none" : 'flex';
  statsEl.innerText ='';
  lengthEl.value='', fuelEl.value='', suppliesEl.value='';
  resultEl.innerText = cargo.hidden ? "Enter the travel distance to calculate costs." : 'Enter your cargo to calculate distance.';
}

calculateBasics = () => {
  let lightConsumption = !offLight.checked ? 0.02 : 0;
  let power = turbo.checked ? powerEl.value*2 : powerEl.value;
  let weight = weightEl.value;
  let speed = calculateSpeed(power, weight);
  let maxSpeed = calculateSpeed(power * 2, weight); 
  let requiredPower = weight / 2;
  let fuelConsumption = (lightConsumption + 2e-5 * power) * (1 - effeciency.value);
  let supplyConsumption = crew.value>0 ? crew.value * 0.04 : 0;
  /* fuelConsumption = (2 + (0.0005 * power) * (1 - effeciency.value) * 4) * 0.01;  */ 
  // old formula (effeciency does not affect optics fuel consumtion)

  return basicResults = {lightConsumption, power, weight, speed, maxSpeed, requiredPower, fuelConsumption, supplyConsumption};
}

calculateWithLength = (speed, fuelConsumption, supplyConsumption) => {
  let length = lengthEl.value;
  let hoursSpent = length / speed;
  let fuelSpent = hoursSpent * fuelConsumption;
  let terror = (offLight.checked ? hoursSpent * 0.26 : hoursSpent * 0.13).toFixed(2);
  let supplySpent = hoursSpent/24 * supplyConsumption;
  let time = calculateTime(hoursSpent);
  return lenResults = {hoursSpent, terror, fuelSpent, supplySpent, length, time}
}

divider = (x) => {return(x.toFixed(1)==~~x?~~x:x.toFixed(1))};

calculateTime = (val) => {
   time = (() => {
    switch (true){
    case (val <= 24):
      return divider(val) + " hours";
    case (val >= 8760):
      return divider(val/8760) + " years";
    case (val >= 720):
      return divider(val/730) + " months";
    case (val >= 168):
      return divider(val/168) + " weeks";
    case (val >= 24):
        return divider(val/24) + " days";
    }
  })();
  time = time.includes('.') ? time : time.slice(0, -1);
  return time;
}

calculateFromSavings = (fuelConsumption, supplyConsumption, speed) => {
  let fuel = fuelEl.value || null;
  let supplies = suppliesEl.value;
  fueledFor = fuel ? calculateTime(fuel/fuelConsumption) : '0 hours';
  hoursAvailable = Math.min(fuel/fuelConsumption, supplies/supplyConsumption);
  console.log(`Fuel consumption: ${fuelConsumption}, hours available: ${hoursAvailable}`);
  console.log(`fuel/fuelConsumption: ${fuel/fuelConsumption}, supplies/supplyConsumption: ${supplies/supplyConsumption}`);

  saturatedFor = supplies ? calculateTime(supplies/supplyConsumption*24) : '0 hours';
  let lengthAvailable = hoursAvailable*speed;
  let squaresAvailable = lengthAvailable/260;
  let hoursPerSquare = 260/speed;
  let timePerSquare = calculateTime(hoursPerSquare);
  let terrorPerSquare = hoursPerSquare*0.13;
  let fuelPerSquare = (hoursPerSquare*fuelConsumption).toFixed(1);
  let suppliesPerSquare = (hoursPerSquare/24*supplyConsumption).toFixed(1);

  return savingsResults = {fueledFor, saturatedFor, lengthAvailable, squaresAvailable, timePerSquare, terrorPerSquare, fuelPerSquare, suppliesPerSquare};
}

changeDescription = (r, mode) => {          //r is result
  resultText =  r.weight < 0 
  ? "Please enter positive weight" 
  : r.power < r.requiredPower
  ? `The ship will not move if the power is less than ${r.requiredPower}.` 
  : mode === 'length' ? 
    r.length <= 0 
    ? "Please enter positive distance."
    : `You will spend ${r.time} in sea, consuming ${r.fuelSpent.toFixed(2)} fuel and ${r.supplySpent.toFixed(2)} supplies. 
    Your terror will increase by ${r.terror}.` : 
    mode === 'savings' ? 
    resultText = `Your supplies will last for ${r.saturatedFor}. 
    Your fuel will last for ${r.fueledFor}.
    Your ship will sail ${~~r.lengthAvailable} km or ${r.squaresAvailable.toFixed(1)} squares.
    Expenses per 1 square: ${r.fuelPerSquare} fuel, ${r.suppliesPerSquare} supplies, 
    ${r.terrorPerSquare.toFixed(1)} terror, ${r.timePerSquare}.` : 'Some mistake happened';
  
  resultEl.innerText = resultText;
  getStats(r);
}

getStats = (r) => {
  let stats = 
  (r.length>0 && r.power>=r.requiredPower) 
  ? `Ship speed: ${r.speed.toFixed(2)} km/h (${((r.speed * 6)/1.097).toFixed(0)} ft./round). 
  Supply consumption: ${r.supplyConsumption}/day.` 
  : null;
  statsEl.innerText = stats;
}


form.addEventListener("change", () => {

  basicResults = calculateBasics();

  if (lengthLabel.hidden){
    savingsResults = calculateFromSavings(basicResults.fuelConsumption, basicResults.supplyConsumption, basicResults.speed)
    let combinedResult = { ...basicResults, ...savingsResults};
    changeDescription(combinedResult, 'savings');
    console.log(combinedResult);
  }
  else {
    lenResults = calculateWithLength(basicResults.speed, basicResults.fuelConsumption, basicResults.supplyConsumption);
    let combinedResult = { ...basicResults, ...lenResults};
    changeDescription(combinedResult, 'length');
    console.log(combinedResult);
  }
  
});
