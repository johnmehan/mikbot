#include <stdio.h>
#include "ec_elgamal.h"

//#define RAW 1


static void printHex(char *text, unsigned char *bytes, int bytesSize)
{
#ifdef RAW
  printf(">> %s: %s (%d bytes)\n", text, bytes, bytesSize);
#else
  char *hexStr, *sp;
  int i = bytesSize;

  if (! bytes || bytesSize <= 0)
    printf(">> %s: NULL\n", text);

  sp = hexStr = malloc(bytesSize * 2 + 1);

  do
  {
    sprintf(sp, "%02x", *bytes++);
    sp += 2;
  } while (--i > 0);

  printf(">> %s: %s (%d bytes)\n", text, hexStr, bytesSize);
  free(hexStr);
#endif
}

int EC_ElGamal_initialize(EC_Curve_ID id, EC_ElGamal_Options *options)
{
  printf(">> EC_ElGamal_initialize - curve-ID: %d\n", id);
  return EC_ElGamal_OK;
}

int EC_ElGamal_bindPublicKey(unsigned char *pubKey, int pubKeySize, EC_ElGamal_Options *options)
{
  printHex("EC_ElGamal_bindPublicKey - public-key", pubKey, pubKeySize);
  return EC_ElGamal_OK;
}

int EC_ElGamal_bindPrivateKey(unsigned char *priKey, int priKeySize, EC_ElGamal_Options *options)
{
  printHex("EC_ElGamal_bindPrivateKey - private-key", priKey, priKeySize);
  return EC_ElGamal_OK;
}

int EC_ElGamal_encrypt(unsigned char *message, int messageSize, unsigned char *cipher, int *cipherSize, EC_ElGamal_Options *options)
{
  printHex("EC_ElGamal_encrypt - message", message, messageSize);
  printHex("EC_ElGamal_encrypt - cipher", cipher, *cipherSize);
  return EC_ElGamal_OK;
}

int EC_ElGamal_decrypt(unsigned char *cipher, int cipherSize, unsigned char *plain, int *plainSize, EC_ElGamal_Options *options)
{
  printHex("EC_ElGamal_decrypt - cipher", cipher, cipherSize);
  printHex("EC_ElGamal_decrypt - plain", plain, *plainSize);
  return EC_ElGamal_OK;
}

int EC_ElGamal_free(EC_ElGamal_Options *options)
{
  printf(">> EC_ElGamal_free");
  return EC_ElGamal_OK;
}


