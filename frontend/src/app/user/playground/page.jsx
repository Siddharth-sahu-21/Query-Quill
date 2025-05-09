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

  return (
    <div>
      <Innavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
        <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">GraphQL Playground</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Schema Editor */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">GraphQL Schema (SDL)</h2>
            <MonacoEditor
              height="250px"
              defaultLanguage="graphql"
              value={schema}
              onChange={(value) => setSchema(value || '')}
              theme="vs-dark"
              options={{ minimap: { enabled: false } }}
            />
          </div>

          {/* Query Editor */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">GraphQL Query</h2>
            <MonacoEditor
              height="250px"
              defaultLanguage="graphql"
              value={query}
              onChange={(value) => setQuery(value || '')}
              theme="vs-dark"
              options={{ minimap: { enabled: false } }}
            />
          </div>

          {/* Variables Editor */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Query Variables (JSON)</h2>
            <MonacoEditor
              height="250px"
              defaultLanguage="json"
              value={variables}
              onChange={(value) => setVariables(value || '')}
              theme="vs-dark"
              options={{ minimap: { enabled: false } }}
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
    </div>
  );
};

export default Playground;
