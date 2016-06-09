#ifdef _MSC_VER
#include <openssl/applink.c>
#endif
#include <string.h>
#include "ec_elgamal.h"

#if defined(_MSC_VER) && defined(_MIPS_) && (_MSC_VER/100==12)
/* Suppress "too big too optimize" warning */
#pragma warning(disable:4959)
#endif

//#define DEBUG  1
#define CEILING(X, Y)  ((X) > 0 ? ((unsigned int)(X) - 1)/(unsigned int)(Y) + 1 : 0)


int EC_ElGamal_initialize(EC_Curve_ID id, EC_ElGamal_Options *options)
{
    EC_POINT *G = NULL;
    BIGNUM *Gx = NULL, *Gy = NULL, *n = NULL;

    BN_CTX *ctx = NULL;
    BIGNUM *p = NULL, *a = NULL, *b = NULL;
    EC_GROUP *group = NULL;
    int numBits = 0;
    int keySize = 0;
    int modOcts = 0;

    if (options == NULL)  return EC_ElGamal_PARAM_NULL;

    options->id = id;

    ctx = BN_CTX_new();
    if (! ctx)  return EC_ElGamal_BN_NEW_FAIL;

    EC_GROUP_free(group);

    switch (id) {
        case secp160r1:  /* Not a NIST curve, but commonly used */
            if (! BN_hex2bn(&p, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFF"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! BN_hex2bn(&a, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF7FFFFFFC"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! BN_hex2bn(&b, "1C97BEFC54BD7A8B65ACF89F81D4D4ADC565FA45"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! (group = EC_GROUP_new_curve_GFp(p, a, b, ctx)))  return EC_ElGamal_NEW_GROUP_FAIL;

            G = EC_POINT_new(group);
            if (! G)  return EC_ElGamal_POINT_NEW_FAIL;

            if (! BN_hex2bn(&Gx, "4A96B5688EF573284664698968C38BB913CBFC82"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! BN_hex2bn(&Gy, "23a628553168947d59dcc912042351377ac5fb32"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! EC_POINT_set_affine_coordinates_GFp(group, G, Gx, Gy, ctx))  return EC_ElGamal_NEW_GROUP_FAIL;
            if (! BN_hex2bn(&n, "0100000000000000000001F4C8F927AED3CA752257"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! EC_GROUP_set_generator(group, G, n, BN_value_one()))  return EC_ElGamal_NEW_GROUP_FAIL;

            BN_zero(n);
            if (! EC_GROUP_get_order(group, n, ctx))  return EC_ElGamal_GET_ORDER_FAIL;
            numBits = BN_num_bits(n);
            break;

        case DTCP160:
            if (! BN_hex2bn(&p, "94a8e16aad4f50efe29b9d5c0c0b6d481b27de53"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! BN_hex2bn(&a, "94a8e16aad4f50efe29b9d5c0c0b6d481b27de50"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! BN_hex2bn(&b, "4fd918e5b0c4513fa3ef3033fe08f07c3b08c76d"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! (group = EC_GROUP_new_curve_GFp(p, a, b, ctx)))  return EC_ElGamal_NEW_GROUP_FAIL;

            G = EC_POINT_new(group);
            if (! G)  return EC_ElGamal_POINT_NEW_FAIL;

            if (! BN_hex2bn(&Gx, "78668913deab22759e587eb393d7da46ce24b196"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! BN_hex2bn(&Gy, "4d2ba996a7e3d9af4d266afe00443b95d6870606"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! EC_POINT_set_affine_coordinates_GFp(group, G, Gx, Gy, ctx))  return EC_ElGamal_NEW_GROUP_FAIL;
            if (! BN_hex2bn(&n, "02278c8ad247a46b5c53de4cc9a0072488f028a3"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! EC_GROUP_set_generator(group, G, n, BN_value_one()))  return EC_ElGamal_NEW_GROUP_FAIL;

            BN_zero(n);
            if (! EC_GROUP_get_order(group, n, ctx))  return EC_ElGamal_GET_ORDER_FAIL;
            numBits = BN_num_bits(n);
            break;

        case NIST_P192:
            if (! BN_hex2bn(&p, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFF"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! BN_hex2bn(&a, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFC"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! BN_hex2bn(&b, "64210519E59C80E70FA7E9AB72243049FEB8DEECC146B9B1"))  return EC_ElGamal_HEX2BN_FAIL;

            if (! (group = EC_GROUP_new_curve_GFp(p, a, b, ctx)))  return EC_ElGamal_NEW_GROUP_FAIL;

            G = EC_POINT_new(group);
            if (! G)  return EC_ElGamal_POINT_NEW_FAIL;

            if (! BN_hex2bn(&Gx, "188DA80EB03090F67CBF20EB43A18800F4FF0AFD82FF1012"))  return EC_ElGamal_HEX2BN_FAIL;

            if (! EC_POINT_set_compressed_coordinates_GFp(group, G, Gx, 1, ctx))  return EC_ElGamal_NEW_GROUP_FAIL;
            if (! BN_hex2bn(&n, "FFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22831"))  return EC_ElGamal_HEX2BN_FAIL;

            if (! EC_GROUP_set_generator(group, G, n, BN_value_one()))  return EC_ElGamal_NEW_GROUP_FAIL;

            BN_zero(n);
            if (! EC_GROUP_get_order(group, n, ctx))  return EC_ElGamal_GET_ORDER_FAIL;
            numBits = BN_num_bits(n);
            break;

        case NIST_P224:
            if (! BN_hex2bn(&p, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF000000000000000000000001"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! BN_hex2bn(&a, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFFFFFFFFFE"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! BN_hex2bn(&b, "B4050A850C04B3ABF54132565044B0B7D7BFD8BA270B39432355FFB4"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! (group = EC_GROUP_new_curve_GFp(p, a, b, ctx)))  return EC_ElGamal_NEW_GROUP_FAIL;

            G = EC_POINT_new(group);
            if (! G)  return EC_ElGamal_POINT_NEW_FAIL;

            if (! BN_hex2bn(&Gx, "B70E0CBD6BB4BF7F321390B94A03C1D356C21122343280D6115C1D21"))  return EC_ElGamal_HEX2BN_FAIL;

            if (! EC_POINT_set_compressed_coordinates_GFp(group, G, Gx, 0, ctx))  return EC_ElGamal_NEW_GROUP_FAIL;
            if (! BN_hex2bn(&n, "FFFFFFFFFFFFFFFFFFFFFFFFFFFF16A2E0B8F03E13DD29455C5C2A3D"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! EC_GROUP_set_generator(group, G, n, BN_value_one()))  return EC_ElGamal_NEW_GROUP_FAIL;

            BN_zero(n);
            if (! EC_GROUP_get_order(group, n, ctx))  return EC_ElGamal_GET_ORDER_FAIL;
            numBits = BN_num_bits(n);
            break;

        case NIST_P256:
            if (! BN_hex2bn(&p, "FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! BN_hex2bn(&a, "FFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! BN_hex2bn(&b, "5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! (group = EC_GROUP_new_curve_GFp(p, a, b, ctx)))   return EC_ElGamal_NEW_GROUP_FAIL;

            G = EC_POINT_new(group);
            if (! G)  return EC_ElGamal_POINT_NEW_FAIL;

            if (! BN_hex2bn(&Gx, "6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296"))  return EC_ElGamal_HEX2BN_FAIL;

            if (! EC_POINT_set_compressed_coordinates_GFp(group, G, Gx, 1, ctx))  return EC_ElGamal_NEW_GROUP_FAIL;
            if (! BN_hex2bn(&n, "FFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551"))  return EC_ElGamal_HEX2BN_FAIL;
            if (! EC_GROUP_set_generator(group, G, n, BN_value_one()))  return EC_ElGamal_NEW_GROUP_FAIL;

            BN_zero(n);
            if (! EC_GROUP_get_order(group, n, ctx))  return EC_ElGamal_GET_ORDER_FAIL;
            numBits = BN_num_bits(n);
            break;

        case NIST_P384:
            if (! BN_hex2bn(&p, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFF0000000000000000FFFFFFFF"))
                return EC_ElGamal_HEX2BN_FAIL;
            if (! BN_hex2bn(&a, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFF0000000000000000FFFFFFFC"))
                return EC_ElGamal_HEX2BN_FAIL;
            if (! BN_hex2bn(&b, "B3312FA7E23EE7E4988E056BE3F82D19181D9C6EFE8141120314088F5013875AC656398D8A2ED19D2A85C8EDD3EC2AEF"))
                return EC_ElGamal_HEX2BN_FAIL;
            if (! (group = EC_GROUP_new_curve_GFp(p, a, b, ctx)))  return EC_ElGamal_NEW_GROUP_FAIL;

            G = EC_POINT_new(group);
            if (! G)  return EC_ElGamal_POINT_NEW_FAIL;

            if (! BN_hex2bn(&Gx, "AA87CA22BE8B05378EB1C71EF320AD746E1D3B628BA79B9859F741E082542A385502F25DBF55296C3A545E3872760AB7"))
                return EC_ElGamal_HEX2BN_FAIL;

            if (! EC_POINT_set_compressed_coordinates_GFp(group, G, Gx, 1, ctx))  return EC_ElGamal_NEW_GROUP_FAIL;
            if (! BN_hex2bn(&n, "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC7634D81F4372DDF581A0DB248B0A77AECEC196ACCC52973"))
                return EC_ElGamal_HEX2BN_FAIL;
            if (! EC_GROUP_set_generator(group, G, n, BN_value_one()))  return EC_ElGamal_NEW_GROUP_FAIL;

            BN_zero(n);
            if (! EC_GROUP_get_order(group, n, ctx))  return EC_ElGamal_GET_ORDER_FAIL;
            numBits = BN_num_bits(n);
            break;

        case NIST_P521:
            if (! BN_hex2bn(&p, "1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"))
                return EC_ElGamal_HEX2BN_FAIL;
            if (! BN_hex2bn(&a, "1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC"))
                return EC_ElGamal_HEX2BN_FAIL;
            if (! BN_hex2bn(&b, "051953EB9618E1C9A1F929A21A0B68540EEA2DA725B99B315F3B8B489918EF109E156193951EC7E937B1652C0BD3BB1BF073573DF883D2C34F1EF451FD46B503F00"))
                return EC_ElGamal_HEX2BN_FAIL;
            if (! (group = EC_GROUP_new_curve_GFp(p, a, b, ctx)))  return EC_ElGamal_NEW_GROUP_FAIL;

            G = EC_POINT_new(group);
            if (! G)  return EC_ElGamal_POINT_NEW_FAIL;

            if (! BN_hex2bn(&Gx, "C6858E06B70404E9CD9E3ECB662395B4429C648139053FB521F828AF606B4D3DBAA14B5E77EFE75928FE1DC127A2FFA8DE3348B3C1856A429BF97E7E31C2E5BD66"))
                return EC_ElGamal_HEX2BN_FAIL;

            if (! EC_POINT_set_compressed_coordinates_GFp(group, G, Gx, 0, ctx))  return EC_ElGamal_NEW_GROUP_FAIL;
            if (! BN_hex2bn(&n, "1FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFA51868783BF2F966B7FCC0148F709A5D03BB5C9B8899C47AEBB6FB71E91386409"))
                return EC_ElGamal_HEX2BN_FAIL;
            if (! EC_GROUP_set_generator(group, G, n, BN_value_one()))  return EC_ElGamal_NEW_GROUP_FAIL;

            BN_zero(n);
            if (! EC_GROUP_get_order(group, n, ctx))  return EC_ElGamal_GET_ORDER_FAIL;
            numBits = BN_num_bits(n);
            break;

        default:
            return EC_ElGamal_CURVE_NOT_SUPPORT;
    }

#ifdef DEBUG
     fprintf(stdout, " mod bits %d, n bits %d\n", BN_num_bits(p), BN_num_bits(n));
     BN_print_fp(stdout, p);
#endif

     modOcts = BN_num_bits(p);
     modOcts = CEILING((unsigned int)modOcts, 8);
     keySize = CEILING((unsigned int)numBits, 8);

     options->p = p;
     options->a = a;
     options->b = b;
     options->numBits = numBits;
     options->group = group;
     options->ctx = ctx;
     options->modOcts = modOcts;
     options->keySize = keySize;
     options->d = NULL;
     options->Q = NULL;

     if (Gx != NULL)  BN_free(Gx);
     if (Gy != NULL)  BN_free(Gy);
     if (n != NULL)   BN_free(n);
     if (G != NULL)   EC_POINT_free(G);

     return EC_ElGamal_OK;
}

int EC_ElGamal_bindPublicKey(unsigned char *pubKey, int pubKeySize, EC_ElGamal_Options *options)
{
    EC_POINT *Q = NULL;
    BIGNUM *Qx = NULL, *Qy = NULL;
    unsigned int keylen = 0;

    if (options == NULL)  return EC_ElGamal_PARAM_NULL;
    if (pubKey == NULL)  return EC_ElGamal_PARAM_NULL;

    keylen = (unsigned int)pubKeySize / 2;
    if (2 * (options->modOcts) < pubKeySize || ((int)keylen * 2 != pubKeySize))
        return EC_ElGamal_WRONG_PUBKEY_SIZE;

    /* Read public key */
    Qx = BN_bin2bn(pubKey, (int)keylen, NULL);
    if (Qx == NULL)  return EC_ElGamal_BIN2BIGNUM_FAIL;

    Qy = BN_bin2bn(pubKey + (int)keylen, (int)keylen, NULL);
    if (Qy == NULL)  return EC_ElGamal_BIN2BIGNUM_FAIL;

    Q = EC_POINT_new(options->group);
    if (! Q)  return EC_ElGamal_NEW_GROUP_FAIL;

#ifdef DEBUG
    fprintf(stdout, " bind pub Q:\n");
    BN_print_fp(stdout, Qx);
    fprintf(stdout, "\n");
    BN_print_fp(stdout, Qy);
    fprintf(stdout, "\n");
#endif

    if (! EC_POINT_set_affine_coordinates_GFp(options->group, Q, Qx, Qy, options->ctx))
        return EC_ElGamal_NEW_GROUP_FAIL;

    if (! EC_POINT_is_on_curve(options->group, Q, options->ctx))
        return EC_ElGamal_POINT_IS_NOT_ONCURVE;

    options->Q = Q;
    BN_free(Qx);
    BN_free(Qy);

    return EC_ElGamal_OK;
}

int EC_ElGamal_bindPrivateKey(unsigned char *priKey, int priKeySize, EC_ElGamal_Options *options)
{
    BIGNUM *d = NULL;

    if (options == NULL)  return EC_ElGamal_PARAM_NULL;
    if (priKey == NULL)  return EC_ElGamal_PARAM_NULL;

    if (options->keySize < priKeySize)  return EC_ElGamal_WRONG_PRIKEY_SIZE;

    /* Read private key */
    d = BN_bin2bn(priKey, priKeySize, NULL);
    if (d == NULL)  return EC_ElGamal_BIN2BIGNUM_FAIL;

    options->d = d;
    return EC_ElGamal_OK;
}

int EC_ElGamal_encrypt(unsigned char *message, int messageSize, unsigned char *cipher, int *cipherSize, EC_ElGamal_Options *options)
{
    EC_POINT *M = NULL;
    EC_POINT *C1 = NULL;
    EC_POINT *C2 = NULL;
    BIGNUM *k = NULL;
    BIGNUM *x = NULL, *y = NULL;
    unsigned char *tmp = NULL;
    int len;
    int ret = EC_ElGamal_OK;

    if (message == NULL)  return EC_ElGamal_PARAM_NULL;
    if (cipher == NULL)   return EC_ElGamal_PARAM_NULL;
    if (options == NULL)  return EC_ElGamal_PARAM_NULL;

    if (messageSize > options->keySize)  return EC_ElGamal_WRONG_MESSAGE_SIZE;

    x = BN_bin2bn(message, messageSize, NULL);
    if (x == NULL)  return EC_ElGamal_BIN2BIGNUM_FAIL;

    /* Embed m to curve */
    /* Qx is x-coordinate, y-coordinate is computed as sqrt(x^3 + ax + b) */
    y = BN_new();

    if (! BN_mod_sqr(y, x, options->p, options->ctx))
        return EC_ElGamal_BN_COMPUTE_FAIL;  /* x^2 */

    if (! BN_mod_add_quick(y, y, options->a, options->p))
        return EC_ElGamal_BN_COMPUTE_FAIL;  /* x^2 + a */

    if (! BN_mod_mul(y, y, x, options->p, options->ctx))
        return EC_ElGamal_BN_COMPUTE_FAIL;  /* x^3 + ax */

    if (! BN_mod_add_quick(y, y, options->b, options->p))
        return EC_ElGamal_BN_COMPUTE_FAIL;  /* x^3 + ax +b */

    if (BN_mod_sqrt(y, y, options->p, options->ctx) == NULL)
        return EC_ElGamal_BN_COMPUTE_FAIL;  /* y = sqrt(msx_x) */

#ifdef DEBUG
    fprintf(stdout, "\nMx: ");
    BN_print_fp(stdout, x);
    fprintf(stdout, "\nMy: ");
    BN_print_fp(stdout, y);
    fprintf(stdout, "\n");
#endif

    M = EC_POINT_new(options->group);
    if (! M)  return EC_ElGamal_POINT_NEW_FAIL;

    if (! EC_POINT_set_affine_coordinates_GFp(options->group, M, x, y, options->ctx)) {
        ret = EC_ElGamal_SET_XY_FROM_POINT_FAIL;
        goto EC_ElGamal_Enc_Exit;
    }

    BN_free(x);
    BN_free(y);
    if (! EC_POINT_is_on_curve(options->group, M, options->ctx)) {
        ret = EC_ElGamal_MESSAGE_IS_NOT_ON_CURVE;
        goto EC_ElGamal_Enc_Exit;
    }

    /* Generate k */
    k = BN_new();
    if (! BN_pseudo_rand(k, options->numBits, 0, 0)) {
        ret = EC_ElGamal_GEN_RAND_FAIL;
        goto EC_ElGamal_Enc_Exit;
    }

    /* C1 = k * G */
    C1 = EC_POINT_new(options->group);
    C2 = EC_POINT_new(options->group);
    if (! C1 || ! C2) {
        ret = EC_ElGamal_POINT_NEW_FAIL;
        goto EC_ElGamal_Enc_Exit;
    }

    EC_GROUP_precompute_mult(options->group, options->ctx);
    if (! EC_GROUP_have_precompute_mult(options->group)) {
        ret = EC_ElGamal_BN_COMPUTE_FAIL;
        goto EC_ElGamal_Enc_Exit;
    }

    if (! EC_POINT_mul(options->group, C1, k, NULL, NULL, options->ctx)) {
        ret = EC_ElGamal_BN_COMPUTE_FAIL;
        goto EC_ElGamal_Enc_Exit;
    }

    /* C2 = M + k * Q */
    if (! EC_POINT_mul(options->group, C2, NULL, options->Q, k, options->ctx)) {
        ret = EC_ElGamal_BN_COMPUTE_FAIL;
        goto EC_ElGamal_Enc_Exit;
    }

    if (! EC_POINT_add(options->group, C2, C2, M, options->ctx)) {
        ret = EC_ElGamal_BN_COMPUTE_FAIL;
        goto EC_ElGamal_Enc_Exit;
    }

    tmp = (unsigned char*)malloc(options->modOcts);
    if (tmp == NULL) {
        ret = EC_ElGamal_MALLOC_FAIL;
        goto EC_ElGamal_Enc_Exit;
    }
    memset(cipher, '\0', 4 * options->modOcts);

    x = BN_new();
    y = BN_new();
    BN_zero(x);
    BN_zero(y);
    EC_POINT_get_affine_coordinates_GFp(options->group, C1, x, y, options->ctx);

    len = BN_bn2bin(x, tmp);
    memcpy(cipher + options->modOcts - len, tmp, len);

    len = BN_bn2bin(y, tmp);
    memcpy(cipher + 2 * options->modOcts - len, tmp, len);

    BN_zero(x);
    BN_zero(y);
    EC_POINT_get_affine_coordinates_GFp(options->group, C2, x, y, options->ctx);
    len = BN_bn2bin(x, tmp);
    memcpy(cipher + 3 * options->modOcts - len, tmp, len);
    len = BN_bn2bin(y, tmp);
    memcpy(cipher + 4 * options->modOcts - len, tmp, len);

    *cipherSize = 4 * options->modOcts;
    free(tmp);

EC_ElGamal_Enc_Exit:
    BN_free(x);
    BN_free(y);
    BN_free(k);
    EC_POINT_free(C1);
    EC_POINT_free(C2);
    EC_POINT_free(M);

    return (ret);
}

int EC_ElGamal_decrypt(unsigned char *cipher, int cipherSize, unsigned char *plain, int *plainSize, EC_ElGamal_Options *options)
{
    /* Read cipher */
    EC_POINT *M = NULL;
    EC_POINT *C1 = NULL;
    EC_POINT *C2 = NULL;

    BIGNUM *x = NULL, *y = NULL;
    int len = 0;
    unsigned char *tmp;

    if (plain == NULL)  return EC_ElGamal_PARAM_NULL;
    if (cipher == NULL)  return EC_ElGamal_PARAM_NULL;
    if (options == NULL)  return EC_ElGamal_PARAM_NULL;

    if (cipherSize != 4 * (options->modOcts))  return EC_ElGamal_WRONG_CIPHER_SIZE;

    x = BN_bin2bn(cipher, options->modOcts, NULL);
    if (x == NULL)  return EC_ElGamal_BIN2BIGNUM_FAIL;

    y = BN_bin2bn(cipher + options->modOcts, options->modOcts, NULL);
    if (y == NULL)  return EC_ElGamal_BIN2BIGNUM_FAIL;

    C1 = EC_POINT_new(options->group);
    if (! C1)  return EC_ElGamal_POINT_NEW_FAIL;

    if (! EC_POINT_set_affine_coordinates_GFp(options->group, C1, x, y, options->ctx))
        return EC_ElGamal_NEW_GROUP_FAIL;
    if (! EC_POINT_is_on_curve(options->group, C1, options->ctx))
        return EC_ElGamal_CIPHER_IS_NOT_ON_CURVE;

    BN_free(x);
    BN_free(y);
    x = BN_bin2bn(cipher + 2 * options->modOcts, options->modOcts, NULL);
    if (x == NULL)  return EC_ElGamal_BIN2BIGNUM_FAIL;

    y = BN_bin2bn(cipher + 3 * options->modOcts, options->modOcts, NULL);
    if (y == NULL)  return EC_ElGamal_BIN2BIGNUM_FAIL;

    C2 = EC_POINT_new(options->group);
    if (! C2)  return EC_ElGamal_POINT_NEW_FAIL;

    if (! EC_POINT_set_affine_coordinates_GFp(options->group, C2, x, y, options->ctx))
        return EC_ElGamal_NEW_GROUP_FAIL;

    if (! EC_POINT_is_on_curve(options->group, C2, options->ctx))
        return EC_ElGamal_CIPHER_IS_NOT_ON_CURVE;

    M = EC_POINT_new(options->group);
    if (! M)  return EC_ElGamal_POINT_NEW_FAIL;

    /* M <- d * C1 */
    if (! EC_POINT_mul(options->group, M, NULL, C1, options->d, options->ctx))
        return EC_ElGamal_BN_COMPUTE_FAIL;

    /* -M */
    if (! EC_POINT_invert(options->group, M, options->ctx))
        return EC_ElGamal_BN_COMPUTE_FAIL;

    /* M <- C2 - d * C1 */
    if (! EC_POINT_add(options->group, M, C2, M, options->ctx))
        return EC_ElGamal_BN_COMPUTE_FAIL;

    /* Get message <- M.x */
    BN_zero(x);
    BN_zero(y);
    EC_POINT_get_affine_coordinates_GFp(options->group, M, x, y, options->ctx);

#ifdef DEBUG
    fprintf(stdout, "\nDecrypt Mx: ");
    BN_print_fp(stdout, x);
    fprintf(stdout, "\nDecrypt My: ");
    BN_print_fp(stdout, y);
    fprintf(stdout, "\n");
#endif

    *plainSize = options->modOcts;
    tmp = malloc(options->modOcts);
    if (tmp == NULL) {
        BN_free(x);
        BN_free(y);
        EC_POINT_free(M);
        EC_POINT_free(C1);
        EC_POINT_free(C2);
        return EC_ElGamal_MALLOC_FAIL;
    }

    len = BN_bn2bin(x, tmp);
    memset(plain, '\0', options->modOcts);
    memcpy(plain + options->modOcts - len, tmp, len);
    free(tmp);

    BN_free(x);
    BN_free(y);
    EC_POINT_free(M);
    EC_POINT_free(C1);
    EC_POINT_free(C2);

    return EC_ElGamal_OK;
}

int EC_ElGamal_free(EC_ElGamal_Options *options)
{
    if (options->p != NULL)  BN_free(options->p);
    if (options->a != NULL)  BN_free(options->a);
    if (options->b != NULL)  BN_free(options->b);
    if (options->d != NULL)  BN_free(options->d);

    if (options->Q != NULL)  EC_POINT_free(options->Q);
    if (options->group != NULL)  EC_GROUP_free(options->group);
    if (options->ctx != NULL)  BN_CTX_free(options->ctx);

    return EC_ElGamal_OK;
}

