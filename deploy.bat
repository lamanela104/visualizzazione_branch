@echo off
git checkout %1
git fetch
git pull origin %1
