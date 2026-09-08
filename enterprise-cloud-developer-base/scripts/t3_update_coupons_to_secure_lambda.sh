#!/bin/bash

function fail() {
  echo $2
  exit 1
}

echo "Installing dependencies for coupons_to_secure"
npm install --prefix ./lambda/coupons_to_secure
[ $? == 0 ] || fail 1 "Failed to install dependencies"

echo "Creating deployment package for coupons_to_secure function"
PROJECT_DIR=$(pwd)
cd ./lambda/coupons_to_secure
zip -r "${PROJECT_DIR}/coupons_to_secure.zip" .
cd "$PROJECT_DIR"
[ $? == 0 ] || fail 2 "Failed to create deployment package"

echo "Updating coupons_to_secure function code"
awslocal lambda update-function-code \
    --function-name "coupons_to_secure" \
    --zip-file fileb://coupons_to_secure.zip
[ $? == 0 ] || fail 3 "Failed to update function code"
echo "coupons_to_secure function updated successfully"
