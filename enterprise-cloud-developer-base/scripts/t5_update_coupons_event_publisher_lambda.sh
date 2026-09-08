#!/bin/bash

function fail() {
  echo $2
  exit 1
}

echo "Installing dependencies for coupons_event_publisher"
npm install --prefix ./lambda/coupons_event_publisher
[ $? == 0 ] || fail 1 "Failed to install dependencies"

echo "Creating deployment package for coupons_event_publisher function"
PROJECT_DIR=$(pwd)
cd ./lambda/coupons_event_publisher
zip -r "${PROJECT_DIR}/coupons_event_publisher.zip" .
cd "$PROJECT_DIR"
[ $? == 0 ] || fail 2 "Failed to create deployment package"

echo "Updating coupons_event_publisher function code"
awslocal lambda update-function-code \
    --function-name "coupons_event_publisher" \
    --zip-file fileb://coupons_event_publisher.zip
[ $? == 0 ] || fail 3 "Failed to update function code"
echo "coupons_event_publisher function updated successfully"
