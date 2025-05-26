'use client';
import React, { useState } from 'react';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { addMocksToSchema } from '@graphql-tools/mock';
import { graphql } from 'graphql';
import { CopyBlock, dracula } from 'react-code-blocks';
import MonacoEditor from '@monaco-editor/react';
import 'tailwindcss/tailwind.css';
import Innavbar from '@/components/Innavbar';

const Playground = () => {
  const [schema, setSchema] = useState(`type User {
  id: ID!
  name: String!
  email: String!
  age: Int
  posts: [Post!]!
  isActive: Boolean!
  profile: Profile
}

type Profile {
  bio: String
  website: String
  location: String
  avatarUrl: String
}

type Post {
  id: ID!
  title: String!
  content: String
  published: Boolean!
  author: User!
  tags: [String!]!
  likes: Int
  createdAt: String
}

type Query {
  user(id: ID!): User
  users(active: Boolean): [User!]!
  post(id: ID!): Post
  posts(tag: String): [Post!]!
  searchUsers(name: String!): [User!]!
  recentPosts(limit: Int): [Post!]!
}`);
  const [query, setQuery] = useState(`{
  user(id: "1") {
    id
    name
    email
    isActive
    profile {
      bio
      website
      location
    }
    posts {
      id
      title
      published
      tags
      likes
      createdAt
    }
  }
  users(active: true) {
    id
    name
    email
    isActive
  }
  recentPosts(limit: 2) {
    id
    title
    author {
      name
      email
    }
    tags
    createdAt
  }
}`);
  const [variables, setVariables] = useState(`{}`);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const executableSchema = makeExecutableSchema({ typeDefs: schema });
      const mockedSchema = addMocksToSchema({ schema: executableSchema });
      const parsedVariables = JSON.parse(variables || '{}');

      const executionResult = await graphql({
        schema: mockedSchema,
        source: query,
        variableValues: parsedVariables,
      });

      setResult(executionResult);
    } catch (error) {
      setResult({ errors: [error.message] });
    } finally {
      setLoading(false);
    }
  };

  const handleClearResult = () => setResult(null);

  return (
    <div>
      <Innavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
        <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">GraphQL Playground</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Schema Editor */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <label htmlFor="schema-editor" className="text-2xl font-semibold text-gray-800 mb-4 block">
              GraphQL Schema (SDL)
            </label>
            <MonacoEditor
              id="schema-editor"
              height="250px"
              defaultLanguage="graphql"
              value={schema}
              onChange={(value) => setSchema(value || '')}
              theme="vs-dark"
              options={{ minimap: { enabled: false } }}
              aria-label="GraphQL Schema Editor"
            />
          </div>

          {/* Query Editor */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <label htmlFor="query-editor" className="text-2xl font-semibold text-gray-800 mb-4 block">
              GraphQL Query
            </label>
            <MonacoEditor
              id="query-editor"
              height="250px"
              defaultLanguage="graphql"
              value={query}
              onChange={(value) => setQuery(value || '')}
              theme="vs-dark"
              options={{ minimap: { enabled: false } }}
              aria-label="GraphQL Query Editor"
            />
          </div>
        </div>

        {/* Submit & Clear Buttons */}
        <div className="text-center mt-8 flex flex-col items-center gap-2">
          <button
            onClick={handleSubmit}
            className={`px-8 py-4 rounded-md text-white font-bold text-lg ${
              loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Executing...' : 'Execute'}
          </button>
          <button
            onClick={handleClearResult}
            className="mt-2 px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm"
            disabled={loading || !result}
          >
            Clear Result
          </button>
        </div>

        {/* Result Viewer */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Result</h2>
          <div className="bg-gray-100 text-gray-800 p-6 rounded-lg shadow-lg">
            {result ? (
              result.errors ? (
                <div>
                  <div className="text-red-600 font-bold mb-2">Error:</div>
                  <CopyBlock
                    text={JSON.stringify(result, null, 2)}
                    language="json"
                    showLineNumbers={false}
                    theme={dracula}
                  />
                </div>
              ) : (
                <CopyBlock
                  text={JSON.stringify(result, null, 2)}
                  language="json"
                  showLineNumbers={false}
                  theme={dracula}
                />
              )
            ) : (
              <p className="text-gray-600">No result yet. Submit a query to see the result.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          Powered by <a href="https://the-guild.dev/graphql/tools" className="underline hover:text-blue-600" target="_blank" rel="noopener noreferrer">@graphql-tools</a> &bull; Mocked data only
        </footer>
      </div>
    </div>
  );
};

export default Playground;
