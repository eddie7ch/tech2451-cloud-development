#!/bin/bash

API_NAME="crm"
REGION="us-east-1"

echo "Creating DynamoDB Table for users"
awslocal dynamodb create-table \
    --table-name "users" \
    --attribute-definitions AttributeName=username,AttributeType=S \
    --key-schema AttributeName=username,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

echo "Adding sample user to database"
awslocal dynamodb put-item \
    --table-name "users" \
    --item '{"username":{"S":"tester1"},"password":{"S":"$2y$10$MYfzCH63tnZeuJQ7bssR9udF6ULm8xJFHA1y.u7yWGFjFVa6MLD0K"}}' \
    --return-consumed-capacity TOTAL \
    --return-item-collection-metrics SIZE
echo 'Plaintext: KHnK#Sm^%t8!JZ*J!5rCpQn#'

echo "Adding sample user to database"
awslocal dynamodb put-item \
    --table-name "users" \
    --item '{"username":{"S":"tester2"},"password":{"S":"$2y$10$znjGeTlzyO8ZPBtw2EyZOO5zpBoZ3Vp1jDjRdrNypDzkVvWtCkT5e"}}' \
    --return-consumed-capacity TOTAL \
    --return-item-collection-metrics SIZE
echo 'Plaintext: s$8upI5jKrs@k6LMPJA5bajo'