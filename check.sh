#!/bin/bash

for ((i = 1; i <= 100; i++)); do
    node index.js --count 1 --page $i
done
