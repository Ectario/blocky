import elliptic from 'elliptic';
import crypto from 'crypto';

const { ec } = elliptic

const curve = new ec('secp256k1');

class PublicKey {
    constructor(publicKey) {
        this.value = publicKey;
    }
    verify(msg, signature) {
        let messageBuffer = Buffer.from(msg);
        let hash = crypto.createHash('sha256').update(messageBuffer).digest('hex');
        return curve.keyFromPublic(this.value, 'hex').verify(hash, signature);
    }
}

class PrivateKey {
    constructor(privateKey, keyPair) {
        this.value = privateKey;
        this.keyPair = keyPair;
    }
    sign(msg) {
        let messageBuffer = Buffer.from(msg);
        let hash = crypto.createHash('sha256').update(messageBuffer).digest('hex');
        return this.keyPair.sign(hash);
    }
}

export function genKeyPair() {
    let keyPair = curve.genKeyPair();
    let privateKey = keyPair.getPrivate('hex');
    let publicKey = keyPair.getPublic('hex');
    return [new PublicKey(publicKey), new PrivateKey(privateKey, keyPair)];
}

