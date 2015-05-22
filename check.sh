#!/bin/bash

for ((i = 0; i < 100; i++)); do
    node check.js --index $i
done
