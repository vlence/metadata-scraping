module.exports = {
  tables: [
    {
      TableName: `cache`,
      KeySchema: [{AttributeName: 'url', KeyType: 'HASH'}],
      AttributeDefinitions: [{AttributeName: 'url', AttributeType: 'S'}],
      ProvisionedThroughput: {ReadCapacityUnits: 25, WriteCapacityUnits: 25},
    },
    // etc
  ],
};