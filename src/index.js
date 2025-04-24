import Bank from './bank.js';

const bank = new Bank();
const personId1 = bank.register({
    name: 'Oliver White',
    balance: 1000,
    limit: amount => amount > 10
});

const personId2 = bank.register({ 
    name: 'John Black',
    balance: 1000,
});

bank.emit('add', personId1, 200);
bank.emit('get', personId1, (balance) => {
    console.log(`I have ${balance}₴`); // I have 1200₴
});

bank.emit('withdraw', personId1, 100);

bank.emit('get', personId1, (balance) => {
    console.log(`I have ${balance}₴`); // I have 1100₴
});

bank.emit('send', personId2, personId1, 1000);

bank.emit('get', personId1, (balance) => {
    console.log(`I have ${balance}₴`); // I have 2100₴
});
bank.emit('get', personId2, (balance) => {
    console.log(`I have ${balance}₴`); // I have 0₴
});