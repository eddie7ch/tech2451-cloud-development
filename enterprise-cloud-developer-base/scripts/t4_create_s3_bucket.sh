#!/bin/bash

BUCKET_NAME="coupons"
REGION="us-east-1"

function fail() {
  echo $2
  exit 1
}

echo "Checking for existing ${BUCKET_NAME} bucket"
awslocal s3api head-bucket --bucket "${BUCKET_NAME}" >/dev/null 2>&1

if [ $? == 0 ]; then
  echo "${BUCKET_NAME} bucket already exists, nothing to do"
  exit 0
fi

echo "Creating ${BUCKET_NAME} S3 bucket with private ACL"
awslocal s3api create-bucket \
    --bucket "${BUCKET_NAME}" \
    --acl private \
    --region ${REGION}
[ $? == 0 ] || fail 1 "Failed to create ${BUCKET_NAME} bucket"

echo "${BUCKET_NAME} bucket created successfully"
