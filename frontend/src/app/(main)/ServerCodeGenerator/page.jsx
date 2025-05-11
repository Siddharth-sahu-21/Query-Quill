'use client';

import React, { useState } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import { FaMinus } from 'react-icons/fa';

export default function GraphQLBuilder() {
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

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
      <div className="mb-6 flex gap-4 border-b">
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'schema' ? 'border-b-4 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('schema')}
        >
          Schema Builder
        </button>
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'server' ? 'border-b-4 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('server')}
        >
          Server Code
        </button>
      </div>

      {activeTab === 'schema' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {types.map((type, typeIndex) => (
              <div key={typeIndex} className="bg-white p-4 rounded-lg shadow border">
                <input
                  type="text"
                  value={type.name}
                  placeholder="Type Name"
                  onChange={(e) => updateTypeName(typeIndex, e.target.value)}
                  className="mb-3 w-full p-2 border rounded text-black"
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
            ))}

            <button
              onClick={addType}
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              + Add Type
            </button>
          </div>

          <div className="bg-white p-4 rounded-lg shadow border">
            <h3 className="text-lg font-semibold mb-2">Generated Schema</h3>
            <div className="overflow-auto max-h-[400px] rounded-md">
              <CopyBlock
                text={generateSchema()}
                language="graphql"
                showLineNumbers
                wrapLines
                theme={dracula}
              />
            </div>
            <button
              onClick={() => downloadFile('schema.graphql', generateSchema())}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md"
            >
              Download Schema
            </button>
          </div>
        </div>
      )}

      {activeTab === 'server' && (
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-lg font-semibold mb-4">Server Code</h3>
          <div className="overflow-auto max-h-[600px]">
            <CopyBlock
              text={generateServerCode()}
              language="javascript"
              showLineNumbers
              wrapLines
              theme={dracula}
            />
          </div>
          <button
            onClick={() => downloadFile('server.js', generateServerCode())}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md"
          >
            Download Server Code
          </button>
        </div>
      )}
    </div>
  );
}
