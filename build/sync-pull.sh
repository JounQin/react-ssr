#!/usr/bin/env bash

set -e

rm -rf dist
git clone https://github.com/JounQin/react-ssr.git dist -b assets
rm -rf dist/.git
