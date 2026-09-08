#!/bin/bash

function fail() {
  echo $2
  exit 1
}

echo "Installing dependencies for coupons_notification_sender"
npm install --prefix ./lambda/coupons_notification_sender
[ $? == 0 ] || fail 1 "Failed to install dependencies"

echo "Creating deployment package for coupons_notification_sender function"
PROJECT_DIR=$(pwd)
cd ./lambda/coupons_notification_sender
zip -r "${PROJECT_DIR}/coupons_notification_sender.zip" .
cd "$PROJECT_DIR"
[ $? == 0 ] || fail 2 "Failed to create deployment package"

echo "Updating coupons_notification_sender function code"
awslocal lambda update-function-code \
    --function-name "coupons_notification_sender" \
    --zip-file fileb://coupons_notification_sender.zip
[ $? == 0 ] || fail 3 "Failed to update function code"
echo "coupons_notification_sender function updated successfully"
