import { sha256 } from "../utils/hashing.js"

const toHex = dec => dec.toString(16);

export class Proof {
    block;
    target;
    static DIFFICULTY = 16n;

    constructor(block){
        this.block = block;
        this.target = 1n << ( 256n - Proof.DIFFICULTY );
    }

    initData(nonce){
        return this.block.prevHash + this.block.hashTransactions() + toHex(nonce) + toHex(Proof.DIFFICULTY);
    }

    run(){
        for (let nonce = 0; nonce < Number.MAX_SAFE_INTEGER; nonce++) {
            let data = this.initData(nonce);
            let hash = sha256(data);
            if (Number("0x" + hash) < this.target){
                return { nonce, hash };
            }
        }
        throw new Error('[ERROR] In Proof.js, Run() can\'t a valid nonce for block.data=' + this.block.data);
    }

    validate(){
        let data = this.initData(this.block.nonce);
        let hash = sha256(data);
        return Number("0x" + hash) < this.target;
    }
}