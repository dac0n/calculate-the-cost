let crew = document.getElementById("crew");
let effeciency = document.getElementById("effeciency");
let offLight = document.getElementById("offLight");
let turbo = document.getElementById("turbo");

let lengthEl = document.getElementById("length");
let resultEl = document.getElementById("result");
let statsEl = document.getElementById("stats");
let powerEl = document.getElementById("power");
let weightEl = document.getElementById("weight");

let result, stats;

var form = document.querySelector("form");

//Is it worth importing jQuery just to shrink this document a little?
//I think it's not.

const calculateSpeed = (power, weight) => {
  return (20 + 5e-3 * power) * (1 - 1e-4 * weight);
};

form.addEventListener("change", () => {
  lightConsumption = !offLight.checked ? 0.02 : 0;
  power = turbo.checked ? powerEl.value*2 : powerEl.value;
  weight = weightEl.value;
  length = lengthEl.value;
  speed = calculateSpeed(power, weight);
  maxSpeed = calculateSpeed(power * 2, weight); 
  requiredPower = weight / 2;

  /* fuelConsumption = (2 + (0.0005 * power) * (1 - effeciency.value) * 4) * 0.01;  */ 
  // old formula (effeciency does not affect optics fuel consumtion)
  fuelConsumption = (lightConsumption + 2e-5 * power) * (1 - effeciency.value);
  supplyConsumption = crew.value>0 ? (crew.value * 0.04 - 0.04) : 0;
  hoursSpent = length / speed;
  fuelSpent = hoursSpent * fuelConsumption;
  daysSpent = hoursSpent / 24;
  supplySpent = daysSpent * supplyConsumption;
  terror = (offLight.checked ? hoursSpent * 0.26 : hoursSpent * 0.13).toFixed(2);
  time =
    daysSpent >= 1
      ? daysSpent.toFixed(1) + " days"
      : hoursSpent.toFixed(1) + " hours";
  time = time.slice(0, 3) !== 1 ? time : time.slice(0, -1);
  result = 
    weight < 0 
      ? "Please enter positive weight" 
      : length <= 0
      ? "Please enter positive distance."
      : power < requiredPower
      ? `The ship will not move if the power is less than ${requiredPower}.`
      : `You will spend ${time} at sea, consuming ${fuelSpent.toFixed(2)} fuel and ${supplySpent.toFixed(2)} supplies. 
      Your terror will increase by ${terror}.`;
  resultEl.innerText = result;
  stats = (length>0 && power>=requiredPower) ? `Ship speed: ${speed.toFixed(2)} km/h (${((speed * 6)/1.097).toFixed(0)} ft./round). 
  Supply consumption: ${supplyConsumption}/day.` : null;
  
  statsEl.innerText = stats;
});
