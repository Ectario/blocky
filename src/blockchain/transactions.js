import msgpack from '@msgpack/msgpack';
import { sha256 } from "../utils/hashing.js"
import { Wallet } from "../signatures/wallet.js"

class TxOutput {
    constructor(value, pubKeyHash) {
        this.value = value;
        this.pubKeyHash = pubKeyHash
    }
    canBeUnlocked(address) {
        return this.pubKeyHash == Wallet.addressToPublicKeyHash(address);
    }
    isLockedBy(pubKeyHash) {
        return this.pubKeyHash = pubKeyHash;
    }
}

class TxInput {
    constructor(ID, out, signature, pubKey) {
        this.ID = ID;
        this.out = out;
        this.signature = signature;
        this.pubKey = pubKey;
    }
    canUnlock(pubKeyHash) {
        return Wallet.getPublicKeyHash(this.pubKey) == pubKeyHash;
    }
}

export class Transaction {

    constructor(ID, inputs, outputs) {
        this.ID = ID;
        this.inputs = inputs;
        this.outputs = outputs;
    }

    setID() {
        const encoded = msgpack.encode(this);
        const hash = sha256(encoded.toString())
        this.ID = `${hash}`;
    }

    isCoinBase() {
        return this.inputs.length == 1 && this.inputs[0].ID.length == 0 && this.inputs[0].out == -1
    }

    static CoinbaseTx(data, to) {
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

    sign(privKey, prevTXs) {
        if (this.isCoinBase()) {
            return;
        }

        for (let input of this.inputs) {
            if (prevTXs[input.ID].ID == null) {
                console.log("Error: Previous transaction " + `${input.ID}` + " is not correct");
            }
        }

        let txCopy = this.#TrimmedCopy();
        for (let [inputIdx, input] of txCopy.inputs.entries()) {
            let prevTx = prevTXs[input.ID];
            txCopy.inputs[inputIdx].signature = null;
            txCopy.inputs[inputIdx].pubKey = prevTx.outputs[input.out].pubKeyHash;
            txCopy.setID();
            txCopy.inputs[inputIdx].pubKey = null;
            let signature = privKey.sign(txCopy.ID);
            this.inputs[inputIdx].signature = signature;
        }
    }

    verify(prevTXs) {
        if (this.isCoinBase()) {
            return;
        }

        for (let input of this.inputs) {
            if (prevTXs[input.ID].ID == null) {
                console.log("Error: Previous transaction " + `${input.ID}` + " is not correct");
            }
        }

        let txCopy = this.#TrimmedCopy();
        for (let [inputIdx, input] of txCopy.inputs.entries()) {
            let prevTx = prevTXs[input.ID];
            txCopy.inputs[inputIdx].signature = null;
            txCopy.inputs[inputIdx].pubKey = prevTx.outputs[input.out].pubKeyHash;
            txCopy.setID();
        
            if(!input.pubKey.verify(txCopy.ID, input.signature)){
                return false;
            }
        }
        return true;
    }

    #TrimmedCopy() {
        let inputs = []
        let outputs = []
        for (let input of this.inputs) {
            inputs.push(new TxInput(input.ID, input.out, null, null));
        }
        for (let output of this.outputs) {
            outputs.push(new TxOutput(output.value, output.pubKeyHash));
        }
        let txCopy = new Transaction(this.ID, inputs, outputs);
        return txCopy;
    }

}



