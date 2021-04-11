const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3'); //konstruktor
const web3 = new Web3(ganache.provider()); //instancja
const { interface, bytecode } = require('../compile');

//w jednej aplikacji mozna korzystać z kilku instancji web3 
//każda instancja ma providera- konfigurację do komunikacji z daną siecią Eth

let accounts;
let inbox;

beforeEach(async () => {
    //get a list of all account
    accounts = await web3.eth.getAccounts();

    //use one of those accounts to create contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hi there!'] })
        .send({from: accounts[0], gas: '1000000'});
});

describe('Inbox',() => {
    it('deploys a contract', () => {
        console.log(inbox);
    });
});