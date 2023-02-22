import crypto from 'crypto'
import inquirer from 'inquirer'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

// 1. Generate a public/private RSA key pair
async function generateKeyPair(){
    const {passphrase} = await inquirer.prompt({
        type: 'input',
        name: 'passphrase',
        message: 'Enter the passphrase:',
    });
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: passphrase,
        }});
    fs.writeFile('public.pem', publicKey, 'utf8', function (err) {
        if (err) return console.log(err);
    });
    fs.writeFile('private.pem', privateKey, 'utf8', function (err) {
        if (err) return console.log(err);
    });
    console.log('key generated successfully');
}
function getPublicKey(callback){
    fs.readFile('public.pem', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            callback(data)
        }
    );
}
function getPrivateKey(callback){
    fs.readFile('private.pem', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            callback(data)
        }
    );
}
// 2. Write a function that encrypts a message using the public key
async function encrypt() {
    const {message} = await inquirer.prompt({
        type: 'input',
        name: 'message',
        message: 'Enter the message to encrypt:',
    });
    const buffer = Buffer.from(message, 'utf-8');
    return getPublicKey(function(publicKey) {
        const encrypted = crypto.publicEncrypt(publicKey, buffer);
        console.log(encrypted.toString('base64'));
        return encrypted.toString('base64');
    });
}

// 3. Write a function that decrypts a message using the private key
async function decrypt(){
    const {message} = await inquirer.prompt({
        type: 'input',
        name: 'message',
        message: 'Enter the message to decrypt:',
    });
    const {passphrase} = await inquirer.prompt({
        type: 'input',
        name: 'passphrase',
        message: 'Enter the passphrase:',
    });
    const buffer = Buffer.from(message, 'utf-8');
    return getPrivateKey(function(privateKey) {
        try{
            const decrypted = crypto.privateDecrypt(
                {
                    key: privateKey,
                    passphrase: passphrase,
                },
                buffer
            );
            console.log(decrypted.toString('base64'));
            return decrypted.toString('base64');
        }
        catch(error){
            console.log(error)
            return error
        }
    });
}

async function run() {
    while(true){
        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'What do you want to do?',
            choices: [
                { name: 'Generate new key pair', value: 'generate' },
                { name: 'Encrypt a message', value: 'encrypt' },
                { name: 'Decrypt a message', value: 'decrypt' },
            ],
        });

        switch (action) {
            case 'generate':
                await generateKeyPair();
                break;
            case 'encrypt':
                await encrypt();
                break;
            case 'decrypt':
                await decrypt();
                break;
        }
    }
    }
run();