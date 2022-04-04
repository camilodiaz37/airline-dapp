# Airline DAPP

_It is an application built with truffle and react, creating a smart contract and deploying it on the ropsten network., where you can buy flights with ether, also you can see the purchased flights, and a loyalty points system._

### Pre-requisites

_what do you need before_

```
install Node js/npm    can be download on --->  https://nodejs.org/es/
clone the repository
```

### Instalation

_execute ganache to start a local server with testing wallets_

_Open terminal and navigate to the proyect_

_example:_
```
C://users/user> cd desktop
```
```
C://users/user/desktop> cd airline-dapp
```
_enter on client_

```
C://users/user/desktop/airline-dapp> cd client
```
_install dependencies_
```
C://users/user/desktop/airline-dapp> npm install
```
_and finally_
```
C://users/user/desktop/airline-dapp> npm start
```
_Now you can run the app on the port 3000

### Deploy your airline smart contract

_install truffle globally_
```
C://users/user> npm install -g truffle
```

_replace mnemonic seed on truffle-config.js file_

_and compile and deploy the contract_

```
C://users/user/desktop/airline-app> truffle compile
```
```
C://users/user/desktop/airline-app> truffle migrate --network ropsten
```


### Build with 

_libraries_

* [npm](https://nodejs.org/es/) - Dependency handler.
* [truffle-suit](https://trufflesuite.com/) - Development environment, testing framework and asset pipeline for blockchains using the Ethereum Virtual Machine (EVM).
* [web3](https://web3js.readthedocs.io/en/v1.7.1/) - Ethereum javascript API.
* [jest](https://jestjs.io/) - Library to testing.


_my deployed airline contract: https://ropsten.etherscan.io/address/0x7A5bF878A3a04771f9B2297e875BAfA78fAe4C0A_
