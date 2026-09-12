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

echo "Retrieving ${TOPIC_NAME} topic Arn"
TOPIC_ARN=$(awslocal sns list-topics --query "Topics[?contains(TopicArn, ':${TOPIC_NAME}')].TopicArn" --output text)
[ -n "${TOPIC_ARN}" ] || fail 2 "Failed to retrieve ${TOPIC_NAME} topic Arn"

# do this before the deny-non-email policy below, since that policy only
# blocks future subscribe calls, not ones already in place
echo "Adding a demo HTTP subscription to ${TOPIC_NAME} topic"
awslocal sns subscribe \
    --topic-arn "${TOPIC_ARN}" \
    --protocol http \
    --notification-endpoint "http://localhost:4566/_sns_demo_subscriber"
[ $? == 0 ] || fail 3 "Failed to add HTTP subscription"

echo "${TOPIC_NAME} topic created successfully"
