let length = document.getElementById("length");
let power = document.getElementById("power");
let weight = document.getElementById("weight");
let crew = document.getElementById("crew");
let effeciency = document.getElementById("effeciency");
let resultEl = document.getElementById("result");
let result;

var form = document.querySelector("form");
form.addEventListener("change", () => {
  speed = 20 * (1 + 0.00025 * power.value) * (1 - 0.0001 * weight.value);
  fuelConsumption =
    (2 + 0.0005 * power.value * (1 - effeciency.value) * 4) * 0.01;
  supplyConsumption = crew.value * 0.04;
  hoursSpent = length.value / speed;
  fuelSpent = hoursSpent * fuelConsumption;
  daysSpent = hoursSpent / 24;
  supplySpent = daysSpent * supplyConsumption;
  requiredPower = weight.value / 2;
  time =
    daysSpent >= 1
      ? daysSpent.toFixed(1) + " days"
      : hoursSpent.toFixed(1) + " hours";
  time = time.slice(0, 3) !== 1 ? time : time.slice(0, -1);
  result =
    power.value < requiredPower
      ? `The ship will not move if the power is less than ${requiredPower}.`
      : `You will spend ${time} in sea, consuming ${fuelSpent.toFixed(2)} fuel and ${supplySpent.toFixed(2)} supplies. 
      Your terror will increase by ${(hoursSpent * 0.13).toFixed(2)}.`;
  resultEl.innerText = result;
});
