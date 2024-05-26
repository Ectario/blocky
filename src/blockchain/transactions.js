import msgpack from '@msgpack/msgpack';
import sha256 from 'crypto-js';
const { SHA256 } = sha256;
import CryptoJS from 'crypto-js';

class TxOutput {
    constructor(value, pubKey){
        this.value = value;
	    this.pubKey = pubKey; 
    }
    canBeUnlocked(data){
        return this.pubKey == data
    }
}

class TxInput {
    constructor(ID, out, sig){
        this.ID = ID;
	    this.out = out; 
	    this.sig = sig;
    }
    canUnlock(data){
        return this.sig == data
    }
}

export class Transaction {

    constructor(ID, inputs, outputs){
        this.ID = ID;
        this.inputs = inputs;
        this.outputs = outputs;
    }

    setID(){
        const encoded = msgpack.encode(this);
        const wordArray = CryptoJS.lib.WordArray.create(encoded);
        const hash = SHA256(wordArray)
        this.ID = `${hash}`;
    }

    isCoinBase(){
        return this.inputs.length == 1 && this.inputs[0].ID.length == 0 && this.inputs[0].out == -1
    }

    static CoinbaseTx(data, to){
        let txin = new TxInput("", -1, data);
        let txout = new TxOutput(100, to);
        let tx = new Transaction(null, [txin], [txout]);
	    tx.setID();
	    return tx;
    }

    static NewTx(amount, chain, from, to) {
        let inputs = [];
        let outputs = [];
    
        let { accumulated, unspentOuts } = chain.findSpendableOutputs(from, amount);

        if (accumulated < amount) {
          throw new Error("Error: not enough funds (" + `${accumulated}` + " < " + `${amount}` + ")");
        }
    
        for (const [txid, outs] of Object.entries(unspentOuts)) {
            for (const out of outs) {
                const input = new TxInput(txid, out, from);
                inputs.push(input);
            }
        }
    
        outputs.push(new TxOutput(amount, to));
    
        if (accumulated > amount) {
          outputs.push(new TxOutput(accumulated - amount, from));
        }
    
        const tx = new Transaction(null, inputs, outputs);
        tx.setID();
        return tx;
      }
}



