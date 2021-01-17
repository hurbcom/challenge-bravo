#!/bin/bash

conn="mongodb://localhost:27117/bravo"
folder="migration"

if [ ! -z "$1" ]
then
  conn=$1
fi

if [ ! -z "$2" ]
then
  folder=$2
fi

pymongo-migrate migrate -u $conn -m $folder
