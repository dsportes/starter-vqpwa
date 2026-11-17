#! /bin/sh
cp ./public/about.txt ./dsh/tmp/about.txt

cp ./dsh/$1/custom.json ./src/assets/custom.json
cp ./dsh/$1/about.txt ./public/about.txt

npm run build

echo "{ }" > ./src/assets/custom.json
cp ./dsh/tmp/about.txt ./public/about.txt

echo dist $1 done
