#!/bin/bash

TOPIC_NAME="coupons"

function fail() {
  echo $2
  exit 1
}

echo "Retrieving ${TOPIC_NAME} topic Arn"
TOPIC_ARN=$(awslocal sns list-topics --query "Topics[?contains(TopicArn, ':${TOPIC_NAME}')].TopicArn" --output text)
[ -n "${TOPIC_ARN}" ] || fail 1 "Failed to retrieve ${TOPIC_NAME} topic Arn"
echo "${TOPIC_NAME} topic Arn ${TOPIC_ARN}"

echo "Adding deny-non-email-protocol policy to ${TOPIC_NAME} topic"
awslocal sns set-topic-attributes \
    --topic-arn "${TOPIC_ARN}" \
    --attribute-name Policy \
    --attribute-value file://scripts/coupons_topic_policy.json
[ $? == 0 ] || fail 2 "Failed to add policy to ${TOPIC_NAME} topic"

echo "Policy added successfully"
