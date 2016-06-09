/**
 * Dafu Lou, 17 May 2013.
 *
 * Test driver for EC ElGamal functions developed using OpenSSL library.
 */

#include <stdio.h>
#include <stdlib.h>

#include "ec_elgamal.h"
#include <openssl/ec.h>
#ifndef OPENSSL_NO_ENGINE
#include <openssl/engine.h>
#endif
#include <openssl/err.h>
#include <openssl/obj_mac.h>
#include <openssl/objects.h>
#include <openssl/rand.h>
#include <openssl/bn.h>
#include <string.h>

static const char randSeed[] = "string to make the random number generator think it has entropy";


int main(int argc, char *argv[])
{
    EC_ElGamal_Options options;
    unsigned char pubKey[400];
    unsigned char priKey[200];
    unsigned char cipher[800];
    unsigned char plain[200];
    unsigned char plainOut[200];
    unsigned char tmp[200];
    int plainSize;
    int cipherSize;

    int i;
    int ret;
    EC_KEY *key = NULL;
    EC_KEY *msg = NULL;
    BIGNUM *x = NULL, *y = NULL;
    int curveId;

    if (argc < 2) {
        printf("Usage:\n\t%s <curve_ID>\n", argv[0]);
        printf("Where curve_ID is:\n  1) secp160r1\n  2) DTCP160\n  3) P192\n  4) P224\n  5) P256\n  6) P384\n  7) P521\n");
        return 1;
    }

    printf("\n");
    switch (curveId = atoi(argv[1])) {
        case 1:
            printf(">> Curve: secp160r1\n");
            break;
        case 2:
            printf(">> Curve: DTCP160\n");
            break;
        case 3:
            printf(">> Curve: NIST P192\n");
            break;
        case 4:
            printf(">> Curve: NIST P224\n");
            break;
        case 5:
            printf(">> Curve: NIST P256\n");
            break;
        case 6:
            printf(">> Curve: NIST P384\n");
            break;
        case 7:
            printf(">> Curve: NIST P521\n");
            break;
        default:
            printf("ERROR - Invalid curve-ID\n");
            return 1;
    }

    RAND_seed(randSeed, sizeof randSeed);  /* or BN_generate_prime may fail */

    key = EC_KEY_new();
    msg = EC_KEY_new();

    /* Initialization */
    ret = EC_ElGamal_initialize(curveId, &options);
    if (ret != EC_ElGamal_OK) {
        printf("ERROR - EC_ElGamal_initialize: %d\n", ret);
        return 1;
    }

    /* Prepare key and message for test input */
    EC_KEY_set_group(key, options.group);
    EC_KEY_generate_key(key);
    EC_KEY_set_group(msg, options.group);
    EC_KEY_generate_key(msg);

    printf(">> Public key (%d bits, key-size: %d, mod-size: %d):\n", options.numBits, options.keySize, options.modOcts);

    x = BN_new();
    y = BN_new();
    EC_POINT_get_affine_coordinates_GFp(options.group, EC_KEY_get0_public_key(key), x, y, options.ctx);

    printf(">>>> Key Q (%d bits):\n ", BN_num_bits(x));
    BN_print_fp(stdout, x);

    printf("\n>>>> y (%d bits):\n ", BN_num_bits(y));
    BN_print_fp(stdout, y);
    printf("\n");

    /*
     * Public key raw format, if length of Qx or Qy is less than modular length,
     * append zero at the leading of Qx (low index of key buffer).
     */
    memset(pubKey, 0, 200);
    ret = BN_bn2bin(x, tmp);
    memcpy(pubKey + (options.modOcts - ret), tmp, ret);

    ret = BN_bn2bin(y, tmp);
    memcpy(pubKey + options.modOcts + (options.modOcts - ret), tmp, ret);

    for (i = 0; i < 2 * options.modOcts; i++) {
        printf(" %02X", pubKey[i]);
    }
    printf("\n");

    ret = BN_bn2bin(EC_KEY_get0_private_key(key), priKey);

    printf(">> Private key (%d bits, return-code: %d, key-size: %d):\n ", BN_num_bits(EC_KEY_get0_private_key(key)), ret, options.keySize);
    BN_print_fp(stdout, EC_KEY_get0_private_key(key));
    printf("\n");

    if (ret < options.keySize) {
        for (i = options.keySize - 1; i >= options.keySize-ret; i--) {
            priKey[i] = priKey[i - 1];
        }
        priKey[0] = 0;
    }

    for (i = 0; i< options.keySize; i++) {
        printf(" %02X", priKey[i]);
    }
    printf("\n");

    BN_zero(x);
    BN_zero(y);
    EC_POINT_get_affine_coordinates_GFp(options.group, EC_KEY_get0_public_key(msg), x, y, options.ctx);
    ret = BN_bn2bin(x, tmp);
    memset(plain, 0, options.modOcts);
    memcpy(plain + options.modOcts - ret, tmp, ret);

    BN_free(x);
    BN_free(y);
    EC_KEY_free(key);
    EC_KEY_free(msg);

    printf(">> Message:\n");
    for (i = 0; i < options.modOcts; i++) {
        printf(" %02x", plain[i]);
    }
    printf("\n");

    /* Begin test */
    ret = EC_ElGamal_bindPublicKey(pubKey, 2 * options.modOcts, &options);
    if (ret != EC_ElGamal_OK) {
        printf("ERROR - EC_ElGamal_bindPublicKey: %d\n", ret);
        return 1;
    }

    ret = EC_ElGamal_encrypt(plain, options.modOcts, cipher, &cipherSize, &options);
    if (ret != EC_ElGamal_OK) {
        printf("ERROR - EC_ElGamal_encrypt: %d\n", ret);
        return 1;
    }

    ret = EC_ElGamal_bindPrivateKey(priKey, options.keySize, &options);
    if (ret != EC_ElGamal_OK) {
        printf("ERROR - EC_ElGamal_bindPrivateKey: %d\n", ret);
        return 1;
    }

    ret = EC_ElGamal_decrypt(cipher, cipherSize, plainOut, &plainSize, &options);
    if (ret != EC_ElGamal_OK) {
        printf("ERROR - EC_ElGamal_decrypt: %d\n", ret);
        return 1;
    }

    ret = EC_ElGamal_free(&options);
    if (ret != EC_ElGamal_OK) {
        printf("ERROR - EC_ElGamal_free: %d\n", ret);
        return 1;
    }

    for (i = 0; i < plainSize; i++) {
        if (plain[i] != plainOut[i]) {
            printf("ERROR - plain[%d] != plainOut[%d], expected: %02x, out: %02x\n", i, i, plain[i], plainOut[i]);
            printf(">> Test FAIL\n");
            return 1;
        }
    }

    printf(">> Test PASS\n");
    return 0;
}


