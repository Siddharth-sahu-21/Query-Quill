const express = require('express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { addMocksToSchema } = require('@graphql-tools/mock');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// Define the GraphQL schema
const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Query {
    getallNew: [User!]!
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
  }
`;

// Create the schema
const schema = makeExecutableSchema({ typeDefs });

// Add mocks to the schema
const mockedSchema = addMocksToSchema({
  schema,
  mocks: {
    Int: () => Math.floor(Math.random() * 100), // Mock age as a random number
    String: () => 'Mocked String', // Default mock for strings
  },
});

// Mount the mock GraphQL API on `/mock-graphql`
app.use(
  '/mock-graphql',
  graphqlHTTP({
    schema: mockedSchema,
    graphiql: true, // Enable GraphiQL playground
  })
);

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Mock GraphQL server is running at http://localhost:${PORT}/mock-graphql`);
});