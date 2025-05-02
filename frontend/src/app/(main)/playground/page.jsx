'use client';

import React, { useState } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import axios from 'axios';

const Playground = () => {
  const [endpoint, setEndpoint] = useState('http://localhost:5001/graphql'); // GraphQL endpoint
  const [query, setQuery] = useState(''); // GraphQL query input
  const [variables, setVariables] = useState('{}'); // Variables input
  const [response, setResponse] = useState(''); // Response output
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state
  const [history, setHistory] = useState([]); // Query history

  const handleRunQuery = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await axios.post(
        endpoint,
        {
          query,
          variables: JSON.parse(variables || '{}'),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setResponse(JSON.stringify(result.data, null, 2));
      setHistory((prev) => [...prev, { query, variables }]); // Save to history
    } catch (error) {
      setError(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-6">
          GraphQL Playground
        </h1>

        {/* Endpoint Input */}
        <div className="mb-4">
          <label htmlFor="endpoint" className="block text-sm font-medium text-gray-300 mb-2">
            GraphQL Endpoint
          </label>
          <input
            id="endpoint"
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter your GraphQL endpoint"
          />
        </div>

        {/* Query Input */}
        <div className="mb-4">
          <label htmlFor="query" className="block text-sm font-medium text-gray-300 mb-2">
            Query
          </label>
          <textarea
            id="query"
            rows="6"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Write your GraphQL query here..."
          />
        </div>

        {/* Variables Input */}
        <div className="mb-4">
          <label htmlFor="variables" className="block text-sm font-medium text-gray-300 mb-2">
            Variables (JSON format)
          </label>
          <textarea
            id="variables"
            rows="4"
            value={variables}
            onChange={(e) => setVariables(e.target.value)}
            className="w-full p-3 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder='{"key": "value"}'
          />
        </div>

        {/* Run Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleRunQuery}
            disabled={loading}
            className={`px-6 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Running...' : 'Run Query'}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-500">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Response Output */}
        <div>
          <label htmlFor="response" className="block text-sm font-medium text-gray-300 mb-2">
            Response
          </label>
          <div className="bg-gray-700 rounded-md p-4 border border-gray-600">
            <CopyBlock
              text={response || '// Response will appear here...'}
              language="json"
              showLineNumbers={true}
              theme={dracula}
              wrapLines
            />
          </div>
        </div>

        {/* Query History */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-300 mb-2">Query History</h2>
          <ul className="bg-gray-700 rounded-md p-4 border border-gray-600">
            {history.map((item, index) => (
              <li key={index} className="mb-2">
                <pre className="text-sm text-gray-300">
                  Query: {item.query}
                  <br />
                  Variables: {item.variables}
                </pre>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default Playground;