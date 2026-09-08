#!/bin/bash

function fail() {
  echo $2
  exit 1
}

echo "Checking for existing coupons table"
awslocal dynamodb describe-table --table-name "coupons" >/dev/null 2>&1

if [ $? == 0 ]; then
  echo "coupons table already exists, nothing to do"
  exit 0
fi

# 50 eventually consistent reads/sec @ ~1KB items -> 1 RCU = 2 eventually
# consistent reads/sec of up to 4KB -> 50 / 2 = 25 RCU.
# 10 writes/sec @ ~1KB items -> 1 WCU = 1 write/sec of up to 1KB -> 10 WCU.
echo "Creating DynamoDB Table for coupons (25 RCU / 10 WCU)"
awslocal dynamodb create-table \
    --table-name "coupons" \
    --attribute-definitions AttributeName=coupon_id,AttributeType=S \
    --key-schema AttributeName=coupon_id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=25,WriteCapacityUnits=10
[ $? == 0 ] || fail 1 "Failed to create coupons table"

echo "coupons table created successfully"
