#!/bin/bash

function fail() {
  echo $2
  exit 1
}

echo "Installing dependencies for coupons_list"
npm install --prefix ./lambda/coupons_list
[ $? == 0 ] || fail 1 "Failed to install dependencies"

echo "Creating deployment package for coupons_list function"
PROJECT_DIR=$(pwd)
cd ./lambda/coupons_list
zip -r "${PROJECT_DIR}/coupons_list.zip" .
cd "$PROJECT_DIR"
[ $? == 0 ] || fail 2 "Failed to create deployment package"

echo "Retrieving coupons_lambda_role Arn"
COUPONS_LAMBDA_ROLE_ARN=$(awslocal iam get-role --role-name "coupons_lambda_role" --query 'Role.Arn' --output text)
[ $? == 0 ] || fail 3 "Failed to retrieve coupons_lambda_role Arn"

echo "Creating coupons_list function"
awslocal lambda create-function \
    --function-name "coupons_list" \
    --runtime "nodejs14.x" \
    --zip-file fileb://coupons_list.zip \
    --handler "index.handler" \
    --role "${COUPONS_LAMBDA_ROLE_ARN}"
[ $? == 0 ] || fail 4 "Failed to create function"
echo "coupons_list function created successfully"
