#!/bin/bash

echo "Creating table..."
awslocal dynamodb create-table \
        --table-name contact \
        --attribute-definitions \
            AttributeName=contact_id,AttributeType=N \
        --key-schema \
            AttributeName=contact_id,KeyType=HASH \
        --provisioned-throughput \
            ReadCapacityUnits=5,WriteCapacityUnits=5 \
        --table-class STANDARD

awslocal dynamodb put-item --table-name contact --item "{\"contact_id\":{\"N\":\"0001\"},\"name\":{\"S\":\"John Doe\"}, \"email\":{\"S\":\"john.doe@example.ca\"}, \"phone\":{\"S\":\"1234567890\"}}"
awslocal dynamodb put-item --table-name contact --item "{\"contact_id\":{\"N\":\"0002\"},\"name\":{\"S\":\"Olive Yew\"}, \"email\":{\"S\":\"olive.yew@example.ca\"}, \"phone\":{\"S\":\"1234567890\"}}"
awslocal dynamodb put-item --table-name contact --item "{\"contact_id\":{\"N\":\"0003\"},\"name\":{\"S\":\"Allie Grater\"}, \"email\":{\"S\":\"allie.grater@example.ca\"}, \"phone\":{\"S\":\"1234567890\"}}"
awslocal dynamodb put-item --table-name contact --item "{\"contact_id\":{\"N\":\"0004\"},\"name\":{\"S\":\"Ray Sin\"}, \"email\":{\"S\":\"ray.sin@example.ca\"}, \"phone\":{\"S\":\"1234567890\"}}"
awslocal dynamodb put-item --table-name contact --item "{\"contact_id\":{\"N\":\"0005\"},\"name\":{\"S\":\"Peg Legge\"}, \"email\":{\"S\":\"peg.legge@example.ca\"}, \"phone\":{\"S\":\"1234567890\"}}"
awslocal dynamodb put-item --table-name contact --item "{\"contact_id\":{\"N\":\"0006\"},\"name\":{\"S\":\"Anita Bath\"}, \"email\":{\"S\":\"anita.bath@example.ca\"}, \"phone\":{\"S\":\"1234567890\"}}"
awslocal dynamodb put-item --table-name contact --item "{\"contact_id\":{\"N\":\"0007\"},\"name\":{\"S\":\"Perry Scope\"}, \"email\":{\"S\":\"perry.scope@example.ca\"}, \"phone\":{\"S\":\"1234567890\"}}"
awslocal dynamodb put-item --table-name contact --item "{\"contact_id\":{\"N\":\"0008\"},\"name\":{\"S\":\"Jen Tile\"}, \"email\":{\"S\":\"jen.tile@example.ca\"}, \"phone\":{\"S\":\"1234567890\"}}"
awslocal dynamodb put-item --table-name contact --item "{\"contact_id\":{\"N\":\"0009\"},\"name\":{\"S\":\"Laura Norda\"}, \"email\":{\"S\":\"laura.norda@example.ca\"}, \"phone\":{\"S\":\"1234567890\"}}"
awslocal dynamodb put-item --table-name contact --item "{\"contact_id\":{\"N\":\"0010\"},\"name\":{\"S\":\"Abby Normal\"}, \"email\":{\"S\":\"abby.normal@example.ca\"}, \"phone\":{\"S\":\"1234567890\"}}"
awslocal dynamodb put-item --table-name contact --item "{\"contact_id\":{\"N\":\"0011\"},\"name\":{\"S\":\"Fran Tick\"}, \"email\":{\"S\":\"fran.tick@example.ca\"}, \"phone\":{\"S\":\"1234567890\"}}"
awslocal dynamodb put-item --table-name contact --item "{\"contact_id\":{\"N\":\"0012\"},\"name\":{\"S\":\"Carmen Goh\"}, \"email\":{\"S\":\"carmen.goh@example.ca\"}, \"phone\":{\"S\":\"1234567890\"}}"
awslocal dynamodb put-item --table-name contact --item "{\"contact_id\":{\"N\":\"0013\"},\"name\":{\"S\":\"Mary Krismass\"}, \"email\":{\"S\":\"mary.krismass@example.ca\"}, \"phone\":{\"S\":\"1234567890\"}}"
awslocal dynamodb put-item --table-name contact --item "{\"contact_id\":{\"N\":\"0014\"},\"name\":{\"S\":\"Anne Gloindian\"}, \"email\":{\"S\":\"anne.gloindian@example.ca\"}, \"phone\":{\"S\":\"1234567890\"}}"
awslocal dynamodb put-item --table-name contact --item "{\"contact_id\":{\"N\":\"0015\"},\"name\":{\"S\":\"Liam Smith\"}, \"email\":{\"S\":\"liam.smith@example.ca\"}, \"phone\":{\"S\":\"1234567890\"}}"

echo "Setup Complete!"