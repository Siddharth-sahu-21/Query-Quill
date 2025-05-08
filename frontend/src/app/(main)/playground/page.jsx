'use client';
import React, { useState } from 'react';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { addMocksToSchema } from '@graphql-tools/mock';
import { graphql } from 'graphql';
import { CopyBlock, dracula } from 'react-code-blocks';
import 'tailwindcss/tailwind.css';

const Playground = () => {
  const [schema, setSchema] = useState(`type User {
  id: ID!
  name: String!
}

type Query {
  user: User
}`);
  const [query, setQuery] = useState(`{
  user {
    id
    name
  }
}`);
  const [variables, setVariables] = useState(`{}`);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Create an executable schema from the provided SDL
      const executableSchema = makeExecutableSchema({ typeDefs: schema });

      // Add mocks to the schema
      const mockedSchema = addMocksToSchema({ schema: executableSchema });

      // Parse variables from JSON
      const parsedVariables = JSON.parse(variables || '{}');

      // Execute the query against the mocked schema
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
      <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">GraphQL Playground</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Schema Editor */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">GraphQL Schema (SDL)</h2>
          <textarea
            className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
          />
        </div>

        {/* Query Editor */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">GraphQL Query</h2>
          <textarea
            className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Variables Editor */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Query Variables (JSON)</h2>
          <textarea
            className="w-full h-64 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            value={variables}
            onChange={(e) => setVariables(e.target.value)}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleSubmit}
          className={`px-8 py-4 rounded-md text-white font-bold text-lg ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Executing...' : 'Execute'}
        </button>
      </div>

      {/* Result Viewer */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Result</h2>
        <div className="bg-gray-100 text-gray-800 p-6 rounded-lg shadow-lg">
          {result ? (
            <CopyBlock
              text={JSON.stringify(result, null, 2)}
              language="json"
              showLineNumbers={false}
              theme={dracula}
            />
          ) : (
            <p className="text-gray-600">No result yet. Submit a query to see the result.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playground;