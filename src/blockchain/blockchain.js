import { Proof } from '../blockchain/proof.js';
import { sha256 } from "../utils/hashing.js"
import { Transaction } from './transactions.js';

export class BlockChain {
    constructor() {
        this.blocks = [];
    }

    addBlock(transactions_or_block) {
        if(transactions_or_block instanceof Block){
            this.blocks.push(transactions_or_block);
            return;
        }
        let lastHash;
        if(this.blocks.length > 0){
            lastHash = this.blocks[this.blocks.length - 1].hash;
        } else {
            lastHash = sha256("big-bang");
        }
        let newBlock = new Block(transactions_or_block, lastHash);
        this.blocks.push(newBlock);
    }

    findUnspentTransactions(address){
        let unspentTxs = [];
        let spentTXOs = {};
        const blocks = [...this.blocks];
        for (const block of blocks.reverse()) {
            for (let tx of block.transactions) {
                let txID = tx.ID;
                
                for (let [outIdx, out] of tx.outputs.entries()) {
                    var isCurrendIdx = false;
                    if (spentTXOs[txID]) {
                        for (let spentOut of spentTXOs[txID]) {
                            if (spentOut === outIdx) {
                                isCurrendIdx = true;
                                break;
                            }
                        }
                    }
                    if (!isCurrendIdx && out.canBeUnlocked(address)) {
                        unspentTxs.push(tx);
                    } else {
                        continue;
                    }
                }
                if (!tx.isCoinBase()) {
                    for (let input of tx.inputs) {
                        if (input.canUnlock(address)) {
                            let inTxID = input.ID;
                            if (!spentTXOs[inTxID]) {
                                spentTXOs[inTxID] = [];
                            }
                            spentTXOs[inTxID].push(input.out);
                        }
                    }
                }
            }
        }
        return unspentTxs;
    }

    findUTXO(address){
        let UTXOs = [];
        let unspentTransactions = this.findUnspentTransactions(address);
        for (let tx of unspentTransactions){
            for (let out of tx.outputs){
                if (out.canBeUnlocked(address)){
                    UTXOs.push(out);
                }
            }
        }
        return UTXOs;
    }

    findSpendableOutputs(address, amount) {
        let unspentOuts = {};
        let unspentTxs = this.findUnspentTransactions(address);
        let accumulated = 0;
    
        for (let tx of unspentTxs) {
            let txID = tx.ID;
            for (let [outIdx, out] of tx.outputs.entries()) {
                if (out.canBeUnlocked(address) && accumulated < amount) {
                    accumulated += out.value;
                    if (!unspentOuts[txID]) {
                        unspentOuts[txID] = [];
                    }
                    unspentOuts[txID].push(outIdx);
                    if (accumulated >= amount) {
                        return { accumulated, unspentOuts };
                    }
                }
          }
        }
        return { accumulated, unspentOuts };
      }


    static InitBlockChain(address) {
        let tx = Transaction.CoinbaseTx("Genesis data", address);
        let genesisBlock = Block.Genesis(tx);
        let newBlockChain = new BlockChain();
        newBlockChain.addBlock(genesisBlock);
        return newBlockChain;
    }
}

class Block {
    hash;
    transactions;
    prevHash;
    nonce;

    constructor(transactions, prevHash) {    
        this.transactions = transactions;
        this.prevHash = prevHash;
        this.nonce = 0;
        let pow = new Proof(this);
        let { nonce, hash } = pow.run();
        this.nonce = nonce;
        this.hash = hash;
    }

    hashTransactions(){
        var hashes = "";
        for (const tx of this.transactions) {
            hashes += `${sha256(tx.ID)}`;
        }
        return sha256(hashes);
    }

    static Genesis(coinbaseTx) {
        return new Block([coinbaseTx], "");
    }
}