#--
#  Makefile to build EC El Gamal library and execute test.
#
#  Dependencies:
#  - Openssl Library.
#--

SHELL = /bin/bash

#
# Detect Host OS
#
UNAME_OS := $(shell uname -a)
ifneq ($(findstring CYGWIN, $(UNAME_OS)),)
CFG_MAKE = cygwin_x64.mk
else
ifneq ($(findstring Linux, $(UNAME_OS)),)
CFG_MAKE = linux_x64.mk
else
ifneq ($(findstring OSX, $(UNAME_OS)),)
CFG_MAKE = osx_x64.mk
else
$(error "Unsupported host OS: $(UNAME_OS)")
endif
endif
endif

#
# Host-specific definitions
#
include $(strip $(wildcard $(CFG_MAKE)))

#
# Info
#
$(info -------------------------------------------------------------)
$(info - Host-specific configuration:)
$(info - * HOST_OS      = !$(HOST_OS)!)
$(info - * WKS_HOME_ABS = !$(WKS_HOME_ABS)!)
$(info -------------------------------------------------------------)

.SECONDARY:

BASE_NAME = ec_elgamal
SRC       = $(BASE_NAME).c
INC       = $(BASE_NAME).h
LIB_NAME  = $(LIB_PREFIX)elgamal.$(LIB_EXT)
EXEC_NAME = eceg_test$(EXE_EXT)

.PHONY: all lib clean

all: $(EXEC_NAME)
	./$< 5

lib: $(LIB_NAME)

$(EXEC_NAME): $(BASE_NAME)_test.$(OBJ_EXT) $(LIB_NAME)
	$(LD) $(LDFLAGS) $(SSL_LIB_PATH) $? $(SSL_LIBS) $(EXEOUT_FLAG)$@

$(LIB_NAME): $(BASE_NAME).$(OBJ_EXT)
	$(AR) $(ARFLAGS) $(LIBOUT_FLAG)$@ $?

%.$(OBJ_EXT): %.c $(INC)
	$(CC) $(CFLAGS) $(SSL_INC_PATH) $<

clean:
	$(RM) $(basename $(EXEC_NAME))* $(LIB_NAME) *.$(OBJ_EXT) $(EXTRA_CLEAN_FILES)

