#ifndef _EC_ELGAMAL_H
#define _EC_ELGAMAL_H

#include <openssl/ec.h>
#ifndef OPENSSL_NO_ENGINE
#include <openssl/engine.h>
#endif
#include <openssl/err.h>
#include <openssl/obj_mac.h>
#include <openssl/objects.h>
#include <openssl/rand.h>
#include <openssl/bn.h>

#ifdef __cplusplus
extern "C" {
#endif

#define EC_ElGamal_OK                       0
#define EC_ElGamal_PARAM_NULL               1
#define EC_ElGamal_BN_NEW_FAIL              2
#define EC_ElGamal_POINT_NEW_FAIL           3
#define EC_ElGamal_GROUP_NEW_FAIL           4
#define EC_ElGamal_CURVE_NOT_SUPPORT        5
#define EC_ElGamal_HEX2BN_FAIL              6
#define EC_ElGamal_NEW_GROUP_FAIL           7
#define EC_ElGamal_GET_ORDER_FAIL           8
#define EC_ElGamal_WRONG_PUBKEY_SIZE        9
#define EC_ElGamal_WRONG_PRIKEY_SIZE        10
#define EC_ElGamal_WRONG_MESSAGE_SIZE       11
#define EC_ElGamal_WRONG_CIPHER_SIZE        12

#define EC_ElGamal_MALLOC_FAIL              13
#define EC_ElGamal_POINT_IS_NOT_ONCURVE     14
#define EC_ElGamal_BN_COMPUTE_FAIL          15
#define EC_ElGamal_MESSAGE_IS_NOT_ON_CURVE  16
#define EC_ElGamal_GEN_RAND_FAIL            17
#define EC_ElGamal_CIPHER_IS_NOT_ON_CURVE   18
#define EC_ElGamal_BIN2BIGNUM_FAIL          19
#define EC_ElGamal_SET_XY_FROM_POINT_FAIL   20

typedef enum _EC_Curve_ID {
    secp160r1 = 1,
    DTCP160   = 2,
    NIST_P192 = 3,
    NIST_P224 = 4,
    NIST_P256 = 5,
    NIST_P384 = 6,
    NIST_P521 = 7,
} EC_Curve_ID;

typedef struct _EC_ElGamal_Options {
    EC_Curve_ID  id;
    BN_CTX      *ctx;
    BIGNUM      *p;
    BIGNUM      *a;
    BIGNUM      *b;
    int          numBits;
    int          modOcts;
    int          keySize;
    EC_GROUP    *group;
    EC_POINT    *Q;
    BIGNUM      *d;
} EC_ElGamal_Options;


/*
 * Initialization.
 *
 * Input:
 *   - curve id
 *
 * Return:
 *   - EC_ElGamal_OK if success
 */
int EC_ElGamal_initialize(EC_Curve_ID id, EC_ElGamal_Options *options);

/*
 * Bind public key.
 *
 * Input:
 *   - public key  --raw format (Pub.x||Pub.y)
 *
 * Return:
 *   - EC_ElGamal_OK if success
 */
int EC_ElGamal_bindPublicKey(unsigned char *pubKey, int pubKeySize, EC_ElGamal_Options *options);

/*
 * Bind private key.
 *
 * Input:
 *   - private key  --raw format (d)
 *
 * Return:
 *   - EC_ElGamal_OK if success
 */
int EC_ElGamal_bindPrivateKey(unsigned char *priKey, int priKeySize, EC_ElGamal_Options *options);

/*
 * Encryption.
 *
 * Input:
 *   - public key    --raw format (Pub.x||Pub.y)
 *   - message
 *   - message size  --in bytes
 *
 * Return:
 *   - EC_ElGamal_OK if success
 *   - cipher       --raw format (C1.x||C1.y||C2.x||C2.y)
 *   - cipher size  --in bytes
 */
int EC_ElGamal_encrypt(unsigned char *message, int messageSize, unsigned char *cipher, int *cipherSize, EC_ElGamal_Options *options);

/*
 * Decryption.
 *
 * Input:
 *   - private key  --raw format (d)
 *   - cipher       --raw format (C1.x||C1.y||C2.x||C2.y)
 *   - cipher size  --in bytes
 *
 * Return:
 *   - EC_ElGamal_OK if success
 *   - plain       --raw format (M.x)
 *   - plain size  --in bytes
 */
int EC_ElGamal_decrypt(unsigned char *cipher, int cipherSize, unsigned char *plain, int *plainSize, EC_ElGamal_Options *options);

/*
 * Free options.
 *
 * Return:
 *   - EC_ElGamal_OK if success
 */
int EC_ElGamal_free(EC_ElGamal_Options *options);

#ifdef __cplusplus
}
#endif
#endif

