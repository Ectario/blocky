import { genKeyPair } from "../signatures/keys.js"
import { sha256, ripemd160 } from "../utils/hashing.js"

class Wallet {
    constructor(){
        [this.pk, this.sk] = genKeyPair(); 
    }
    getAddress(){
    }
    getPublicKeyHash(){
        return ripemd160(sha256(this.pk.value));
    }
}

