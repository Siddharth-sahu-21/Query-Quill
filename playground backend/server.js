const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const cors = require("cors");

// Sample type definitions & resolvers
const typeDefs = gql`
  type Student {
    name: String
    rollNo: Int
    parentMobileNo: String
  }

  type Query {
    student(id: Int!): Student
  }
`;

const resolvers = {
  Query: {
    student: (_, args) => {
      // Mock response
      return {
        name: "John Doe",
        rollNo: args.id,
        parentMobileNo: "9876543210",
      };
    },
  },
};

async function startServer() {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("🚀 Server ready at http://localhost:4000/graphql");
  });
}

startServer();
