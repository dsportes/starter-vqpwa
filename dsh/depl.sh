#! /bin/sh
$depl = $1
$dist = $(pwd)/../dist
$tmp = $(cwd)/tmp
rm -rf $tmp/*

mv $depl/.git $tmp
mv $depl/README.md $tmp

rm -rf $depl/*
cp -r $dist/* $depl

mv $tmp/.git $depl
mv $tmp/README.md $depl

echo Deployment $depl done
