# Crypto example using RSA public/private key crypto

Generate a private key with `openssl genrsa > private.pem`

Generate a public key with `openssl pkey -in private.pem -out public.pem -pubout`

Encrypt a value using the public key `openssl rsautl -encrypt -inkey public.pem -pubin -in value.txt -out value.txt.enc`

Decrypt the value using our private key: `openssl rsautl -decrypt -inkey private.pem -in value.txt.enc -out value.txt.decoded`