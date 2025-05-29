'use client';
import React, { useState } from 'react';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { addMocksToSchema } from '@graphql-tools/mock';
import { graphql } from 'graphql';
import { CopyBlock, dracula } from 'react-code-blocks';
import MonacoEditor from '@monaco-editor/react';
import 'tailwindcss/tailwind.css';
import Innavbar from '@/components/Innavbar';
import Footer from '@/components/footer';

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
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Vector Lines */}
        <div className="absolute inset-0">
          <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path className="animate-draw-1" d="M0,30 Q25,5 50,30 T100,30" stroke="url(#gradient)" strokeWidth="0.1" fill="none"/>
            <path className="animate-draw-2" d="M0,50 Q25,25 50,50 T100,50" stroke="url(#gradient)" strokeWidth="0.1" fill="none"/>
            <path className="animate-draw-3" d="M0,70 Q25,45 50,70 T100,70" stroke="url(#gradient)" strokeWidth="0.1" fill="none"/>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7C3AED"/>
                <stop offset="100%" stopColor="#DB2777"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
        
        {/* Gradient Circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl animate-float-delay"></div>
      </div>

      <div className="relative z-10">
        <Innavbar />
        <div className="container mx-auto px-4 pt-24 pb-16">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                GraphQL Playground
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Test your GraphQL schemas and queries with mock data
            </p>
          </div>

          {/* Editor Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Schema Editor */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-pink-600/50 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
              <div className="relative p-6 bg-gray-900 rounded-xl border border-gray-800/50 transition-all duration-500 group-hover:border-transparent">
                <h2 className="text-xl font-semibold text-white mb-4">GraphQL Schema (SDL)</h2>
                <div className="overflow-hidden rounded-lg border border-gray-800">
                  <MonacoEditor
                    height="300px"
                    defaultLanguage="graphql"
                    value={schema}
                    onChange={(value) => setSchema(value || '')}
                    theme="vs-dark"
                    options={{ 
                      minimap: { enabled: false },
                      fontSize: 14,
                      padding: { top: 16 }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Query Editor */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-pink-600/50 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
              <div className="relative p-6 bg-gray-900 rounded-xl border border-gray-800/50 transition-all duration-500 group-hover:border-transparent">
                <h2 className="text-xl font-semibold text-white mb-4">GraphQL Query</h2>
                <div className="overflow-hidden rounded-lg border border-gray-800">
                  <MonacoEditor
                    height="300px"
                    defaultLanguage="graphql"
                    value={query}
                    onChange={(value) => setQuery(value || '')}
                    theme="vs-dark"
                    options={{ 
                      minimap: { enabled: false },
                      fontSize: 14,
                      padding: { top: 16 }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="group relative px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Executing...' : 'Execute Query'}
              <div className="absolute inset-0 -translate-y-full group-hover:translate-y-0 bg-gradient-to-b from-white/20 to-transparent transition-transform duration-300"></div>
            </button>
            <button
              onClick={handleClearResult}
              disabled={loading || !result}
              className="px-6 py-3 text-gray-400 hover:text-white border border-gray-800 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear Result
            </button>
          </div>

          {/* Result Section */}
          {(result || loading) && (
            <div className="group relative max-w-4xl mx-auto">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative p-6 bg-gray-900 rounded-xl">
                <h2 className="text-xl font-semibold text-white mb-4">Result</h2>
                <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800">
                  {loading ? (
                    <div className="p-8 text-center text-gray-400">
                      <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                      Processing query...
                    </div>
                  ) : result ? (
                    <CopyBlock
                      text={JSON.stringify(result, null, 2)}
                      language="json"
                      showLineNumbers={false}
                      theme={dracula}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Playground;
