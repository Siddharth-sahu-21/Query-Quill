"use client";

import { useState } from "react";
import axios from "axios";


  

export default function GraphQLPlayground() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    try {
        const res = await axios.post("http://localhost:4000/graphql", {
            query,
          });
      setResponse(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 ">
      <h2 className="text-2xl font-bold mb-4">GraphQL Playground</h2>
      <textarea
        className="w-full h-40 p-2 border rounded-md mb-4 text-black"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Write your GraphQL query here..."
      ></textarea>
      <button
        onClick={handleExecute}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Run Query
      </button>

      {loading && <p className="mt-4 text-yellow-600">Running...</p>}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}
      {response && (
        <pre className="mt-4 bg-gray-100 p-4 rounded text-sm overflow-x-auto text-black">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}
