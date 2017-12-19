#!/bin/bash

#
# Release a new version of the library
#
# Run semantic-release
# Publish to NPM
#

. ~/.bashrc

# Prep the release
npm run semantic-release

