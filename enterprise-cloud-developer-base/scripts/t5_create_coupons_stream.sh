#!/bin/bash

STREAM_NAME="coupons"

function fail() {
  echo $2
  exit 1
}

echo "Checking for existing ${STREAM_NAME} stream"
awslocal kinesis describe-stream --stream-name "${STREAM_NAME}" >/dev/null 2>&1

if [ $? == 0 ]; then
  echo "${STREAM_NAME} stream already exists, nothing to do"
  exit 0
fi

echo "Creating ${STREAM_NAME} Kinesis stream with 5 shards"
awslocal kinesis create-stream \
    --stream-name "${STREAM_NAME}" \
    --shard-count 5
[ $? == 0 ] || fail 1 "Failed to create ${STREAM_NAME} stream"

echo "${STREAM_NAME} stream created successfully"
