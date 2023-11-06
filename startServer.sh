#!/bin/bash

echo "Script starting"
cd /opt/lampp/htdocs/react-apps/school-fees-payment-system/server-directory
echo "Current directory: $(pwd)"

# Run yarn
yarn server start

echo "Script completed"
