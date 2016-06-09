###############################################################################
#
# Linux Definitions: GCC and Linux OpenSSL library
#
###############################################################################

#
# Path normalization functions
#
absolute_path = $(shell readlink -f $1)

#
# Host-specific definitions
#
HOST_OS = linux_x64
RM = rm -rf
EXE_EXT = 

#
# Host compiler
#
CC = gcc
CPP = g++
LD = g++
AR = ar
RANLIB = ranlib
STRIP = strip
OBJCOPY = objcopy
LIB_EXT = a
LIB_PREFIX = lib
OBJ_EXT = o
INCLUDE_FLAG = -I
# NB: trailing blank on following define
OBJ_FLAG = -o 
# NB: trailing blank on following define
EXE_FLAG = -o 
LIBPATH_FLAG = -L
LINK_LIB_SUFFIX = 
LINK_LIB_PREFIX = -l
# NB: trailing blank on following define
EXEOUT_FLAG := -o 
LIBOUT_FLAG =
CFLAGS = -c -O2 -Wall -m64 -fPIC
DEBUG_CFLAGS = -g -O0
ARFLAGS = cr
LDFLAGS = -m64
DEBUG_LDFLAGS = -g
VERSION_FLAG = --version
DLL_FLAGS ?= -shared
DLL_EXT ?= .so
EXP_LIB_EXT = $(DLL_EXT)
NO_OPTIMIZATION_FLAG = -O0
EXTRA_CLEAN_FILES += *.gch

#
# Home folder
#
WKS_HOME_ABS := $(call absolute_path, ./)
WKS_HOME_REL := .

#
# OpenSSL configuration
#
SSL_HOME := /usr
SSL_INC_PATH := $(INCLUDE_FLAG) $(SSL_HOME)/include
SSL_LIB_PATH := $(LIBPATH_FLAG) $(SSL_HOME)/lib
SSL_LIBS = -lssl

#
# Update environment
#
export PATH := $(WKS_BIN_ABS):$(PATH)

