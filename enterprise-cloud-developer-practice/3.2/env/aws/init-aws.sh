#!/bin/bash

awslocal iam create-role --role-name lambda-ex --assume-role-policy-document '{"Version": "2012-10-17","Statement": [{ "Effect": "Allow", "Principal": {"Service": "lambda.amazonaws.com"}, "Action": "sts:AssumeRole"}]}'

awslocal iam attach-role-policy --role-name lambda-ex --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

awslocal lambda create-function --function-name get-token \
--zip-file fileb:///usr/src/function.zip  --handler get-token.handler --runtime nodejs14.x \
--role arn:aws:iam::000000000000:role/lambda-ex \
--environment "Variables={JWT_TOKEN=superSecrettoken}"

awslocal lambda create-function --function-name get-data \
--zip-file fileb:///usr/src/function.zip  --handler get-data.handler --runtime nodejs14.x \
--role arn:aws:iam::000000000000:role/lambda-ex \
--environment "Variables={JWT_TOKEN=superSecrettoken}"

echo "Setup Complete!"