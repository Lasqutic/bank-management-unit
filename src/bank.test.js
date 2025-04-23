import Bank from './bank.js';
describe('Bank', () => {
    let bank;

    beforeEach(() => {
        bank = new Bank();
    });

    test('should pass with valid client', () => {
        expect(() => {
            bank.register({ name: 'Oliver White', balance: 100 });
        }).not.toThrow();
    });

    test('should throw when trying to register client with negative balance', () => {
        expect(() => {
            bank.register({ name: 'Oliver White', balance: -100 });
        }).toThrow('It is impossible to add a client with a negative balance');
    });

    test('should throw when создаються два клиента с одинаковыми именами', () => {
        expect(() => {
            bank.register({ name: 'Oliver White', balance: 100 });
            bank.register({ name: 'Oliver White', balance: 10 });
        }).toThrow('"Oliver White" already exists');
    });

    test('should pass при попалнении баланса', () => {

        const id = bank.register({ name: 'Oliver White', balance: 100 });
        expect(bank.clients.get(id).balance).toBe(100);
        bank.emit('add', id, 5);
        expect(bank.clients.get(id).name).toBe('Oliver White');
        expect(bank.clients.get(id).name).toBe('Oliver White');
        expect(bank.clients.get(id).balance).toBe(105);

    });

    test('There should throw when trying to add a negative amount', () => {
        expect(() => {
            const id = bank.register({ name: 'Oliver White', balance: 100 });
            bank.emit('add', id, -100);
        }).toThrow("Amount = '-100' must be positive");
    });

    test('There should throw when you try to withdraw more than you have in your account', () => {
        expect(() => {
            const id = bank.register({ name: 'Oliver White', balance: 100 });
            bank.emit('withdraw', id, 200);
        }).toThrow('Not enough funds');
    });


    test('should pass when withdrawing money from the account', () => {

        const id = bank.register({ name: 'Oliver White', balance: 100 });
        expect(bank.clients.get(id).balance).toBe(100);
        bank.emit('withdraw', id, 50);
        expect(bank.clients.get(id).balance).toBe(50);

    });

    test('should throw when trying to send a negative amount', () => {
        expect(() => {
            const id1 = bank.register({ name: 'Oliver White', balance: 100 });
            const id2 = bank.register({ name: 'Sem', balance: 100 });
            bank.emit('send', id1, id2, -50);
        }).toThrow("Amount = '-50' must be positive");
    });

    test('should pass when sending funds', () => {

        const id1 = bank.register({ name: 'Oliver White', balance: 100 });
        const id2 = bank.register({ name: 'Sem', balance: 100 });
        bank.emit('send', id1, id2, 50);

    });

    test('should throw when trying to use an id that does not exist', () => {
        expect(() => {

            const id1 = bank.register({ name: 'Oliver White', balance: 100 });
            const id2 = '1234'
            bank.emit('send', id1, id2, 50);
        }).toThrow("Client with ID '1234' not found");
    });

    test('should pass without going over the limit', () => {
        expect(() => {

            const id1 = bank.register({
                name: 'Oliver White',
                balance: 800,
                limit: amount => amount < 100
            });
            bank.emit('withdraw', id1, 99);
        }).not.toThrow();
    });

    test('should throw when trying to go over the limit', () => {
        expect(() => {

            const id1 = bank.register({
                name: 'Oliver White',
                balance: 800,
                limit: amount => amount < 100
            });
            bank.emit('withdraw', id1, 200);
        }).toThrow("Limit check failed");
    });


    test('should pass by changing the transaction limit and not exceeding it', () => {
        expect(() => {

            const id1 = bank.register({
                name: 'Oliver White',
                balance: 1000,
                limit: amount => amount < 100
            });

            bank.emit('changeLimit', id1, (amount, currentBalance,
                updatedBalance) => {
                return amount > 100 && updatedBalance > 700 && currentBalance > 800;
            });

            bank.emit('withdraw', id1, 111);
        }).not.toThrow();
    });

    test('should throw changing the transaction limit and going beyond it', () => {
        expect(() => {

            const id1 = bank.register({
                name: 'Oliver White',
                balance: 1000,
                limit: amount => amount < 100
            });

            bank.emit('changeLimit', id1, (amount, currentBalance,
                updatedBalance) => {
                return amount > 100 && updatedBalance > 700 && currentBalance > 800;
            });

            bank.emit('withdraw', id1, 300);
        }).toThrow('Limit check failed');
    });

});