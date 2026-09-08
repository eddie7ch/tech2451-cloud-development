#!/bin/bash

function fail() {
  echo $2
  exit 1
}

echo "Installing dependencies for coupons_import"
npm install --prefix ./lambda/coupons_import
[ $? == 0 ] || fail 1 "Failed to install dependencies"

echo "Creating deployment package for coupons_import function"
PROJECT_DIR=$(pwd)
cd ./lambda/coupons_import
zip -r "${PROJECT_DIR}/coupons_import.zip" .
cd "$PROJECT_DIR"
[ $? == 0 ] || fail 2 "Failed to create deployment package"

echo "Updating coupons_import function code"
awslocal lambda update-function-code \
    --function-name "coupons_import" \
    --zip-file fileb://coupons_import.zip
[ $? == 0 ] || fail 3 "Failed to update function code"
echo "coupons_import function updated successfully"
