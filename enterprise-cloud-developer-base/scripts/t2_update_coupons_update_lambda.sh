#!/bin/bash

function fail() {
  echo $2
  exit 1
}

echo "Installing dependencies for coupons_update"
npm install --prefix ./lambda/coupons_update
[ $? == 0 ] || fail 1 "Failed to install dependencies"

echo "Creating deployment package for coupons_update function"
PROJECT_DIR=$(pwd)
cd ./lambda/coupons_update
zip -r "${PROJECT_DIR}/coupons_update.zip" .
cd "$PROJECT_DIR"
[ $? == 0 ] || fail 2 "Failed to create deployment package"

echo "Updating coupons_update function code"
awslocal lambda update-function-code \
    --function-name "coupons_update" \
    --zip-file fileb://coupons_update.zip
[ $? == 0 ] || fail 3 "Failed to update function code"
echo "coupons_update function updated successfully"
