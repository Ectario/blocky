import { genKeyPair } from "../signatures/keys.js"
import { sha256, ripemd160 } from "../utils/hashing.js"
import { base58encode, base58decode } from "../utils/encoding.js"

const CHECKSUM_LENGTH = 4;
const VERSION = 0;

export class Wallet {
    constructor() {
        [this.pk, this.sk] = genKeyPair();
        this.address = this.#genAddress();
        this.pubKeyHash = Wallet.getPublicKeyHash(this.pk);
    }

    #genAddress() {
        let pubKH = Wallet.getPublicKeyHash(this.pk);
        let versionnedHash = VERSION.toString() + pubKH;
        let checksum = Wallet.checksum(versionnedHash);
        let alltogether = versionnedHash + checksum;
        return base58encode(alltogether);
    }

    static getPublicKeyHash(pubKey) {
        return ripemd160(sha256(pubKey.value));
    }

    static addressToPublicKeyHash(address) {
        let alltogether = base58decode(address);
        let pubKH = alltogether.slice(1, alltogether.length - CHECKSUM_LENGTH);
        return pubKH;
    }

    static checksum(payload) {
        return sha256(sha256(payload)).slice(0, CHECKSUM_LENGTH);
    }

    static isValidAddress(address) {
        let alltogether = base58decode(address);
        let pubKH = Wallet.addressToPublicKeyHash(address);
        let version = alltogether[0];
        let checksum = alltogether.slice(alltogether.length - CHECKSUM_LENGTH, alltogether.length);
        let computedChecksum = Wallet.checksum(version + pubKH);
        return computedChecksum == checksum;
    }
}