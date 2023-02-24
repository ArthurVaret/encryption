import crypto from 'crypto'
import inquirer from 'inquirer'
import editor from '@inquirer/editor';
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

// 1. Generate a public/private RSA key pair
async function generateKeyPair(){
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        }});
    fs.writeFile('public.pem', publicKey, 'utf8', function (err) {
        if (err) return console.log(err);
    });
    fs.writeFile('private.pem', privateKey, 'utf8', function (err) {
        if (err) return console.log(err);
    });
    console.log('key generated successfully');
}
function getPublicKey(){
    return fs.readFileSync('public.pem', 'utf8')
}
function getPrivateKey(){
    return fs.readFileSync('private.pem', 'utf8')
}
// 2. Write a function that encrypts a message using the public key
async function encrypt() {
    const {message} = await inquirer.prompt({
        type: 'input',
        name: 'message',
        message: 'Enter the message to encrypt:',
    });
    const buffer = Buffer.from(message, 'utf-8');
    const encrypted = crypto.publicEncrypt(getPublicKey(), buffer);
    console.log(encrypted.toString('base64'));
}

// 3. Write a function that decrypts a message using the private key
async function decrypt(){
    const message = await editor({
        message: 'Enter the message to decrypt:',
    });
    const buffer = Buffer.from(message, 'base64');
    const decrypted = crypto.privateDecrypt(getPrivateKey(), buffer);
    console.log(decrypted.toString('utf-8'));
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
//console.log(fs.readFileSync('public.pem', 'utf8'))