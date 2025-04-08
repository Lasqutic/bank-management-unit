import Bank from './bank.js';

const bank = new Bank();
const personId = bank.register({
    name: 'Oliver White',
    balance: 800,
    limit: amount => amount < 10
});
const personIdTwo = bank.register({ // Error "Oliver White" already exists
    name: 'Oliver White',
    balance: 600,
    limit: amount => amount < 10
});
const personIdThree = bank.register({ // Error It is impossible to add a client with a negative balance
    name: 'Ben Black',
    balance: -100,
});
const personIdFour = bank.register({ 
    name: 'John Black',
    balance: 100,
});
const personIdFiveth = bank.register({
    name: 'Ivan Smith',
    balance: 100
});
const personIdSix = bank.register({
    name: 'Alan Whiter',
    balance: 700
});
const testIdOne = '12321dasd'
const testIdTwo = '121dasd'

bank.emit('add', personId, 5);
bank.emit('get', personId, (balance) => {
    console.log(`I have ${balance}₴`); // I have 805₴
});

bank.emit('withdraw', personIdFour, 100);
bank.emit('get', personIdFour, (amount) => {
    console.log(`I have ${amount}₴`); // I have 0₴
});
bank.emit('withdraw', personIdFour, 10);
bank.emit('get', personIdFour, (amount) => {
    console.log(`I have ${amount}₴`); // Error:  Not enough funds
});


bank.emit('send', personIdFiveth, personIdSix, 50);
bank.emit('get', personIdSix, (balance) => {
console.log(`I have ${balance}₴`); // I have 750₴
});
bank.emit('send', personIdFiveth, personIdSix, -50); //Error:  Amount = '-50' must be positive
bank.emit('send', testIdOne, testIdTwo, 50); //Error:  Client with ID '12321dasd' not found

bank.emit('withdraw', personId, 5);
bank.emit('get', personId, (amount) => {
    console.log(`I have ${amount}₴`); // I have 800₴
});

bank.emit('changeLimit', personId, (amount, currentBalance,
    updatedBalance) => {
    return amount < 100 && updatedBalance > 700;
});
bank.emit('withdraw', personId, 5); // Error Limit check failed

bank.emit('changeLimit', personId, (amount, currentBalance,
    updatedBalance) => {
    return amount < 100 && updatedBalance > 700 && currentBalance > 800;
});
bank.emit('withdraw', personId, 95);
bank.emit('get', personId, (amount) => {
    console.log(`I have ${amount}₴`); // I have 795₴
});
