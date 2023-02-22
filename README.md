# TD - Encryption
## Encrypt data at rest
Skills you’ll learn:
- Symmetric encryption
- Asymmetric encryption
- Secure data storage 

### what is an Initialization Vector ?
An Initialization Vector (IV) is a random sequence of bytes that is used as the initial input (or starting point) for the encryption algorithm in symmetric key cryptography, such as AES 256.

The IV serves as a random "seed" for the encryption process, helping to ensure that the same plaintext message encrypted multiple times with the same key will produce different ciphertexts.

Additionally, the use of a unique IV for each encryption session helps to prevent certain types of attacks against the encrypted data.

The IV is typically included in the ciphertext output so that it can be used during decryption to recreate the same initial state of the encryption algorithm.

### Encrypt and decrypt data (Symmetric)
The encryptString function takes two parameters:
- 'inputString': the string to be encrypted
- 'key': the secret key used to encrypt the string

The function returns an object with two properties:

- 'iv': the Initialization Vector used during encryption, encoded as a hexadecimal string
- 'encryptedData': the encrypted string, encoded as a hexadecimal string

The function works by first generating a random IV using crypto.randomBytes().

The IV is then used along with the secret key to create a Cipher object using crypto.createCipheriv().

The Cipher object is used to encrypt the input string in chunks using cipher.update() and cipher.final(). The resulting encrypted string is then returned along with the IV.

### Encrypt and decrypt using asymmetric encryption
It generates a public/private RSA key pair with a modulus length of 4096 bits, using the `generateKeyPairSync` method of the `crypto` module.

It also specifies that the private key should be passphrase-protected with the cipher `aes-256-cbc` and the passphrase.