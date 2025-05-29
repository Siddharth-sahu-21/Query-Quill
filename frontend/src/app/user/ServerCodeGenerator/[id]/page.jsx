'use client';

import React, { useState, useEffect } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import { FaMinus } from 'react-icons/fa';
import axios from 'axios';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Footer from '@/components/footer';

const API_BASE = 'http://localhost:5000/project'; // Adjust as needed

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return { 'x-auth-token': token }; // Change from Authorization: Bearer to x-auth-token
}

export default function GraphQLBuilder() {
  const params = useParams();
  const projectId = params.id;
  const [projectTitle, setProjectTitle] = useState(''); // Add this state

  const [types, setTypes] = useState([
    {
      name: 'User',
      fields: [
        { name: 'id', type: 'ID', required: true, isArray: false, isIdField: true },
        { name: 'name', type: 'String', required: true, isArray: false },
      ],
    },
  ]);
  const [activeTab, setActiveTab] = useState('schema');
  const [loading, setLoading] = useState(false);

  // Fetch saved schema and server code on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE}/${projectId}/servercode`,
          { headers: getAuthHeaders() }
        );
        if (res.data && res.data.types) {
          setTypes(res.data.types);
        }
      } catch (err) {
        // It's ok if not found (new project)
      } finally {
        setLoading(false);
      }
    };
    if (projectId) fetchData();
    // eslint-disable-next-line
  }, [projectId]);

  // Add this useEffect for fetching project title
  useEffect(() => {
    const fetchProjectTitle = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}`,
          { headers: getAuthHeaders() }
        );
        setProjectTitle(res.data.title);
      } catch (err) {
        console.error('Failed to fetch project title:', err);
        toast.error('Failed to load project details');
      }
    };
    
    if (projectId) fetchProjectTitle();
  }, [projectId]);

  const addType = () => {
    setTypes([...types, { name: '', fields: [{ name: '', type: 'String', required: false, isArray: false }] }]);
  };

  const removeType = (index) => {
    const newTypes = [...types];
    newTypes.splice(index, 1);
    setTypes(newTypes);
  };

  const updateTypeName = (index, name) => {
    const newTypes = [...types];
    newTypes[index].name = name.charAt(0).toUpperCase() + name.slice(1);
    setTypes(newTypes);
  };

  const addField = (typeIndex) => {
    const newTypes = [...types];
    newTypes[typeIndex].fields.push({ name: '', type: 'String', required: false, isArray: false });
    setTypes(newTypes);
  };

  const removeField = (typeIndex, fieldIndex) => {
    if (types[typeIndex].fields[fieldIndex].isIdField) return;
    const newTypes = [...types];
    newTypes[typeIndex].fields.splice(fieldIndex, 1);
    setTypes(newTypes);
  };

  const updateField = (typeIndex, fieldIndex, key, value) => {
    const newTypes = [...types];
    const field = newTypes[typeIndex].fields[fieldIndex];
    field[key] = value;

    // Auto-pluralize if 'isArray' is toggled
    if (key === 'isArray' && value && field.name) {
      field.type = field.name.charAt(0).toUpperCase() + field.name.slice(1) + 's';
    }

    setTypes(newTypes);
  };

  const generateSchema = () => {
    const typeDefs = types
      .map(t => {
        const fields = t.fields
          .map(f => {
            let type = f.isArray ? `[${f.type}]` : f.type;
            return `  ${f.name}: ${type}${f.required ? '!' : ''}`;
          }).join('\n');
        return `type ${t.name} {\n${fields}\n}`;
      }).join('\n\n');

    const queries = types.map(t => `  get${t.name}(id: ID!): ${t.name}`).join('\n');

    const mutations = types.map(t => {
      const args = t.fields.filter(f => !f.isIdField).map(f => {
        const type = f.isArray ? `[${f.type}]` : f.type;
        return `${f.name}: ${type}${f.required ? '!' : ''}`;
      }).join(', ');

      return [
        `  create${t.name}(${args}): ${t.name}`,
        `  update${t.name}(id: ID!, ${args}): ${t.name}`,
        `  delete${t.name}(id: ID!): Boolean`,
      ].join('\n');
    }).join('\n');

    return `${typeDefs}\n\ntype Query {\n${queries}\n}\n\ntype Mutation {\n${mutations}\n}`;
  };

  const generateServerCode = () => {
    return `const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');

const app = express();
app.use(cors());

const typeDefs = gql\`
${generateSchema()}\`
;

const resolvers = {
  Query: {
    ${types.map(t => {
      return `get${t.name}: (_, { id }) => {
        // Logic to get ${t.name} by id
        return { id }; // Simulating response, you can adjust this to fetch real data
      }` ;
    }).join(',\n    ')}
  },
  Mutation: {
    ${types.map(t => {
      const args = t.fields.filter(f => !f.isIdField).map(f => {
        const type = f.isArray ? `[${f.type}]` : f.type;
        return `${f.name}: ${type}${f.required ? '!' : ''}`;
      }).join(', ');

      return `create${t.name}: (_, { ${args} }) => {
        // Logic to create ${t.name}
        return { ${args} }; // Simulating response, you can adjust this to handle creation logic
      },
      update${t.name}: (_, { id, ${args} }) => {
        // Logic to update ${t.name}
        return { id, ${args} }; // Simulating response, you can adjust this to handle update logic
      },
      delete${t.name}: (_, { id }) => {
        // Logic to delete ${t.name} by id
        return true; // Simulating successful deletion, adjust as needed
      }`;
    }).join(',\n    ')}
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

async function start() {
  await server.start();
  server.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log('Server running at http://localhost:4000' + server.graphqlPath);
  });
}

start();`;
  };

  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // Save schema and server code to backend
  const saveServerCode = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${API_BASE}/${projectId}/servercode`,
        {
          types,
          schema: generateSchema(),
          serverCode: generateServerCode(),
        },
        { headers: getAuthHeaders() }
      );
      toast.success('Server code and schema saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save server code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <main className="container mx-auto px-4 pt-16 pb-16">
          {/* Project Title Section */}
          <div className="text-center max-w-3xl mx-auto mb-8">
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-3xl font-medium text-gray-400">
                Project Title:
                <span className="ml-2 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                  {projectTitle || 'Loading...'}
                </span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-full"></div>
              
            </div>
          </div>

          {/* Existing Tab Navigation */}
          <div className="mb-8 flex justify-center gap-4">
            <button
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'schema' 
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('schema')}
            >
              Schema Builder
            </button>
            <button
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'server' 
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('server')}
            >
              Server Code
            </button>
          </div>

          {activeTab === 'schema' && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {types.map((type, typeIndex) => (
                  <div key={typeIndex} className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-pink-600/50 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
                    <div className="relative p-6 bg-gray-900 rounded-xl border border-gray-800/50 transition-all duration-500 group-hover:border-transparent">
                      <input
                        type="text"
                        value={type.name}
                        placeholder="Type Name"
                        onChange={(e) => updateTypeName(typeIndex, e.target.value)}
                        className="mb-4 w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
                      />

                      {type.fields.map((field, fieldIndex) => (
                        <div key={fieldIndex} className="flex flex-wrap gap-2 items-center mb-2">
                          <input
                            type="text"
                            value={field.name}
                            placeholder="Field Name"
                            onChange={(e) => updateField(typeIndex, fieldIndex, 'name', e.target.value)}
                            className="p-2 border rounded text-black"
                          />
                          <select
                            value={field.type}
                            onChange={(e) => updateField(typeIndex, fieldIndex, 'type', e.target.value)}
                            className="p-2 border rounded text-black"
                          >
                            {['String', 'Int', 'Float', 'Boolean', 'ID', ...types.map(t => t.name)].map((t, i) => (
                              <option key={i} value={t}>{t}</option>
                            ))}
                          </select>
                          <label className="flex items-center gap-1 text-sm">
                            <input
                              type="checkbox"
                              checked={field.isArray}
                              onChange={(e) => updateField(typeIndex, fieldIndex, 'isArray', e.target.checked)}
                            /> List
                          </label>
                          <label className="flex items-center gap-1 text-sm">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(typeIndex, fieldIndex, 'required', e.target.checked)}
                            /> Required
                          </label>
                          <button
                            disabled={field.isIdField}
                            onClick={() => removeField(typeIndex, fieldIndex)}
                            className={`p-2 text-white rounded ${field.isIdField ? 'bg-gray-300' : 'bg-red-500 hover:bg-red-600'}`}
                          >
                            <FaMinus />
                          </button>
                        </div>
                      ))}

                      <button
                        onClick={() => addField(typeIndex)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        + Add Field
                      </button>

                      {types.length > 1 && (
                        <button
                          onClick={() => removeType(typeIndex)}
                          className="ml-3 bg-red-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Delete Type
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  onClick={addType}
                  className="w-full p-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300"
                >
                  + Add New Type
                </button>
              </div>

              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-pink-600/50 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
                <div className="relative p-6 bg-gray-900 rounded-xl border border-gray-800/50 transition-all duration-500 group-hover:border-transparent">
                  <h3 className="text-xl font-semibold text-white mb-4">Generated Schema</h3>
                  <div className="overflow-auto max-h-[400px] rounded-lg border border-gray-800">
                    <CopyBlock
                      text={generateSchema()}
                      language="graphql"
                      showLineNumbers
                      wrapLines
                      theme={dracula}
                    />
                  </div>
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => downloadFile('schema.graphql', generateSchema())}
                      className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300"
                    >
                      Download Schema
                    </button>
                    <button
                      onClick={saveServerCode}
                      disabled={loading}
                      className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-pink-500/25 disabled:opacity-50 transition-all duration-300"
                    >
                      {loading ? 'Saving...' : 'Save All'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'server' && (
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-pink-600/50 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
              <div className="relative p-6 bg-gray-900 rounded-xl border border-gray-800/50 transition-all duration-500 group-hover:border-transparent">
                <h3 className="text-xl font-semibold text-white mb-4">Server Code</h3>
                <div className="overflow-auto max-h-[600px] rounded-lg border border-gray-800">
                  <CopyBlock
                    text={generateServerCode()}
                    language="javascript"
                    showLineNumbers
                    wrapLines
                    theme={dracula}
                  />
                </div>
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => downloadFile('server.js', generateServerCode())}
                    className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300"
                  >
                    Download Server Code
                  </button>
                  <button
                    onClick={saveServerCode}
                    disabled={loading}
                    className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-pink-500/25 disabled:opacity-50 transition-all duration-300"
                  >
                    {loading ? 'Saving...' : 'Save All'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
