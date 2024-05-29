import bs58 from 'bs58';

export function base58encode(msg) {
    let buf = Buffer.from(msg);
    return bs58.encode(buf);
}

export function base58decode(encoded) {
    return String.fromCharCode.apply(null, bs58.decode(encoded));
}
