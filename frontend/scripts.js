import * as api from "./js/api.js";
const api_path = "http://127.0.0.1:8000/api";

// navbar elements
const toggleButton = document.getElementById('nav-hamburger-button');
const navbarLinksList = document.getElementById('nav-links-list');
const links = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('nav-bar');
const navExpenses = document.getElementById('nav-expenses');

// login elements
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');

// expenses list elements
const listExpensesTableBody = document.getElementById('list-expenses-body');

// message box elements
const messageBox = document.getElementById('message-box');
const messageBoxText = messageBox.firstElementChild;
const messageBoxClasses = ['success', 'warning', 'error'];

// get all sections
const sections = document.getElementsByTagName('section');
let selectedSection = 1;

// expenses elements
const createExpensesForm = document.getElementById('create-expenses-form')
const updateExpensesForm = document.getElementById('update-expenses-form')
const createExpensesButton = document.getElementById('create-expenses');
let updateExpansesId;

// expenses pagination elements
const paginationNumbers = document.getElementById("pagination-numbers");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");
const paginationLimit = 4;
let expensesList = [];
let currentPage = 1;
let pageCount = 1;


prevButton.addEventListener("click", () => {
    setCurrentPage(currentPage - 1);
});


nextButton.addEventListener("click", () => {
    setCurrentPage(currentPage + 1);
});


// show or hide menu on hamburger button click
toggleButton.addEventListener('click', () => {
    navbarLinksList.classList.toggle('active');
});


// hide menu on link click
links.forEach(link => link.addEventListener('click', () => {
    closeNavbar();
}));


// hide menu is clicked outside navbar
window.addEventListener('click', event => {
    if (!navbar.contains(event.target)) {
        closeNavbar();
    }
});


function closeNavbar() {
    navbarLinksList.classList.remove('active');
}


function showSetion(index) {
    for (let i = 0; i < sections.length; i++) {
        sections[i].style.display = 'none';
    }

    sections[index].style.display = 'inherit';

    if (index == 0) {
        logoutButton.style.display = "none";
        navExpenses.style.display = "none";
    } else if (localStorage.getItem('token') != null) {
        logoutButton.style.display = "inherit";
        navExpenses.style.display = "inherit";
    }
}


// check if user is logged in
async function isLoggedIn() {
    const token = localStorage.getItem('token');

    if (token == null) {
        showSetion(0);
    } else {
        const url = `${api_path}/login/test-token`;
        const result = await api.checkToken(url, token);

        if (result.error == '') {
            listExpenses(0, 100);
            showSetion(selectedSection);
        } else {
            localStorage.removeItem('token');
            console.error(result.error);
            setMessageBox(2, 'Server is unavailable, try again later')
            showSetion(0);
        }
    }
}


isLoggedIn()


// clicked on logout button
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    showSetion(0);
    loginForm.reset();
    setMessageBox(1, 'You are successfully logged out');
});


// apply a message text and a color to the message box
function setMessageBox(classNameIndex, message) {
    messageBox.style.display = "inherit";
    messageBoxText.innerHTML = message;
    messageBox.classList.remove(...messageBoxClasses);
    messageBox.classList.add(messageBoxClasses[classNameIndex]);

    setTimeout(() => {
        messageBox.style.display = "none";
    }, 5000);
}


// login in the api
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const url = `${api_path}/login/access-token`;
    const formData = new FormData(loginForm);
    const result = await api.login(url, formData);

    if (result.error == '') {
        const token = result.data.access_token;
        localStorage.setItem('token', token);
        listExpenses(0, 100);
        showSetion(selectedSection);
        setMessageBox(0, 'You are successfully logged in');
    } else {
        localStorage.removeItem('token');
        showSetion(0);
        setMessageBox(2, 'Login attempt failed');
    }
});


// go to expenses list
navExpenses.addEventListener('click', (event) => {
    event.preventDefault();
    showSetion(1);
});


// go to expenses form
createExpensesButton.addEventListener('click', (event) => {
    event.preventDefault();
    createExpensesForm.reset();
    showSetion(2);
});


// create an expense in the api
createExpensesForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token')

    if (token == null) {
        setMessageBox(1, 'You must be logged in first')
    } else {
        const formData = Object.fromEntries(new FormData(createExpensesForm).entries());
        const result = await api.post(`${api_path}/expenses`, formData, token);

        if (result.error == '') {
            if (result.detail == null) {
                setMessageBox(0, 'Expenses created successfully');
                isLoggedIn();
            } else {
                setMessageBox(2, data.detail);
            }
        } else {
            console.error(error);
            setMessageBox(2, 'Server is unavailable, try again later');
        }
    }
});


// update expenses in the api
updateExpensesForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token')

    if (token == null) {
        setMessageBox(1, 'You must be logged in first')
    } else {
        const formData = Object.fromEntries(new FormData(updateExpensesForm).entries());
        const url = `${api_path}/expenses/${updateExpansesId}`;
        const result = await api.put(url, formData, token);

        if (result.error == '') {
            if (result.detail == null) {
                setMessageBox(0, 'Expenses updated successfully');
                isLoggedIn();
            } else {
                setMessageBox(2, result.detail);
            }
        } else {
            console.error(result.error);
            setMessageBox(2, 'Server is unavailable, try again later');
        }
    }
});


