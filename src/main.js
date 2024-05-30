import { BlockChain } from './blockchain/blockchain.js';
import { printBlockChain, getBalance, send, WalletBank } from './utils/usages.js';

function main(projectName) {
    console.log(projectName + " says hello!");
    
    let names = ["Alice", "Benjamin", "Clara", "David", "Elise", "Félix", "Gabrielle", "Hugo", "Isabelle", "Julien"].slice(0,4);
    let walletsBank = new WalletBank();
    for (const name of names) {
        walletsBank.createWallet(name);
    }

    const chain = BlockChain.InitBlockChain(walletsBank.wallets[names[0]].address);
    

    send(walletsBank.wallets[names[0]], walletsBank.wallets[names[1]].address, 10, chain);
    send(walletsBank.wallets[names[0]], walletsBank.wallets[names[1]].address, 20, chain);
    send(walletsBank.wallets[names[0]], walletsBank.wallets[names[1]].address, 20, chain);
    send(walletsBank.wallets[names[0]], walletsBank.wallets[names[1]].address, 10, chain);
    send(walletsBank.wallets[names[0]], walletsBank.wallets[names[1]].address, 20, chain);
    send(walletsBank.wallets[names[0]], walletsBank.wallets[names[1]].address, 5, chain);
    send(walletsBank.wallets[names[0]], walletsBank.wallets[names[1]].address, 5, chain);
    send(walletsBank.wallets[names[0]], walletsBank.wallets[names[1]].address, 5, chain);
    send(walletsBank.wallets[names[0]], walletsBank.wallets[names[1]].address, 5, chain);
    send(walletsBank.wallets[names[1]], walletsBank.wallets[names[2]].address, 30, chain);
    send(walletsBank.wallets[names[2]], walletsBank.wallets[names[3]].address, 10, chain);
    send(walletsBank.wallets[names[2]], walletsBank.wallets[names[3]].address, 10, chain);

    printBlockChain(chain);

    console.log([names[0], getBalance(walletsBank.wallets[names[0]].address, chain)]);
    console.log([names[1], getBalance(walletsBank.wallets[names[1]].address, chain)]);
    console.log([names[2], getBalance(walletsBank.wallets[names[2]].address, chain)]);
    console.log([names[3], getBalance(walletsBank.wallets[names[3]].address, chain)]);

    walletsBank.printWallets(false);

}

main("Blocky");