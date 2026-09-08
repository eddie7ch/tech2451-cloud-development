#!/bin/bash

TOPIC_NAME="coupons"

function fail() {
  echo $2
  exit 1
}

echo "Checking for existing ${TOPIC_NAME} topic"
EXISTING=$(awslocal sns list-topics --query "Topics[?contains(TopicArn, ':${TOPIC_NAME}')].TopicArn" --output text)

if [ -n "${EXISTING}" ]; then
  echo "${TOPIC_NAME} topic already exists, nothing to do"
  exit 0
fi

echo "Creating ${TOPIC_NAME} SNS topic"
awslocal sns create-topic --name "${TOPIC_NAME}"
[ $? == 0 ] || fail 1 "Failed to create ${TOPIC_NAME} topic"

echo "${TOPIC_NAME} topic created successfully"
