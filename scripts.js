let length = document.getElementById("length");
let powerEl = document.getElementById("power");
let weightEl = document.getElementById("weight");
let crew = document.getElementById("crew");
let effeciency = document.getElementById("effeciency");
let resultEl = document.getElementById("result");
let statsEl = document.getElementById("stats");
let offLight = document.getElementById("offLight");
let turbo = document.getElementById("turbo");
let result, stats;

var form = document.querySelector("form");

const calculateSpeed = (power, weight) => {
  console.log(power, weight);

  return (20 + 5e-3 * power) * (1 - 1e-4 * weight);
};

form.addEventListener("change", () => {
  lightConsumption = !offLight.checked ? 0.02 : 0;
  power = turbo.checked ? powerEl.value*2 : powerEl.value;
  weight = weightEl.value;
  speed = calculateSpeed(power, weight);
  maxSpeed = calculateSpeed(power * 2, weight); 
  /* fuelConsumption = (2 + (0.0005 * power) * (1 - effeciency.value) * 4) * 0.01;  */ 
  // old formula (effeciency does not affect optics fuel consumtion)
  fuelConsumption = (lightConsumption + 2e-5 * power) * (1 - effeciency.value);
  supplyConsumption = crew.value * 0.04;
  hoursSpent = length.value / speed;
  fuelSpent = hoursSpent * fuelConsumption;
  daysSpent = hoursSpent / 24;
  supplySpent = daysSpent * supplyConsumption;
  requiredPower = weight / 2;
  terror = (offLight.checked ? hoursSpent * 0.26 : hoursSpent * 0.13).toFixed(2);
  time =
    daysSpent >= 1
      ? daysSpent.toFixed(1) + " days"
      : hoursSpent.toFixed(1) + " hours";
  time = time.slice(0, 3) !== 1 ? time : time.slice(0, -1);
  result =
    length.value <= 0
      ? "Please enter positive distance."
      : power.value < requiredPower
      ? `The ship will not move if the power is less than ${requiredPower}.`
      : `You will spend ${time} in sea, consuming ${fuelSpent.toFixed(2)} fuel and ${supplySpent.toFixed(2)} supplies. 
      Your terror will increase by ${terror}.`;
  resultEl.innerText = result;
  stats = `Ship speed: ${speed.toFixed(2)} km/h (${((speed * 6)/1.097).toFixed(0)} ft./round). 
  Supply consumption: ${supplyConsumption}/day.`;
  if (length.value>0) statsEl.innerText = stats;
});
