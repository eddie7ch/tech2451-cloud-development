#!/bin/bash

function fail() {
  echo $2
  exit 1
}

echo "Installing dependencies for coupons_get_token"
npm install --prefix ./lambda/coupons_get_token
[ $? == 0 ] || fail 1 "Failed to install dependencies"

echo "Creating deployment package for coupons_get_token function"
PROJECT_DIR=$(pwd)
cd ./lambda/coupons_get_token
zip -r "${PROJECT_DIR}/coupons_get_token.zip" .
cd "$PROJECT_DIR"
[ $? == 0 ] || fail 2 "Failed to create deployment package"

echo "Updating coupons_get_token function code"
awslocal lambda update-function-code \
    --function-name "coupons_get_token" \
    --zip-file fileb://coupons_get_token.zip
[ $? == 0 ] || fail 3 "Failed to update function code"
echo "coupons_get_token function updated successfully"
