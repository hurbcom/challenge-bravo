#!/bin/bash

docker-compose -f docker-compose.test.yml up --build --exit-code-from bravo-api-test

if [ $? -eq 0 ]
then
  echo "Tests were run successfully"
  exit 0
else
  echo "Tests failed"
  exit 1
fi
