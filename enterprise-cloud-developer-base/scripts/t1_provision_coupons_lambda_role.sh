#!/bin/bash

function fail() {
  echo $2
  exit 1
}

echo "Checking for existing coupons_lambda_role"
awslocal iam get-role --role-name "coupons_lambda_role" >/dev/null 2>&1

if [ $? == 0 ]; then
  echo "coupons_lambda_role already exists, nothing to do"
  exit 0
fi

echo "Creating coupons_lambda_role_policy"
awslocal iam create-policy --policy-name "coupons_lambda_role_policy" --policy-document file://scripts/coupons_lambda_role_policy.json
[ $? == 0 ] || fail 1 "Failed to create coupons_lambda_role_policy"

echo "Creating coupons_lambda_role"
awslocal iam create-role \
  --role-name "coupons_lambda_role" \
  --assume-role-policy-document \
  file://scripts/coupons_lambda_role_assume_role_policy.json
[ $? == 0 ] || fail 2 "Failed to create coupons_lambda_role"

echo "Attaching coupons_lambda_role_policy to coupons_lambda_role"
awslocal iam attach-role-policy \
  --role-name "coupons_lambda_role" \
  --policy-arn "arn:aws:iam::000000000000:policy/coupons_lambda_role_policy"
[ $? == 0 ] || fail 3 "Failed to attach policy to coupons_lambda_role"

echo "coupons_lambda_role provisioned successfully"
