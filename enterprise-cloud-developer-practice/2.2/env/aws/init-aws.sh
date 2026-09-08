#!/bin/bash

echo "Creating table..."
awslocal dynamodb create-table \
        --table-name music \
        --attribute-definitions \
            AttributeName=artist,AttributeType=S \
        --key-schema \
            AttributeName=artist,KeyType=HASH \
        --provisioned-throughput \
            ReadCapacityUnits=5,WriteCapacityUnits=5 \
        --table-class STANDARD

awslocal dynamodb put-item --table-name music --item "{\"artist\":{\"S\":\"Elvis Presley\"}, \"songTitle\":{\"S\":\"Stuck on You\"}}"
awslocal dynamodb put-item --table-name music --item "{\"artist\":{\"S\":\"Michael Jackson\"}, \"songTitle\":{\"S\":\"Beat It \"}}"
awslocal dynamodb put-item --table-name music --item "{\"artist\":{\"S\":\"Mariah Carey\"}, \"songTitle\":{\"S\":\"I'll Be There\"}}"
awslocal dynamodb put-item --table-name music --item "{\"artist\":{\"S\":\"Madonna\"}, \"songTitle\":{\"S\":\"Like A Prayer\"}}"

echo "Creating IAM Role for lambda..."
awslocal iam create-role --role-name lambda-artist --assume-role-policy-document '{"Version": "2012-10-17","Statement": [{ "Effect": "Allow", "Principal": {"Service": "lambda.amazonaws.com"}, "Action": "sts:AssumeRole"}]}'
awslocal iam attach-role-policy --role-name lambda-artist --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
awslocal iam attach-role-policy --role-name lambda-artist --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess


echo "Uploading code..."
awslocal lambda create-function --function-name get-artist \
--zip-file fileb:///usr/src/function.zip --handler fetch_dynamodb.handler --runtime nodejs14.x \
--role arn:aws:iam::000000000000:role/lambda-artist

echo "Setup Complete!"