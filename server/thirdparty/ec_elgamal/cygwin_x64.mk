###############################################################################
#
# MS-Windows Definitions: Cygwin, MSVC, and MS-Windows OpenSSL library
#
###############################################################################

#
# Path normalization functions
#
normalize_path = $(shell cygpath -mas $1)
absolute_path  = $(shell readlink -f $1)

#
# Host-specific definitions
#
HOST_OS = cygwin_x64
RM = rm -rf
EXE_EXT = .exe
CC_PATH = $(call normalize_path, "$(VCINSTALLDIR)")/bin/amd64
export FrameworkDir=C:\Windows\Microsoft.NET\Framework64
export LIB=$(VCINSTALLDIR)\atlmfc\lib\amd64;$(VCINSTALLDIR)\lib\amd64;C:\Program Files\Microsoft SDKs\Windows\v7.1\Lib\x64
export LIBPATH=$(FrameworkDir)\v3.5;$(FrameworkDir)\v4.0.30319;$(VCINSTALLDIR)\atlmfc\lib\amd64;$(VCINSTALLDIR)\lib\amd64

#
# Host compiler
#
CC = $(CC_PATH)/cl$(EXE_EXT)
CPP = $(CC_PATH)/cl$(EXE_EXT)
LD = $(CC_PATH)/link$(EXE_EXT)
AR = $(CC_PATH)/lib$(EXE_EXT)
MANIFESTS = /D_WIN64 /D_CRT_SECURE_NO_WARNINGS /D_CRT_NONSTDC_NO_DEPRECATE /D_CRT_SECURE_NO_DEPRECATE
LIB_EXT = lib
LIB_PREFIX =
OBJ_EXT = obj
INCLUDE_FLAG = /I
OBJ_FLAG = /Fo
EXE_FLAG = /Fe
LIBOUT_FLAG = /OUT:
LIBPATH_FLAG = /LIBPATH:
LINK_LIB_SUFFIX = .$(LIB_EXT)
LINK_LIB_PREFIX = 
EXEOUT_FLAG = /OUT:
CFLAGS = /c /Gy /O2 /nologo /MT /W4 $(MANIFESTS)
DEBUG_CFLAGS = /Zi /Od
ARFLAGS = /nologo /MACHINE:X64
LDFLAGS = /nologo /MACHINE:X64
DEBUG_LDFLAGS = /DEBUG
VERSION_FLAG = 
DLL_FLAGS = /DLL /NODEFAULTLIB:libc.$(LIB_EXT)
DLL_EXT = .dll
EXP_LIB_EXT = .$(LIB_EXT)
IGNORE_LIB_FLAG = /NODEFAULTLIB:
NO_OPTIMIZATION_FLAG = /Od

#
# Home folder
#
WKS_HOME_ABS := $(call absolute_path, ./)
WKS_HOME_REL := .

#
# OpenSSL configuration
#
SSL_HOME = C:/OpenSSL-Win64
SSL_INC_PATH = $(INCLUDE_FLAG)"$(SSL_HOME)/include"
# Dynamic libraries
SSL_LIB_PATH = $(LIBPATH_FLAG)"$(SSL_HOME)/lib"
SSL_LIBS = libeay32.$(LIB_EXT) ssleay32.$(LIB_EXT)
# Static libraries
#SSL_LIB_PATH = $(LIBPATH_FLAG)"$(SSL_HOME)/lib/VC/static"
#SSL_LIBS = libeay32MD.$(LIB_EXT) ssleay32MD.$(LIB_EXT)

#
# Update environment
#
WKS_BIN_ABS := "$(SSL_HOME)/bin"
export PATH := $(WKS_BIN_ABS):$(PATH)

