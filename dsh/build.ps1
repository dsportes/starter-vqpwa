$tg = $args[0]
Copy-Item -Force -Verbose -Path "./public/about.txt" -Destination "./dsh/tmp/about.txt"

Copy-Item -Force -Verbose -Path "./dsh/$tg/custom.json" -Destination "./src/assets/custom.json"
Copy-Item -Force -Verbose -Path "./dsh/$tg/about.txt" -Destination "./public/about.txt"

npm run build

Set-Content -Path "./src/assets/custom.json" -Value "{ }"
Copy-Item -Force -Verbose -Path "./dsh/tmp/about.txt" -Destination "./public/about.txt"

Write-Output "dist $tg done"
