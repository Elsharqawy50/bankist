"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const loginForm = document.querySelector(".login");
const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// variables
let currentAccount;
let isSort = false;

// helper func to display movements
const displayMovements = (acc, sort) => {
  containerMovements.innerHTML = "";

  const mov = sort ? [...acc.movements].sort((a, b) => a - b) : acc.movements;

  mov.forEach((mov, i) => {
    const status = mov > 0 ? "deposit" : "withdrawal";

    const html = `<div class="movements__row">
      <div class="movements__type movements__type--${status}">${
      i + 1
    } ${status}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// helper func to display total balance
const displayTotalBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr);
  labelBalance.textContent = `${acc.balance}€`;
};

// helper func to display summary
const displaySummary = (acc) => {
  const totalIncomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, curr) => acc + curr);
  labelSumIn.textContent = `${totalIncomes}€`;

  const totalOutcomes = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, curr) => acc + curr);
  labelSumOut.textContent = `${Math.abs(totalOutcomes)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => deposit * (acc.interestRate / 100))
    .filter((interest) => interest >= 1)
    .reduce((acc, curr) => acc + curr);
  labelSumInterest.textContent = `${interest}€`;
};

// helper func to create username for each account
const createUserName = (accs) => {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUserName(accounts);

// update ui
const updateUI = (acc) => {
  displayMovements(acc, false);
  displayTotalBalance(acc);
  displaySummary(acc);
};

// login logic
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) =>
      acc.username === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );

  if (currentAccount) {
    // show user data and welcome
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(" ")[0]
    },`;

    //clear inputs
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    inputLoginUsername.blur();
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

// transfer logic
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const transferAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  const amount = Number(inputTransferAmount.value);
  if (
    transferAcc &&
    transferAcc.username !== currentAccount.username &&
    amount > 0 &&
    amount <= currentAccount.balance
  ) {
    currentAccount.movements.push(-amount);
    transferAcc.movements.push(amount);

    updateUI(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = "";
    inputTransferTo.blur();
    inputTransferAmount.blur();
  }
});

// close account logic
btnClose.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);
    inputCloseUsername.value = inputClosePin.value = "";
    containerApp.style.opacity = 0;
    currentAccount = null;
  }
});

// request loan
btnLoan.addEventListener("click", (e) => {
  e.preventDefault();

  const requestLoan = Number(inputLoanAmount.value);
  const isLoan = currentAccount.movements.some(
    (mov) => mov >= requestLoan * 0.1
  );
  if (requestLoan > 0 && isLoan) {
    currentAccount.movements.push(requestLoan);
    updateUI(currentAccount);
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
  }
});

// sort movements
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  isSort = !isSort;
  displayMovements(currentAccount, isSort);
});
