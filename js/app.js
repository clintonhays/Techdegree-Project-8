//
// - - - - - - - - - - Global Variables - - - - - - - - - - //
//

let employees = [];
const urlAPI = 'https://randomuser.me/api/?inc=name,location,email,phone,dob,picture&noinfo&nat=US';
const directory = document.getElementById('directory-wrapper');
const overlay = document.querySelector('.overlay');
const modalContent = document.querySelector('.modal-content');
const modalClose = document.querySelector('.close-modal');

//
// - - - - - - - - - - Fetch - - - - - - - - - - //
//

// prettier-ignore
fetch(urlAPI)
    .then(res => res.json())
    .then(res => res.results)
    .then(displayEmployees)
    .catch(err => console.log(err))

//
// - - - - - - - - - - Functions - - - - - - - - - - //
//

function displayEmployees (employeeData) {
	employees = employeeData;
	employeeHTML = ``;
	employees.forEach((employee, index) => {
		let name = employee.name;
		let email = employee.email;
		let city = employee.location.city;
		let picture = employee.picture;
		//prettier-ignore
		employeeHTML += `
        <div class="card" data-index="${index}">
            <div class="employee-img">
                <img class="avatar" src="${picture.large}" alt="employee picture">
            </div>
            <div class="employee-info">
                <h2 class="employee-name">${name.first} ${name.last}</h2>
                <p class="employee-email">${email}</p>
                <p class="employee-city">${city}</p>
            </div>
        </div>
        `
	});

	directory.innerHTML = employeeHTML;
}

function displayModal (index) {
	let { name, dob, phone, email, location: { city, street, state, postcode }, picture } = employees[index];
	let date = new Date(dob.date);
	//prettier-ignore
	const modalHTML = `
    <img class="avatar" src="${picture.large}" alt="employee picture">
        <div class="text-container">
        <h2 class="employee-name">${name.first} ${name.last}</h2> 
        <p class="employee-email">${email}</p>
        <p class="employee-city">${city}</p>
            <hr>
            <p>${phone}</p>
            <p class="address">${street.number} ${street.name}, ${state} ${postcode}</p>
            <p>Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
        </div>
    `;

	overlay.classList.remove('hidden');
	modalContent.innerHTML = modalHTML;
}

//
// - - - - - - - - - - Event Listeners - - - - - - - - - - //
//

directory.addEventListener('click', (e) => {
	if (e.target !== directory) {
		const card = e.target.closest('.card');
		const index = card.getAttribute('data-index');

		displayModal(index);
	}
});

modalClose.addEventListener('click', (e) => {
	overlay.classList.add('hidden');
});
