// Get references to DOM elements
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let isError = false;

// Function to clean input string by removing +, -, and spaces
function cleanInputString(str) {
  const regex = /[+-\s]/g;
  return str.replace(regex, '');
}

// Function to check if input string is in scientific notation (e.g., 1e10)
function isInvalidInput(str) {
  const regex = /\d+e\d+/i;
  return str.match(regex);
}

// Function to add a new entry input field
function addEntry() {
  // Get the target input container based on the selected dropdown value
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  // Calculate the entry number based on the number of existing input fields
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
  // Create the HTML string for the new entry input fields
  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
  <input
    type="number"
    min="0"
    id="${entryDropdown.value}-${entryNumber}-calories"
    placeholder="Calories"
  />`;
  // Insert the new entry input fields into the target input container
  targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

// Function to calculate the total calories
function calculateCalories(e) {
  e.preventDefault();
  isError = false;

  // Get all number input elements for each category
  const breakfastNumberInputs = document.querySelectorAll("#breakfast input[type='number']");
  const lunchNumberInputs = document.querySelectorAll("#lunch input[type='number']");
  const dinnerNumberInputs = document.querySelectorAll("#dinner input[type='number']");
  const snacksNumberInputs = document.querySelectorAll("#snacks input[type='number']");
  const exerciseNumberInputs = document.querySelectorAll("#exercise input[type='number']");

  // Calculate the total calories for each category
  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

  // Check for errors
  if (isError) {
    return;
  }

  // Calculate the consumed and remaining calories
  const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
  const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';
  
  // Update the output with the calculated values
  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
  <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>
  `;

  // Show the output
  output.classList.remove('hide');
}

// Function to get the total calories from a list of input elements
function getCaloriesFromInputs(list) {
  let calories = 0;

  // Iterate over each input element in the list
  for (const item of list) {
    // Clean the input value
    const currVal = cleanInputString(item.value);
    // Check for invalid input
    const invalidInputMatch = isInvalidInput(currVal);

    if (invalidInputMatch) {
      alert(`Invalid Input: ${invalidInputMatch[0]}`);
      isError = true;
      return null;
    }
    // Convert currVal to a number and add it to the calories total
    calories += Number(currVal);
  }
  return calories;
}

// Function to clear the form
function clearForm() {
  // Get all input containers
  const inputContainers = Array.from(document.querySelectorAll('.input-container'));

  // Clear the content of each input container
  for (const container of inputContainers) {
    container.innerHTML = '';
  }

  // Clear the budget input and output
  budgetNumberInput.value = '';
  output.innerText = '';
  output.classList.add('hide');
}

// Add event listeners
addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener("click", clearForm);
