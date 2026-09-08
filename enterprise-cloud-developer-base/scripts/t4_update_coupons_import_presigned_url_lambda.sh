#!/bin/bash

function fail() {
  echo $2
  exit 1
}

echo "Installing dependencies for coupons_import_presigned_url"
npm install --prefix ./lambda/coupons_import_presigned_url
[ $? == 0 ] || fail 1 "Failed to install dependencies"

echo "Creating deployment package for coupons_import_presigned_url function"
PROJECT_DIR=$(pwd)
cd ./lambda/coupons_import_presigned_url
zip -r "${PROJECT_DIR}/coupons_import_presigned_url.zip" .
cd "$PROJECT_DIR"
[ $? == 0 ] || fail 2 "Failed to create deployment package"

echo "Updating coupons_import_presigned_url function code"
awslocal lambda update-function-code \
    --function-name "coupons_import_presigned_url" \
    --zip-file fileb://coupons_import_presigned_url.zip
[ $? == 0 ] || fail 3 "Failed to update function code"
echo "coupons_import_presigned_url function updated successfully"
