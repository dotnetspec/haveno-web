// encryption.js
const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function getKeyMaterial(password) {
    const encodedPassword = encoder.encode(password);
    return crypto.subtle.importKey(
        "raw",
        encodedPassword,
        "PBKDF2",
        false,
        ["deriveKey"]
    );
}

async function deriveKey(keyMaterial, salt) {
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

export async function encrypt(message, password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await getKeyMaterial(password);
    const key = await deriveKey(keyMaterial, salt);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedMessage = encoder.encode(message);
    const encrypted = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encodedMessage
    );
    const encryptedData = {
        iv: Array.from(iv),
        salt: Array.from(salt),
        data: Array.from(new Uint8Array(encrypted))
    };
    localStorage.setItem(message.type, JSON.stringify(encryptedData));
}

export async function decrypt(message, password) {
    const encryptedData = JSON.parse(localStorage.getItem(message.type));
    if (!encryptedData) return null;
    const salt = new Uint8Array(encryptedData.salt);
    const iv = new Uint8Array(encryptedData.iv);
    const data = new Uint8Array(encryptedData.data);
    const keyMaterial = await getKeyMaterial(password);
    
    const key = await deriveKey(keyMaterial, salt);
    try {
        const decrypted = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            data
        );
        
        return decoder.decode(decrypted);
    } catch (e) {
        
        console.error("Decryption failed (not an error if testing for fail):", e);
        return null;
    }
}