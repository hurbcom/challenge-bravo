package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"io"
)

func Encrypt(plaintext, secret string) (string, error) {
	// Hash the API token to create a 32-byte key
	hash := sha256.Sum256([]byte(secret))
	key := hash[:]

	// Create a new AES cipher with the key
	block, err := aes.NewCipher(key)
	if err != nil {
		return "", nil
	}

	// Create a byte slice to hold the IV + ciphertext
	ciphertext := make([]byte, aes.BlockSize+len(plaintext))

	// Generate a random IV and store it at the beginning of the ciphertext slice
	iv := ciphertext[:aes.BlockSize]
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", err
	}

	// Create the CFB encrypter and XOR the plaintext with it to create the ciphertext
	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(ciphertext[aes.BlockSize:], []byte(plaintext))

	// Encode the ciphertext to base64 to make it easily transferable
	return base64.StdEncoding.EncodeToString(ciphertext), nil
}
