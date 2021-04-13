const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); //konstruktor

const provider = ganache.provider();
const web3 = new Web3(provider); //instancja

const { interface, bytecode } = require('../compile');

const INITIAL_STRING = 'HellOski!'

//w jednej aplikacji mozna korzystać z kilku instancji web3 
//każda instancja ma providera- konfigurację do komunikacji z daną siecią Eth

let accounts;
let inbox;

beforeEach(async () => {
    //get a list of all account
    accounts = await web3.eth.getAccounts();

    //use one of those accounts to create contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: [INITIAL_STRING] }) //wrzutka do sieci
        .send({from: accounts[0], gas: '1000000'}); //info o samym kontrakcie

    inbox.setProvider(provider);
});

describe('Inbox',() => {
    it('deploys a contract', () => {
        //console.log(inbox);
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.strictEqual(message, INITIAL_STRING);
    });

    it('can change the message', async () => {
        await inbox.methods.setMsg('update').send({ from: accounts[0] });
        const msg = await inbox.methods.message().call();
        assert.strictEqual(msg, 'update');

    });

});

