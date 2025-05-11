'use client'

import { useState } from 'react'

export default function GraphQLCodeGenerator() {
  const [customTypes, setCustomTypes] = useState([])
  const [newTypeName, setNewTypeName] = useState('')
  const [fieldName, setFieldName] = useState('')
  const [fieldType, setFieldType] = useState('')
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(null)
  const [queries, setQueries] = useState(`users: [User]
user(id: ID!): User
posts: [Post]
post(id: ID!): Post`)

  const [mutations, setMutations] = useState(`addUser(name: String!, email: String!): User
addPost(title: String!, content: String!, authorId: ID!): Post`)

  const [tab, setTab] = useState('editor')

  const handleAddType = () => {
    if (newTypeName.trim() !== '') {
      const newType = { name: newTypeName, fields: [] }
      setCustomTypes([...customTypes, newType])
      setNewTypeName('')
    }
  }

  const handleAddField = () => {
    if (selectedTypeIndex !== null && fieldName && fieldType) {
      const updatedTypes = [...customTypes]
      updatedTypes[selectedTypeIndex].fields.push({ name: fieldName, type: fieldType })
      setCustomTypes(updatedTypes)
      setFieldName('')
      setFieldType('')
    }
  }

  // Dynamically generate queries, mutations, and typeDefs
  const generateTypeDefs = () => {
    return customTypes.map(type => {
      const fields = type.fields.map(f => `  ${f.name}: ${f.type}`).join('\n')
      return `type ${type.name} {\n${fields}\n}`
    }).join('\n\n')
  }

  const generateQueries = () => {
    return customTypes.map(type => {
      const query = `get${type.name}(id: ID!): ${type.name}`
      return query
    }).join('\n')
  }

  const generateMutations = () => {
    return customTypes.map(type => {
      const mutation = `create${type.name}(input: ${type.name}Input!): ${type.name}`
      return mutation
    }).join('\n')
  }

  const generateCode = () => {
    const typeDefs = generateTypeDefs()
    const generatedQueries = generateQueries()
    const generatedMutations = generateMutations()

    return `const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');

const app = express();
app.use(cors());

const typeDefs = gql\`
  type Query {
    ${generatedQueries}
    ${queries}
  }

  type Mutation {
    ${generatedMutations}
    ${mutations}
  }

  ${typeDefs}
\`;

const users = [
  { id: '1', name: 'Alice', email: 'alice@example.com' },
  { id: '2', name: 'Bob', email: 'bob@example.com' }
];

const posts = [
  { id: '101', title: 'First Post', content: 'Hello world!', authorId: '1' }
];

const resolvers = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find(user => user.id === id),
    posts: () => posts.map(post => ({ ...post, author: users.find(u => u.id === post.authorId) })),
    post: (_, { id }) => {
      const post = posts.find(p => p.id === id);
      return post ? { ...post, author: users.find(u => u.id === post.authorId) } : null;
    },
    ${generateQueries()}
  },
  Mutation: {
    addUser: (_, { name, email }) => {
      const newUser = { id: String(users.length + 1), name, email };
      users.push(newUser);
      return newUser;
    },
    addPost: (_, { title, content, authorId }) => {
      const author = users.find(u => u.id === authorId);
      if (!author) throw new Error('Author not found');
      const newPost = { id: String(posts.length + 101), title, content, authorId };
      posts.push(newPost);
      return { ...newPost, author };
    },
    ${generateMutations()}
  },
  User: {
    posts: (user) => posts.filter(post => post.authorId === user.id)
  },
  Post: {
    author: (post) => users.find(user => user.id === post.authorId)
  },
  ${customTypes.map(type => `
  ${type.name}: {
    ${type.fields.map(field => `
      ${field.name}: (parent) => parent.${field.name}
    `).join('')}
  }
  `).join('')}
};

const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(\`Server is running at http://localhost:\${PORT}\${server.graphqlPath}\`);
  });
}

startServer();`
  }

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">GraphQL Server Code Generator</h1>

      <div className="flex space-x-4 border-b mb-4">
        <button
          onClick={() => setTab('editor')}
          className={`py-2 px-4 border-b-2 ${tab === 'editor' ? 'border-blue-500 font-bold' : 'border-transparent'}`}
        >
          Editor
        </button>
        <button
          onClick={() => setTab('preview')}
          className={`py-2 px-4 border-b-2 ${tab === 'preview' ? 'border-blue-500 font-bold' : 'border-transparent'}`}
        >
          Preview
        </button>
      </div>

      {tab === 'editor' && (
        <div className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">Queries</label>
            <textarea
              value={queries}
              onChange={(e) => setQueries(e.target.value)}
              rows={4}
              className="w-full border rounded p-2 font-mono bg-white text-black"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Mutations</label>
            <textarea
              value={mutations}
              onChange={(e) => setMutations(e.target.value)}
              rows={4}
              className="w-full border rounded p-2 font-mono bg-white text-black"
            />
          </div>

          <div className="border-t pt-4">
            <h2 className="text-xl font-bold mb-4">Create Custom Types</h2>

            <div className="flex items-center space-x-2 mb-4">
              <input
                placeholder="New type name"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                className="border p-2 rounded-lg bg-white text-black w-64"
              />
              <button
                onClick={handleAddType}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Add Type
              </button>
            </div>

            {customTypes.length > 0 ? (
              customTypes.map((type, index) => (
                <div key={index} className="border p-4 rounded-lg mb-6 bg-gray-50">
                  <h3 className="text-lg font-semibold mb-2">{type.name}</h3>
                  {type.fields.length > 0 ? (
                    <div className="ml-4 space-y-2 text-sm">
                      {type.fields.map((field, i) => (
                        <div key={i} className="text-gray-700">
                          {field.name}: {field.type}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500">No fields added yet</div>
                  )}
                  {selectedTypeIndex === index && (
                    <div className="mt-4 space-x-2">
                      <input
                        placeholder="Field name"
                        value={fieldName}
                        onChange={(e) => setFieldName(e.target.value)}
                        className="border p-2 rounded-lg bg-white text-black w-64"
                      />
                      <input
                        placeholder="Field type"
                        value={fieldType}
                        onChange={(e) => setFieldType(e.target.value)}
                        className="border p-2 rounded-lg bg-white text-black w-64"
                      />
                      <button
                        onClick={handleAddField}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                      >
                        Add Field
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => setSelectedTypeIndex(index)}
                    className="mt-4 text-blue-500 hover:underline text-sm"
                  >
                    {selectedTypeIndex === index ? 'Adding fields...' : 'Add fields'}
                  </button>
                </div>
              ))
            ) : (
              <div className="text-gray-500">No custom types added yet</div>
            )}
          </div>
        </div>
      )}

      {tab === 'preview' && (
        <div className="relative bg-black text-white font-mono text-sm p-4 rounded-lg overflow-x-auto max-h-[600px]">
          <pre>{generateCode()}</pre>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 bg-white text-black px-3 py-1 rounded text-sm hover:bg-gray-200"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </div>
  )
}
