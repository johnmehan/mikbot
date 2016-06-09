#include <string.h>
#include <stdio.h>
#include <node.h>
#include <node_buffer.h>
#include "ec_elgamal.h"

using namespace v8;
using namespace node;

#define EC_CURVE_ID_DEF  NIST_P256

static EC_ElGamal_Options options;


static Handle<Value> bindPrivateKey(const Arguments& args) {
  HandleScope scope;

  if (args.Length() != 1) {
    ThrowException(Exception::TypeError(String::New("Invalid arguments")));
    return scope.Close(Undefined());
  }

  Local<Object> bufferObj = args[0]->ToObject();
  unsigned char* privKey = (unsigned char*)Buffer::Data(bufferObj);
  int privKeyLen = (int)Buffer::Length(bufferObj);

  if (! (privKey && privKeyLen)) {
    ThrowException(Exception::TypeError(String::New("Empty private key")));
    return scope.Close(Undefined());
  }

  int rc;

  if ((rc = EC_ElGamal_bindPrivateKey(privKey, privKeyLen, &options)) != EC_ElGamal_OK) {
    ThrowException(Exception::TypeError(String::New("Error binding private key: " + rc)));
    return scope.Close(Undefined());
  }

  // TODO: What if function return-type is void? Either use exception or return code.
  return scope.Close(Number::New(rc));
}

static Handle<Value> decrypt(const Arguments& args) {
  HandleScope scope;

  if (args.Length() != 2) {
    ThrowException(Exception::TypeError(String::New("Invalid arguments")));
    return scope.Close(Undefined());
  }

  Local<Object> bufferObj1 = args[0]->ToObject();
  unsigned char* cipher = (unsigned char*)Buffer::Data(bufferObj1);
  int cipherLen = (int)Buffer::Length(bufferObj1);

  if (! (cipher && cipherLen)) {
    ThrowException(Exception::TypeError(String::New("Empty cipher")));
    return scope.Close(Undefined());
  }

  Local<Object> bufferObj2 = args[1]->ToObject();
  unsigned char* plain = (unsigned char*)Buffer::Data(bufferObj2);
  int plainLen = (int)Buffer::Length(bufferObj2);

  if (! (plain && plainLen)) {
    ThrowException(Exception::TypeError(String::New("Empty plain")));
    return scope.Close(Undefined());
  }

  int rc;

  if ((rc = EC_ElGamal_decrypt(cipher, cipherLen, plain, &plainLen, &options)) != EC_ElGamal_OK) {
    ThrowException(Exception::TypeError(String::New("Decrypt error: " + rc)));
    return scope.Close(Undefined());
  }

  // TODO: What if function return-type is void? Either use exception or return code.
  return scope.Close(Number::New(rc));
}

static void init(Handle<Object> exports) {
  int rc;

  if ((rc = EC_ElGamal_initialize(EC_CURVE_ID_DEF, &options)) != EC_ElGamal_OK) {
    ThrowException(Exception::TypeError(String::New("Initialization error: " + rc)));
  } else {
    exports->Set(String::NewSymbol("bindPrivateKey"),
        FunctionTemplate::New(bindPrivateKey)->GetFunction());

    exports->Set(String::NewSymbol("decrypt"),
        FunctionTemplate::New(decrypt)->GetFunction());
  }
}

NODE_MODULE(elgamal, init)


