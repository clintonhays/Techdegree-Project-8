//
// - - - - - - - - - - Global Variables - - - - - - - - - - //
//

const closeTitle = document.querySelector('.close-title');
const titleScreen = document.getElementById('title-screen');
const main = document.getElementById('main-wrapper');
const search = document.getElementById('search');
let employees = [];
const urlAPI = 'https://randomuser.me/api/?results=12&inc=name,location,phone,dob,picture&noinfo&nat=US';
const directory = document.querySelector('.directory');
const directoryWrapper = document.getElementById('directory-wrapper');
const overlay = document.querySelector('.overlay');
const modalContent = document.querySelector('.modal-content');
const modalClose = document.querySelector('.close-modal');
const scrollRight = document.querySelector('.scroll-right');
const scrollLeft = document.querySelector('.scroll-left');

//
// - - - - - - - - - - Fetch - - - - - - - - - - //
//

// prettier-ignore
// Fetch api and display employee info in grid
fetch(urlAPI)
    .then(res => res.json())
    .then(res => res.results)
    .then(displayEmployees)
    .catch(err => console.log(err))

//
// - - - - - - - - - - Functions - - - - - - - - - - //
//

/**
 * inserts html based on fetched employee data
 * 
 * @param {employeeData} employeeData - an array of objects from Fetch
 * create employeeHTML to be inserted into grid  
 */

function displayEmployees (employeeData) {
	// set empty employees array to the employeeData array
	employees = employeeData;
	// initialize empty template literal to hold html markup
	employeeHTML = ``;
	// loop over each object in the employees array
	employees.forEach((employee, index) => {
		// assign variables to the object
		let name = employee.name;
		let city = employee.location.city;
		let picture = employee.picture;
		// add html markup to variable
		// prettier-ignore
		employeeHTML += `
        <div class="card" data-index="${index}">
            <div class="employee-img">
                <img class="avatar" src="${picture.large}" alt="employee picture">
            </div>
            <div class="employee-info">
                <h2 class="employee-name">${name.first} ${name.last}</h2>
                <p class="employee-email">${name.first.toLowerCase().slice(0,1)}${name.last.toLowerCase()}@example.com</p>
                <p class="employee-city">${city}</p>
            </div>
        </div>
        `
	});
	// insert the markup
	directoryWrapper.innerHTML = employeeHTML;
}

/**
 * 
 * @param {index} index - index of the employee card
 * create modal to be displayed when card is clicked 
 * display overly
 * insert modal content
 */

function displayModal (index) {
	// initialize varibles to hold object properties using deconstruction
	let { name, dob, phone, email, location: { city, street, state, postcode }, picture } = employees[index];
	let date = new Date(dob.date);
	// create modal markup
	// prettier-ignore
	const modalHTML = `
    <img class="avatar" src="${picture.large}" alt="employee picture">
        <div class="text-container">
        <h2 class="employee-name">${name.first} ${name.last}</h2> 
        <p class="employee-email">${name.first.toLowerCase().slice(0,1)}${name.last.toLowerCase()}@example.com</p>
        <p class="employee-city">${city}</p>
            <hr>
            <p>${phone}</p>
            <p class="address">${street.number} ${street.name}, ${state} ${postcode}</p>
            <p>Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
        </div>
    `;
	// display overlay & insert modal content
	overlay.classList.remove('hidden');
	modalContent.innerHTML = modalHTML;
}

//
// - - - - - - - - - - Event Listeners - - - - - - - - - - //
//

closeTitle.addEventListener('click', () => {
	titleScreen.animate([ { transform: 'translateY(-100%)' } ], {
		duration : 800,
		easing   : 'ease-in',
		fill     : 'forwards'
	});
	main.animate([ { transform: 'translateY(0)' } ], {
		duration : 800,
		easing   : 'ease-in',
		fill     : 'forwards'
	});
	main.classList.remove('hidden');
	closeTitle.classList.add('hidden');
});

// Search functionality
search.addEventListener('keyup', (e) => {
	// initialize variables for input value, and employee names array
	const searchStr = e.target.value.toLowerCase();
	const names = document.querySelectorAll('.card h2');
	// loop over each name in the array
	const searchResults = names.forEach((name) => {
		// if the name does not include the value, the card is hidden
		if (!name.textContent.toLowerCase().includes(searchStr)) {
			name.closest('.card').classList.add('hidden');
		}
		else if (name.textContent.toLowerCase().includes(searchStr)) {
			// if the name does include value, the card is displayed
			name.closest('.card').classList.remove('hidden');
		}
	});
	// returns the results of the search
	return searchResults;
});

// modal display functionality
directoryWrapper.addEventListener('click', (e) => {
	// make sure the target is a card or inside the card
	if (e.target !== directoryWrapper) {
		// declare variables to access the index of each card
		const card = e.target.closest('.card');
		let index = card.getAttribute('data-index');

		// display the modal information for the card with matching index
		displayModal(index);

		// scroll forward through modals
		scrollRight.addEventListener('click', () => {
			// display the modal with index + 1
			if (index < employees.length - 1) {
				index++;
				displayModal(index);
			}
		});

		//scroll back through modals
		scrollLeft.addEventListener('click', () => {
			// display the modal with index - 1
			if (index > 0) {
				index--;
				displayModal(index);
			}
		});
	}
});

// close modal
modalClose.addEventListener('click', () => {
	// hide overlay
	overlay.classList.add('hidden');
});
