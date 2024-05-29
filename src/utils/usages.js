import { Transaction } from '../blockchain/transactions.js';
import { Wallet } from '../signatures/wallet.js';

export class WalletBank {
    constructor() {
        this.wallets = {};
    }
    createWallet(name) {
        this.wallets[name] = new Wallet();
    }
    printWallets(everything = false) {
        if (!everything) {
            for (let wallet of Object.entries(this.wallets)) {
                console.log(wallet);
            }
        }
        else {
            for (let wallet of Object.entries(this.wallets)) {
                console.log("   " + wallet[0] + " : " + wallet[1].address);
            }
        }
    }
}

export function printBlockChain(chain) {
    for (let [blockIdx, block] of chain.blocks.entries()) {
        console.log(`===================`);
        console.log(`Block ${blockIdx} :`);
        console.log(`   prevHash - ${block.prevHash}`);
        console.log(`   hash     - ${block.hash}`);
        console.log(`   nonce    - ${block.nonce}`);
        for (const tx of block.transactions) {
            console.log(``);
            console.log(`   Transaction ${tx.ID}:`);
            console.log(`       Inputs:`);
            for (const inp of tx.inputs) {
                console.log(`          id     - ${inp.ID}`);
                console.log(`          out    - ${inp.out}`);
                console.log(`          sig    - ${inp.sig}`);
                if (inp !== tx.inputs[tx.inputs.length - 1]) {
                    console.log(`          ------------------`);
                }
            }
            console.log(`       Outputs:`);
            for (const out of tx.outputs) {
                console.log(`          value     - ${out.value}`);
                console.log(`          pubkey    - ${out.pubKey}`);
                if (out !== tx.outputs[tx.outputs.length - 1]) {
                    console.log(`          ------------------`);
                }
            }
        }
    }
}

export function getBalance(address, chain) {
    let balance = 0;
    let UTXOs = chain.findUTXO(address);

    for (let out of UTXOs) {
        balance += out.value;
    }
    return balance;
}

export function send(from_address, to_address, amount, chain) {
    let tx = Transaction.NewTx(amount, chain, from_address, to_address);
    chain.addBlock([tx]);
}