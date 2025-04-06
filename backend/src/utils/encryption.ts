import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if(!ENCRYPTION_KEY || ENCRYPTION_KEY === '') {
    throw new Error
}

const secretKey = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default_key_32_chars_long', 'salt', 32);

export const generateApiKey = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

export const encrypt = (text: string): string => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (encryptedText: string): string => {
    const [ivHex, encrypted] = encryptedText.split(':');
    const ivBuffer = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, ivBuffer);
    let decrypted = decipher.update(Buffer.from(encrypted, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
