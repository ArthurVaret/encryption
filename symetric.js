const crypto = require('crypto');

//Create a function taking a string and a key as input and returning a cypher of the input string.
function encryptString(inputString, key) {
    const iv = crypto.randomBytes(16); // Generate a random IV
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

    let encrypted = cipher.update(inputString, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted
    };
}
const key = crypto.randomBytes(32); // 256-bit key for AES-256-CBC
console.log(key.toString('hex'))
console.log(key.length)
console.log(Buffer.from("6cdf14589d9ed36e05c2e9f6f409a50a7a59d3438899a58527cb384ab4d01b1c",'hex').length)
const encrypted = encryptString("toto",key)
console.log(encrypted)

//Create a function taking a cypher and a key as input, and returning a plain-text deciphered text from the input cypher
function decryptString(encryptedData, key, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}
console.log(decryptString(encrypted.encryptedData, key, Buffer.from(encrypted.iv, 'hex')))

//Bonus: CLI tool (Symmetric)
const readline = require('readline');

// Create a readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function cliTool(){
    // Ask the user whether they want to encrypt or decrypt
    rl.question('Do you want to encrypt or decrypt? (e/d) ', (answer) => {
        if (answer.toLowerCase() === 'e') {
            // Ask the user for the input string to encrypt
            rl.question('Enter the string to encrypt: ', (inputString) => {
                // Ask the user for the encryption key
                rl.question('Enter the encryption key: ', (key) => {
                    // Generate a random initialization vector
                    const iv = crypto.randomBytes(16);

                    // Encrypt the input string using AES-256-CBC
                    const encrypted = encryptString(inputString, Buffer.from(key, 'hex'), iv);

                    console.log('Encryption successful!');
                    console.log('Encrypted string: ', encrypted);
                    console.log('Initialization Vector: ', iv.toString('hex'));

                    rl.close();
                });
            });
        } else if (answer.toLowerCase() === 'd') {
            // Ask the user for the input cipher to decrypt
            rl.question('Enter the cipher to decrypt: ', (encryptedData) => {
                // Ask the user for the decryption key
                rl.question('Enter the decryption key: ', (key) => {
                    // Ask the user for the initialization vector
                    rl.question('Enter the Initialization Vector: ', (ivHex) => {
                        // Convert the IV hex string to a buffer
                        const iv = Buffer.from(ivHex, 'hex');

                        // Decrypt the input cipher using AES-256-CBC
                        const decrypted = decryptString(encryptedData, Buffer.from(key,'hex'), iv);
                        console.log('Decryption successful!');
                        console.log('Decrypted string: ', decrypted);

                        rl.close();
                    });
                });
            });
        } else {
            console.log('Invalid input. Please enter either "e" or "d".');
            rl.close();
        }
    });
}
cliTool()