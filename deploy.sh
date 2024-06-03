#!/bin/bash

git checkout "$1"
git fetch
git pull origin "$1"
echo "Deployed $0"
