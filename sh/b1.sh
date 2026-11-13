#! /bin/sh
cp sh/custom-1.json src/assets/custom.json
npm run build
cp sh/custom-d.json src/assets/custom.json
echo done !
