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
    src: "/images/schemagen.png",
    alt: "Schema Example",
    caption: "Sample GraphQL schema structure"
  },
  {
    src: "/images/query.png",
    alt: "Query Builder Form",
    caption: "Visual query builder form in action"
  },
  {
    src: "/images/schema.png",
    alt: "server code Example",
    caption: "server code "
  },
  {
    src: "/images/dashbord.png",
    alt: "Dashboard Example",
    caption: "Dashboard view"
  },
  {
    src: "/images/create.png",
    alt: "Dashboard",
    caption: "Dashboard"
  }
];

const Examples = () => {
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

        <main className="container mx-auto px-4 pt-24 pb-16">
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Example Schemas & Queries
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Explore basic GraphQL schemas, queries, and mutations. See screenshots of the builder and schema editor in action.
            </p>
          </div>

          {/* Code Examples Section */}
          <section className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="group relative p-6 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-violet-500/50 transition-all duration-300">
              <h2 className="text-xl font-semibold text-white mb-4">Example Schema</h2>
              <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                <CopyBlock
                  text={exampleSchema.trim()}
                  language="graphql"
                  theme={dracula}
                  wrapLines
                  codeBlock
                />
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-violet-500/50 transition-all duration-300">
              <h2 className="text-xl font-semibold text-white mb-4">Example Query</h2>
              <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                <CopyBlock
                  text={exampleQuery.trim()}
                  language="graphql"
                  theme={dracula}
                  wrapLines
                  codeBlock
                />
              </div>
            </div>

            <div className="group relative p-6 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-violet-500/50 transition-all duration-300">
              <h2 className="text-xl font-semibold text-white mb-4">Example Mutation</h2>
              <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                <CopyBlock
                  text={exampleMutation.trim()}
                  language="graphql"
                  theme={dracula}
                  wrapLines
                  codeBlock
                />
              </div>
            </div>
          </section>

          {/* Screenshots Section */}
          <section className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                Builder in Action
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {exampleImages.map((img, idx) => (
                <div 
                  key={idx} 
                  className="group relative p-4 rounded-xl bg-gradient-to-b from-gray-900 to-black border border-gray-800 hover:border-violet-500/50 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-auto rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium">
                        {img.caption}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Examples;