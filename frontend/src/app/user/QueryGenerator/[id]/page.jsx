'use client';
import { useState, useEffect } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import axios from 'axios';
import { useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

import Footer from '@/components/Footer'; 


const MAX_DEPTH = 5;
const DEFAULT_ARG_TYPES = [
  'String', 'String!', 'Int', 'Int!', 'Float', 'Float!', 'Boolean', 'Boolean!', 'ID', 'ID!',
  '[String]', '[Int]', '[Boolean]', '[ID]', 'CustomType'
];

const API_BASE = 'http://localhost:5000/project'; // Adjust if needed

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return { 'x-auth-token': token };
}

export default function QueryGenerator() {
  const params = useParams();
  const projectId = params.id;
  const [projectTitle, setProjectTitle] = useState('');

  const [queryType, setQueryType] = useState('query');
  const [operationName, setOperationName] = useState('');
  const [customOperationName, setCustomOperationName] = useState('GeneratedQuery');
  const [fields, setFields] = useState([{ name: '', subFields: [], depth: 0 }]);
  const [argumentsList, setArgumentsList] = useState([{ name: '', type: 'String' }]);
  const [loading, setLoading] = useState(false);

  // Fetch saved query and parameters on mount
  useEffect(() => {
    const fetchGeneratedQuery = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}/query`,
          { headers: getAuthHeaders() }
        );
        if (res.data) {
          setQueryType(res.data.parameters?.queryType || 'query');
          setOperationName(res.data.parameters?.operationName || '');
          setFields(res.data.parameters?.fields || [{ name: '', subFields: [], depth: 0 }]);
          setArgumentsList(res.data.parameters?.argumentsList || [{ name: '', type: 'String' }]);
        }
      } catch (err) {
        // It's ok if not found (new project)
      } finally {
        setLoading(false);
      }
    };
    if (projectId) fetchGeneratedQuery();
    // eslint-disable-next-line
  }, [projectId]);

  // Add this useEffect to fetch project title
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

  const updateArgument = (index, key, value) => {
    const updated = [...argumentsList];
    updated[index][key] = value;
    setArgumentsList(updated);
  };

  const updateFieldAtPath = (path, value) => {
    const newFields = JSON.parse(JSON.stringify(fields)); // deep clone
    let current = newFields;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]].subFields;
    }
    current[path[path.length - 1]].name = value;
    setFields(newFields);
  };

  const addSubFieldAtPath = (path) => {
    const newFields = JSON.parse(JSON.stringify(fields));
    let current = newFields;
    let depth = 0;
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]].subFields;
      depth++;
    }
    if (depth >= MAX_DEPTH) return alert('Max depth reached');
    current.push({ name: '', subFields: [], depth });
    setFields(newFields);
  };

  const addFieldAtSameLevel = (path) => {
    const newFields = JSON.parse(JSON.stringify(fields));
    let current = newFields;
    let depth = 0;
    for (let i = 0; i < path.length; i++) {
      current = current[path[i]].subFields;
      depth++;
    }
    if (depth >= MAX_DEPTH) return alert('Max depth reached');
    // Add a new field at the same level (same depth as current field)
    const parentPath = path.slice(0, path.length - 1); // Get the parent path
    let parent = newFields;
    for (let i = 0; i < parentPath.length; i++) {
      parent = parent[parentPath[i]].subFields;
    }
    parent.push({ name: '', subFields: [], depth });
    setFields(newFields);
  };

  const removeFieldAtPath = (path) => {
    const newFields = JSON.parse(JSON.stringify(fields));
    let current = newFields;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]].subFields;
    }
    current.splice(path[path.length - 1], 1); // Remove the field at this path
    setFields(newFields);
  };

  const removeArgument = (index) => {
    const newArgs = [...argumentsList];
    newArgs.splice(index, 1); // Remove argument by index
    setArgumentsList(newArgs);
  };

  const renderArgsDef = () => {
    const valid = argumentsList.filter(arg => arg.name.trim());
    return valid.length ? `(${valid.map(arg => `$${arg.name}: ${arg.type}`).join(', ')})` : '';
  };

  const renderArgsUse = () => {
    const valid = argumentsList.filter(arg => arg.name.trim());
    return valid.length ? `(${valid.map(arg => `${arg.name}: $${arg.name}`).join(', ')})` : '';
  };

  const renderFields = (nodes, indent = 2) => {
    return nodes
      .filter(n => n.name.trim())
      .map(n => {
        const space = ' '.repeat(indent);
        const validSubFields = (n.subFields || []).filter(sf => sf.name.trim());
        const children = renderFields(validSubFields, indent + 2);
        return validSubFields.length
          ? `${space}${n.name} {\n${children}\n${space}}`
          : `${space}${n.name}`;
      })
      .join('\n');
  };

  const generateQuery = () => {
    if (!operationName.trim()) return '';
    const fieldBody = renderFields(fields);
    return `${queryType} ${customOperationName}${renderArgsDef()} {\n  ${operationName}${renderArgsUse()} {\n${fieldBody}\n  }\n}`;
  };

  // Download query as .graphql file
  const downloadQuery = () => {
    const query = generateQuery();
    if (query) {
      const blob = new Blob([query], { type: 'text/graphql' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${operationName || 'generated-query'}.graphql`;
      link.click();
    }
  };

  // Save generated query and parameters to backend
  const saveGeneratedQuery = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}/query`,
        {
          generatedQuery: generateQuery(),
          parameters: {
            queryType,
            operationName,
            customOperationName,
            fields,
            argumentsList,
          },
        },
        { headers: getAuthHeaders() }
      );
      toast.success('Query saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save query. Please try again.');
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
          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
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

          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Side - Generator Controls */}
            <div className="w-full md:w-1/2">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-pink-600/50 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
                <div className="relative p-6 bg-gray-900 rounded-xl border border-gray-800/50 transition-all duration-500 group-hover:border-transparent space-y-6">
                  {/* Query Type and Operation Name */}
                  <div className="flex gap-4">
                    <select 
                      className="w-1/2 p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                      value={queryType}
                      onChange={(e) => setQueryType(e.target.value)}
                    >
                      <option value="query">Query</option>
                      <option value="mutation">Mutation</option>
                    </select>
                    <input
                      className="w-1/2 p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                      placeholder="Operation name"
                      value={operationName}
                      onChange={(e) => setOperationName(e.target.value)}
                    />
                  </div>

                  {/* Custom Operation Name */}
                  <input
                    className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    placeholder="Custom name"
                    value={customOperationName}
                    onChange={(e) => setCustomOperationName(e.target.value)}
                  />

                  {/* Arguments Section */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">Arguments</h3>
                    {argumentsList.map((arg, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input
                          className="flex-1 p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                          placeholder="Argument name"
                          value={arg.name}
                          onChange={(e) => updateArgument(i, 'name', e.target.value)}
                        />
                        <select
                          className="p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                          value={arg.type}
                          onChange={(e) => updateArgument(i, 'type', e.target.value)}
                        >
                          {DEFAULT_ARG_TYPES.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeArgument(i)}
                          className="p-2.5 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setArgumentsList([...argumentsList, { name: '', type: 'String' }])}
                      className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      + Add Argument
                    </button>
                  </div>

                  {/* Fields Section */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">Fields</h3>
                    {fields.map((field, i) => (
                      <RecursiveFieldInput
                        key={i}
                        path={[i]}
                        field={field}
                        onChange={updateFieldAtPath}
                        onAddSubField={addSubFieldAtPath}
                        onAddFieldAtSameLevel={addFieldAtSameLevel}
                        onRemoveField={removeFieldAtPath}
                      />
                    ))}
                    <button
                      onClick={() => setFields([...fields, { name: '', subFields: [], depth: 0 }])}
                      className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                    >
                      + Add Field
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Generated Query */}
            <div className="w-full md:w-1/2">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600/50 to-pink-600/50 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
                <div className="relative p-6 bg-gray-900 rounded-xl border border-gray-800/50 transition-all duration-500 group-hover:border-transparent">
                  <h2 className="text-xl font-semibold text-white mb-4">Generated Query</h2>
                  <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                    <CopyBlock
                      text={generateQuery() || '# Start entering fields and arguments...'}
                      language="graphql"
                      showLineNumbers
                      theme={dracula}
                      wrapLines
                      codeBlock
                    />
                  </div>
                  <div className="mt-6 flex justify-end gap-4">
                    <button
                      onClick={saveGeneratedQuery}
                      disabled={loading}
                      className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 transition-all duration-300"
                    >
                      {loading ? 'Saving...' : 'Save Query'}
                    </button>
                    <button
                      onClick={downloadQuery}
                      className="px-6 py-2.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                    >
                      Download Query
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer/>
        
      </div>
    </div>
  );
}

// Recursive Component for Fields and Sub-fields
function RecursiveFieldInput({ field, path, onChange, onAddSubField, onAddFieldAtSameLevel, onRemoveField }) {
  return (
    <div className="ml-3 mt-2 border-l-2 border-violet-500/20 pl-3 rounded">
      <input
        className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all duration-200"
        placeholder="Field name"
        value={field.name}
        onChange={(e) => onChange(path, e.target.value)}
      />
      <div className="flex gap-3 mt-2 mb-2">
        <button
          className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
          onClick={() => onAddSubField(path)}
        >
          + Sub-field
        </button>
        <button
          className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
          onClick={() => onAddFieldAtSameLevel(path)}
        >
          + Sibling
        </button>
        <button
          className="text-sm text-red-400 hover:text-red-300 transition-colors"
          onClick={() => onRemoveField(path)}
        >
          Remove
        </button>
      </div>

      {field.subFields.map((sf, i) => (
        <RecursiveFieldInput
          key={i}
          field={sf}
          path={[...path, i]}
          onChange={onChange}
          onAddSubField={onAddSubField}
          onAddFieldAtSameLevel={onAddFieldAtSameLevel}
          onRemoveField={onRemoveField}
        />
      ))}
    </div>
  );
}