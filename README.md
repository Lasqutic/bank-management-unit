# Bank Management Unit

A simple banking system simulator using an event-driven architecture with Node.js and ES Modules.

##  Description

The `Bank` class implements core banking operations, including:

- Client registration with balance and limit
- Depositing funds
- Withdrawing funds
- Transferring funds between clients
- Changing withdrawal limits
- Error handling via the `'error'` event

All actions are managed using the built-in `EventEmitter`.

##  Quickstart

### 1. Install dependencies (if needed)

```bash
npm ci
```

### 2. Run the project

```bash
node ./src/index.js
```

Or if you're using a `package.json` script:

```bash
npm start
```

Make sure your `package.json` contains:

```json
{
  "type": "module",
  "scripts": {
    "start": "node ./src/index.js"
  }
}
```

##  Expected Output

When running `index.js`, you should see output similar to:

```
Error: Client with name "Oliver White" already exists
Error: It is impossible to add a client with a negative balance
I have 805₴
I have 0₴
Error: Not enough funds
I have 750₴
Error: Amount = '-50' must be positive
Error: Client with ID '12321dasd' not found
I have 800₴
Error: Limit check failed
I have 795₴
```

## 📁 Project Structure

```
project-root/
│
├── src/
│   ├── bank.js         # Bank class definition
│   └── index.js        # Usage example
├── package.json
└── README.md
```

##  Features

- Simple registration and client management
- Custom withdrawal limits per client
- Error reporting through EventEmitter
- Modular and extendable design

##  Example Usage

```js
import Bank from './bank.js';

const bank = new Bank();

const id = bank.register({
  name: 'Ivan',
  balance: 100,
  limit: (amount, current, updated) => amount < 50
});

bank.emit('withdraw', id, 20);
bank.emit('get', id, (balance) => {
  console.log(`I have ${balance}₴`);
});
```