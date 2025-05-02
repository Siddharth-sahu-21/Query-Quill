const { makeExecutableSchema } = require('@graphql-tools/schema');
const { addMocksToSchema } = require('@graphql-tools/mock');
const { gql } = require('graphql-tag');
const mockedSchema = require('./mockSchema');

// Define the GraphQL schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    getallNew(name: String!): [User]
  }

  type Mutation {
    createUser(name: String!): User
  }
`;

// Create the executable schema
const schema = makeExecutableSchema({ typeDefs });

// Add mocks to the schema
addMocksToSchema({
  schema,
  mocks: {
    ID: () => '1',
    String: () => 'Mocked String',
  },
});

// Export the mocked schema
module.exports = mockedSchema;