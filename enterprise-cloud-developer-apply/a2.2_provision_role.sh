#!/bin/bash

echo "Creating role for lambda functions"
awslocal iam create-role \
  --role-name "match_lambda_role" \
  --assume-role-policy-document \
  file://assume_role_policy.json

echo "Attaching policy to role"
awslocal iam attach-role-policy \
  --role-name "match_lambda_role" \
  --policy-arn "arn:aws:iam::aws:policy/AdministratorAccess"