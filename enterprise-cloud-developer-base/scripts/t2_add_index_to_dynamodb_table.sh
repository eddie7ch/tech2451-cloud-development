#!/bin/bash

INDEX_NAME="provider_id-campaign_id-index"

function fail() {
  echo $2
  exit 1
}

echo "Checking for existing ${INDEX_NAME}"
awslocal dynamodb describe-table --table-name "coupons" \
  --query "Table.GlobalSecondaryIndexes[?IndexName=='${INDEX_NAME}'].IndexName" --output text 2>/dev/null | grep -q "${INDEX_NAME}"

if [ $? == 0 ]; then
  echo "${INDEX_NAME} already exists, nothing to do"
  exit 0
fi

echo "Adding ${INDEX_NAME} to coupons table (provider_id HASH, campaign_id RANGE)"
awslocal dynamodb update-table \
    --table-name "coupons" \
    --attribute-definitions AttributeName=provider_id,AttributeType=S AttributeName=campaign_id,AttributeType=S \
    --global-secondary-index-updates \
    "[{\"Create\":{\"IndexName\":\"${INDEX_NAME}\",\"KeySchema\":[{\"AttributeName\":\"provider_id\",\"KeyType\":\"HASH\"},{\"AttributeName\":\"campaign_id\",\"KeyType\":\"RANGE\"}],\"Projection\":{\"ProjectionType\":\"ALL\"},\"ProvisionedThroughput\":{\"ReadCapacityUnits\":25,\"WriteCapacityUnits\":10}}}]"
[ $? == 0 ] || fail 1 "Failed to add index to coupons table"

echo "${INDEX_NAME} added successfully"
