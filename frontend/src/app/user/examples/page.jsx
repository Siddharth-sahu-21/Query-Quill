'use client';
import React from 'react';
import Innavbar from '@/components/Innavbar';
import { CopyBlock, dracula } from 'react-code-blocks';
import Footer from '@/components/Footer';

const exampleSchema = `
type User {
  id: ID!
  name: String!
  email: String!
  age: Int
  isActive: Boolean!
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User!
}

type Query {
  user(id: ID!): User
  users: [User!]!
  post(id: ID!): Post
  posts: [Post!]!
}
`;

const exampleQuery = `
query GeneratedQuery($id: ID!) {
  user(id: $id) {
    id
    name
    email
    isActive
    posts {
      id
      title
    }
  }
}
`;

const exampleMutation = `
mutation GeneratedMutation($name: String!, $email: String!, $age: Int) {
  createUser(
    name: $name
    email: $email
    age: $age
  ) {
    id
    name
    email
    age
  }
}
`;

const exampleImages = [
  {
    src: "/images/mutation.png",
    alt: "Schema Example",
    caption: "Sample GraphQL schema structure"
  },
  {
    src: "/images/quer.png",
    alt: "Query Builder Form",
    caption: "Visual query builder form in action"
  },
  {
    src: "/images/mutaton.png",
    alt: "Mutation Example",
    caption: "Mutation example in builder"
  },
  {
    src: "/images/dashbord.png",
    alt: "Dashboard Example",
    caption: "Dashboard view"
  },
  {
    src: "/images/schema.png",
    alt: "Schema Editor",
    caption: "Schema editor in action"
  }
];

const Examples = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <Innavbar />

      <main className="flex-grow container mx-auto px-6 py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-yellow-500">
            GraphQL Example Schemas & Queries
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
            Explore basic GraphQL schemas, queries, and mutations. See screenshots of the builder and schema editor in action.
          </p>
        </header>

        {/* Flex row for schema, query, mutation */}
        <section className="flex flex-col md:flex-row gap-8 mb-12 justify-center items-stretch">
          <div className="flex-1 min-w-[280px] max-w-md bg-gray-800 bg-opacity-70 p-4 rounded-xl shadow-md mb-6 md:mb-0">
            <h2 className="text-xl font-semibold text-white mb-3 border-b border-gray-600 pb-1">Example Schema</h2>
            <CopyBlock
              text={exampleSchema.trim()}
              language="graphql"
              theme={dracula}
              wrapLines
              codeBlock
            />
          </div>
          <div className="flex-1 min-w-[280px] max-w-md bg-gray-800 bg-opacity-70 p-4 rounded-xl shadow-md mb-6 md:mb-0">
            <h2 className="text-xl font-semibold text-white mb-3 border-b border-gray-600 pb-1">Example Query</h2>
            <CopyBlock
              text={exampleQuery.trim()}
              language="graphql"
              theme={dracula}
              wrapLines
              codeBlock
            />
          </div>
          <div className="flex-1 min-w-[280px] max-w-md bg-gray-800 bg-opacity-70 p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-white mb-3 border-b border-gray-600 pb-1">Example Mutation</h2>
            <CopyBlock
              text={exampleMutation.trim()}
              language="graphql"
              theme={dracula}
              wrapLines
              codeBlock
            />
          </div>
        </section>

        {/* Images Section */}
        <section className="bg-gray-800 bg-opacity-50 p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-white mb-4 border-b border-gray-600 pb-2">Screenshots & Examples</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {exampleImages.map((img, idx) => (
              <div key={idx} className="bg-gray-900 rounded-lg shadow p-4 flex flex-col items-center">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="rounded border border-blue-900 mb-2 max-h-64 object-contain"
                />
                <span className="text-gray-200 text-sm">{img.caption}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
};

export default Examples;