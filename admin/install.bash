#!/bin/bash
if [ "$#" -ne 4 ];
then
  echo "Usage: Host Database User Password"
  exit 1
fi

psql -f schema.sql -h $1 -d $2 -U $3

echo "<?php \$dbconn = pg_connect('host=$1 dbname=$2 user=$3 password=$4');?>" | cat - ../api/api.php > out && mv out ../api/api.php

htpasswd -bm htpasswd $3 $4

chmod 644 ../index.php
chmod 644 ../*.js
chmod 644 ../style.css
chmod 644 ../api/api.php
