package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/sha256"
	"encoding/base64"
)

func Decrypt(ciphertextBase64, secret string) (string, error) {
	// Decode the base64-encoded ciphertext
	ciphertext, err := base64.StdEncoding.DecodeString(ciphertextBase64)
	if err != nil {
		return "", err
	}

	// Hash the API token to create a 32-byte key
	hash := sha256.Sum256([]byte(secret))
	key := hash[:]

	// Create a new AES cipher with the key
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	// Ensure the ciphertext is long enough to contain the IV
	if len(ciphertext) < aes.BlockSize {
		return "", err
	}

	// Extract the IV from the beginning of the ciphertext
	iv := ciphertext[:aes.BlockSize]
	ciphertext = ciphertext[aes.BlockSize:]

	// Create the CFB decrypter and XOR the ciphertext with it to recover the plaintext
	stream := cipher.NewCFBDecrypter(block, iv)
	stream.XORKeyStream(ciphertext, ciphertext)

	// Return the decrypted plaintext as a string
	return string(ciphertext), nil
}
