'use client';
import { useState } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';

const MAX_DEPTH = 5;
const DEFAULT_ARG_TYPES = [
  'String', 'String!', 'Int', 'Int!', 'Float', 'Float!', 'Boolean', 'Boolean!', 'ID', 'ID!',
  '[String]', '[Int]', '[Boolean]', '[ID]', 'CustomType'
];

export default function QueryGenerator() {
  const [queryType, setQueryType] = useState('query');
  const [operationName, setOperationName] = useState('');
  const [customOperationName, setCustomOperationName] = useState('GeneratedQuery');
  const [fields, setFields] = useState([{ name: '', subFields: [], depth: 0 }]);
  const [argumentsList, setArgumentsList] = useState([{ name: '', type: 'String' }]);

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

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      {/* Left Side */}
      <div className="w-full md:w-1/2 space-y-6 p-8 bg-white rounded-2xl shadow-xl text-gray-800 border border-blue-100">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-4 tracking-tight flex items-center gap-2">
          <span role="img" aria-label="magic">✨</span> GraphQL Query Generator
        </h2>

        <div className="flex gap-4">
          <select className="w-1/2 p-2 bg-blue-50 border border-blue-200 rounded focus:ring-2 focus:ring-blue-300" value={queryType} onChange={(e) => setQueryType(e.target.value)}>
            <option value="query">Query</option>
            <option value="mutation">Mutation</option>
          </select>
          <input className="w-1/2 p-2 bg-blue-50 border border-blue-200 rounded focus:ring-2 focus:ring-blue-300" placeholder="Operation name" value={operationName} onChange={(e) => setOperationName(e.target.value)} />
        </div>
        <input className="w-full p-2 bg-blue-50 border border-blue-200 rounded focus:ring-2 focus:ring-blue-300" placeholder="Custom name" value={customOperationName} onChange={(e) => setCustomOperationName(e.target.value)} />

        {/* Arguments */}
        <div>
          <p className="font-semibold text-blue-700 mb-2">Arguments:</p>
          {argumentsList.map((arg, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input className="flex-1 p-2 bg-white border border-blue-200 rounded" placeholder="arg name" value={arg.name}
                onChange={(e) => updateArgument(i, 'name', e.target.value)} />
              <select className="p-2 bg-white border border-blue-200 rounded" value={arg.type}
                onChange={(e) => updateArgument(i, 'type', e.target.value)}>
                {DEFAULT_ARG_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <button className="text-red-600 text-xs font-bold px-2 py-1 rounded hover:bg-red-50 transition" onClick={() => removeArgument(i)} title="Remove argument">✕</button>
            </div>
          ))}
          <button className="text-sm text-blue-600 font-semibold hover:underline mt-1" onClick={() => setArgumentsList([...argumentsList, { name: '', type: 'String' }])}>
            + Add Argument
          </button>
        </div>

        {/* Fields */}
        <div>
          <p className="font-semibold text-blue-700 mt-4 mb-2">Fields:</p>
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
          <button className="text-blue-600 text-sm font-semibold hover:underline mt-1" onClick={() => setFields([...fields, { name: '', subFields: [], depth: 0 }])}>
            + Add Field
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 p-8 bg-white rounded-2xl shadow-xl border border-blue-100 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Generated Query</h2>
        <div className="flex-1 bg-gray-900 rounded-lg p-4 overflow-auto">
          <CopyBlock
            text={generateQuery() || '# Start entering fields and arguments...'}
            language="graphql"
            showLineNumbers
            theme={dracula}
            wrapLines
            codeBlock
          />
        </div>
        <div className="mt-6 flex justify-end">
          <button className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold shadow hover:from-green-600 hover:to-blue-600 transition" onClick={downloadQuery}>
            Download as .graphql
          </button>
        </div>
      </div>
    </div>
  );
}

// Recursive Component for Fields and Sub-fields
function RecursiveFieldInput({ field, path, onChange, onAddSubField, onAddFieldAtSameLevel, onRemoveField }) {
  return (
    <div className="ml-3 mt-2 border-l-2 border-blue-200 pl-3 bg-blue-50/30 rounded">
      <input
        className="w-full p-2 mb-1 bg-white border border-blue-200 rounded text-sm"
        placeholder="Field name"
        value={field.name}
        onChange={(e) => onChange(path, e.target.value)}
      />
      <div className="flex gap-2 mb-1">
        <button
          className="text-xs text-blue-600 font-semibold hover:underline"
          onClick={() => onAddSubField(path)}
        >
          + Sub-field
        </button>
        <button
          className="text-xs text-blue-600 font-semibold hover:underline"
          onClick={() => onAddFieldAtSameLevel(path)}
        >
          + Sibling
        </button>
        <button
          className="text-xs text-red-600 font-semibold hover:underline"
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
