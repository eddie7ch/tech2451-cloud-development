#!/bin/bash

API_NAME="products"
REGION="us-east-1"

echo "Creating REST API"
awslocal apigateway create-rest-api \
  --region "${REGION}" \
  --name "${API_NAME}"
echo "Api created successfully"

echo "Retrieving Api id"
API_ID=$(awslocal apigateway get-rest-apis --region ${REGION} --query "items[?name==\`${API_NAME}\`].id" --output text)
echo "Api id ${API_ID}"