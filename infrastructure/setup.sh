#!/bin/bash
aws cognito-idp sign-up \
  --region us-east-1 \
  --client-id 2n2501fik98d3j7khv6bvg1rje\
  --username mail@dennisseidel.de \
  --password Passw0rd!

aws cognito-idp admin-confirm-sign-up \
  --region us-east-1 \
  --user-pool-id us-east-1_QusUBxNBx \
  --username mail@dennisseidel.de