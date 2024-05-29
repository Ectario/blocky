import { BlockChain } from './blockchain/blockchain.js';
import { printBlockChain, getBalance, send, WalletBank } from './utils/usages.js';

function main(projectName) {
    console.log(projectName + " says hello!");
    let names = ["Alice", "Benjamin", "Clara", "David", "Elise", "Félix", "Gabrielle", "Hugo", "Isabelle", "Julien"]

    const chain = BlockChain.InitBlockChain(names[0]);

    send(names[0], names[1], 10, chain);
    send(names[0], names[1], 20, chain);
    send(names[0], names[1], 20, chain);
    send(names[0], names[1], 10, chain);
    send(names[0], names[1], 20, chain);
    send(names[0], names[1], 20, chain);
    send(names[1], names[2], 30, chain);
    send(names[2], names[3], 10, chain);
    send(names[2], names[3], 10, chain);

    printBlockChain(chain);

    console.log([names[0], getBalance(names[0], chain)]);
    console.log([names[1], getBalance(names[1], chain)]);
    console.log([names[2], getBalance(names[2], chain)]);
    console.log([names[3], getBalance(names[3], chain)]);

    let walletBank = new WalletBank();
    walletBank.createWallet(names[0]);
    walletBank.createWallet(names[1]);
    walletBank.createWallet(names[2]);
    walletBank.createWallet(names[3]);
    walletBank.printWallets(true);

}

main("Blocky");