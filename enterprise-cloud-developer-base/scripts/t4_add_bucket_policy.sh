#!/bin/bash

BUCKET_NAME="coupons"

function fail() {
  echo $2
  exit 1
}

echo "Adding deny-delete-without-MFA policy to ${BUCKET_NAME} bucket"
awslocal s3api put-bucket-policy \
    --bucket "${BUCKET_NAME}" \
    --policy file://scripts/coupons_bucket_policy.json
[ $? == 0 ] || fail 1 "Failed to add bucket policy"

echo "Bucket policy added successfully"
