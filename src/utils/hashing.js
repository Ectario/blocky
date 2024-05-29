import crypto from 'crypto';
const { createHash } = crypto;

export function ripemd160(msg) {
    return createHash('ripemd160').update(msg).digest('hex');
}

export function sha256(msg) {
    return createHash('sha256').update(msg).digest('hex');
}