// calculate expenses balance
function calculateBalance(data) {
    let balance = 0;
    balance += parseFloat(data.income);
    balance -= parseFloat(data.food);
    balance -= parseFloat(data.clothing);
    balance -= parseFloat(data.housing);
    balance -= parseFloat(data.healthcare);
    balance -= parseFloat(data.transportation);
    balance -= parseFloat(data.education);
    balance -= parseFloat(data.entertainment);
    return balance;
}


function editExpenses(id) {
    const index = expensesList.findIndex(x => x.id == id);

    if (index > -1) {
        // store currently edited record to use when the save button on the update form
        updateExpansesId = id;
        let obj = expensesList[index];

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                let element = updateExpensesForm.querySelector(`[name="${key}"]`);

                if (element) {
                    element.value = obj[key];
                }
            }
        }

        showSetion(3);
    } else {
        setMessageBox(2, 'Item not found')
    }
}


async function deleteExpenses(id, rowElement) {
    const token = localStorage.getItem('token')

    if (token == null) {
        setMessageBox(1, 'User not logged in')
    } else {
        const url = `${api_path}/expenses/${id}`;
        const result = await api.del(url, token);

        if (result.error == '') {
            setMessageBox(0, 'Expenses deleted successfully');
            listExpensesTableBody.removeChild(rowElement);

            // remove the object from the expenses list data
            const index = expensesList.findIndex(x => x.id == id);

            // only splice array when item is found
            if (index > -1) {
                // 2nd parameter means remove one item only
                expensesList.splice(index, 1);
            }
        } else {
            localStorage.removeItem('token');
            showSetion(0);
            setMessageBox(2, 'Server is unavailable, try again later');
            console.error(result.error)
        }
    }
}


// list expenses
async function listExpenses(skip, limit) {
    const token = localStorage.getItem('token')

    if (token == null) {
        setMessageBox(1, 'User not logged in')
    } else {
        const result = await api.get(`${api_path}/expenses`, { [skip]: skip, [limit]: limit }, token);

        if (result.error == '') {
            if (result.data.length > 0) {
                expensesList = result.data;
                pageCount = Math.ceil(expensesList.length / paginationLimit);
                setExpensesList();
            }
        } else {
            localStorage.removeItem('token');
            setMessageBox(2, 'Server is unavailable, try again later');
            showSetion(0);
            console.error(result.error);
        }
    }
}


// create the elements in the expenses list table
function populateExpenses() {
    const startIndex = (currentPage - 1) * paginationLimit;
    const data = expensesList.slice(startIndex, startIndex + paginationLimit);
    listExpensesTableBody.innerHTML = "";

    data.forEach(function (element) {
        const tr = document.createElement('tr');
        listExpensesTableBody.appendChild(tr);
        const th = document.createElement('th')
        th.innerText = element.title;
        tr.appendChild(th);
        const td1 = document.createElement('td')
        td1.innerText = calculateBalance(element).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
        tr.appendChild(td1);
        const td2 = document.createElement('td');
        tr.appendChild(td2);
        const buttonEdit = document.createElement('button')
        buttonEdit.innerText = 'Edit';
        buttonEdit.addEventListener('click', function () { editExpenses(element.id); });
        td2.appendChild(buttonEdit);
        const buttonDelete = document.createElement('button')
        buttonDelete.innerText = 'Delete';
        buttonDelete.addEventListener('click', function () { deleteExpenses(element.id, tr); });
        td2.appendChild(buttonDelete);
    });
}


const disableButton = (button) => {
    button.classList.add("disabled");
    button.disabled = true;
};


const enableButton = (button) => {
    button.classList.remove("disabled");
    button.disabled = false;
};


const handlePageButtonsStatus = () => {
    if (currentPage == 1) {
        disableButton(prevButton);
    } else {
        enableButton(prevButton);
    }

    if (currentPage == pageCount) {
        disableButton(nextButton);
    } else {
        enableButton(nextButton);
    }
};


const handleActivePageNumber = () => {
    paginationNumbers.querySelectorAll(".pagination-number").forEach((button) => {
        button.classList.remove("active");
        const pageIndex = Number(button.getAttribute("page-index"));

        if (pageIndex == currentPage) {
            button.classList.add("active");
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    });
};


const appendPageNumber = (index) => {
    const pageNumber = document.createElement("button");
    pageNumber.className = "pagination-number";
    pageNumber.innerHTML = index;
    pageNumber.setAttribute("page-index", index);
    pageNumber.setAttribute("aria-label", "Page " + index);

    paginationNumbers.appendChild(pageNumber);
};


const getPaginationNumbers = () => {
    paginationNumbers.innerHTML = "";

    for (let i = 1; i <= pageCount; i++) {
        appendPageNumber(i);
    }
};


const setCurrentPage = (pageNum) => {
    currentPage = pageNum;
    handleActivePageNumber();
    handlePageButtonsStatus();
    populateExpenses();
};


const setExpensesList = () => {
    getPaginationNumbers();
    setCurrentPage(1);

    paginationNumbers.querySelectorAll(".pagination-number").forEach((button) => {
        const pageIndex = Number(button.getAttribute("page-index"));

        if (pageIndex) {
            button.addEventListener("click", () => {
                setCurrentPage(pageIndex);
            });
        }
    });
};
