import { Proof } from '../blockchain/proof.js';

export class BlockChain {
    constructor() {
        this.blocks = [];
    }

    addBlock(data) {
        if (data instanceof Block) { this.blocks.push(data); }
        else { // just a data
            var lastHash = this.blocks[this.blocks.length - 1].hash;
            var newBlock = new Block(data, lastHash);
            this.addBlock(newBlock);
        }
    }
    
    static InitBlockChain() {
        var genesisBlock = Block.Genesis();
        var newBlockChain = new BlockChain();
        newBlockChain.addBlock(genesisBlock);
        return newBlockChain;
    }
}

class Block {
    hash;
    data;
    prevHash;
    nonce;

    constructor(data, prevHash) {
        this.data = data;
        this.prevHash = prevHash;
        this.nonce = 0;
        let pow = new Proof(this);
        let nonce, hash = pow.run();
        this.nonce = nonce;
        this.hash = hash;
    }

    static Genesis() {
        return new Block("Genesis", "");
    }
}