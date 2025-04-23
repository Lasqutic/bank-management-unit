import EventEmitter from 'events';
import crypto from 'crypto';

class Bank extends EventEmitter {
    constructor() {
        super();
        this.clients = new Map();

        this.#add();
        this.#get();
        this.#withdraw();
        this.#send();
        this.#changeLimit();
        this.#onError();
    }

    register({ name, balance, limit }) {
        try {
            if (balance <= 0) throw new Error('It is impossible to add a client with a negative balance');
    
            for (const client of this.clients.values()) {
                if (client.name === name) {
                    throw new Error(`Client with name "${name}" already exists`);
                }
            }
    
            const safeLimit = typeof limit === 'function' ? limit : () => true;
    
            const id = crypto.randomUUID();
            this.clients.set(id, { name, balance, limit: safeLimit });
            return id;
    
        } catch (err) {
            this.emit('error', err);
            return null;
        }
    }

    #onError() {
        this.on('error', (err) => {
            throw new Error(err.message)
        });
    }


    #add() {
        this.on('add', (id, balance) => {
            try {
                const client = this.#getClientById(id);
                const updatedBalance = client.balance + balance;
                this.#checkLimit(client, balance, updatedBalance);
                client.balance = updatedBalance;
            } catch (err) {
                this.emit('error', err);
            }
        });

    }
    #get() {
        this.on('get', (id, callback) => {
            try {
                const client = this.#getClientById(id);
                callback(client.balance);
            } catch (err) {
                this.emit('error', err);
            }
        });
    }
    #getClientById(id) {
        const client = this.clients.get(id);
        if (!client) {
            throw new Error(`Client with ID '${id}' not found`);
        }
        return client;
    }

    #checkLimit(client, amount, updatedBalance) {
        if (amount <= 0) throw new Error(`Amount = '${amount}' must be positive`);
        if (updatedBalance < 0) throw new Error('Not enough funds');
        if (!client.limit(amount, client.balance, updatedBalance)) {
            throw new Error('Limit check failed');
        }
    }
    #changeLimit() {
        this.on('changeLimit', (id, newLimit) => {
            try {
                const client = this.#getClientById(id);
                client.limit = newLimit;
            } catch (err) {
                this.emit('error', err);
            }
        });
    }

    #withdraw() {
        this.on('withdraw', (id, amount) => {
            try {
                const client = this.#getClientById(id);
                const updatedBalance = client.balance - amount;
                this.#checkLimit(client, amount, updatedBalance);
                client.balance = updatedBalance;
            } catch (err) {
                this.emit('error', err);
            }
        });
    }
    #send() {
        this.on('send', (senderId, recipientId, amount) => {
            try {
                const sender = this.#getClientById(senderId);
                const recipient = this.#getClientById(recipientId);

                const senderUpdatedBalance = sender.balance - amount;
                const recipientUpdatedBalance = recipient.balance + amount;

                this.#checkLimit(sender, amount, senderUpdatedBalance);
                this.#checkLimit(recipient, amount, recipientUpdatedBalance);

                sender.balance = senderUpdatedBalance;
                recipient.balance = recipientUpdatedBalance;
            } catch (err) {
                this.emit('error', err);
            }
        });
    }
}

export default Bank;