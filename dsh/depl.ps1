$depl = $args[0]
$dist = $PWD.Path/../dist
$tmp = $PWD.Path/../tmp
Remove-Item -Path $tmp/* -Recurse -Force

Move-Item -Path $depl/.git -Destination $tmp
Move-Item -Path $depl/README.md -Destination $tmp

Copy-item -Force -Verbose -Recurse $dist/* -Destination $depl

Move-Item -Path $tmp/.git -Destination $dist
Move-Item -Path $tmp/README.md -Destination $dist

Write-Output "Deployment $depl done"
