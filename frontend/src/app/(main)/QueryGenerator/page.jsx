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
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100 min-h-screen">
      {/* Left Side */}
      <div className="w-full md:w-1/2 space-y-4 p-6 bg-white rounded shadow text-gray-800">
        <h2 className="text-2xl font-bold text-blue-600">GraphQL Generator</h2>

        <select className="w-full p-2 bg-gray-100" value={queryType} onChange={(e) => setQueryType(e.target.value)}>
          <option value="query">Query</option>
          <option value="mutation">Mutation</option>
        </select>

        <input className="w-full p-2 bg-gray-100" placeholder="Operation name" value={operationName} onChange={(e) => setOperationName(e.target.value)} />
        <input className="w-full p-2 bg-gray-100" placeholder="Custom name" value={customOperationName} onChange={(e) => setCustomOperationName(e.target.value)} />

        {/* Arguments */}
        <div>
          <p className="font-semibold">Arguments:</p>
          {argumentsList.map((arg, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input className="flex-1 p-2 bg-white border" placeholder="arg name" value={arg.name}
                onChange={(e) => updateArgument(i, 'name', e.target.value)} />
              <select className="p-2 bg-white border" value={arg.type}
                onChange={(e) => updateArgument(i, 'type', e.target.value)}>
                {DEFAULT_ARG_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <button className="text-red-600 text-xs" onClick={() => removeArgument(i)}>-</button>
            </div>
          ))}
          <button className="text-sm text-blue-600" onClick={() => setArgumentsList([...argumentsList, { name: '', type: 'String' }])}>
            + Add Argument
          </button>
        </div>

        {/* Fields */}
        <div>
          <p className="font-semibold mt-4">Fields:</p>
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
          <button className="text-blue-600 text-sm" onClick={() => setFields([...fields, { name: '', subFields: [], depth: 0 }])}>
            + Add Field
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Generated Query</h2>
        <CopyBlock
          text={generateQuery() || '# Start entering fields and arguments...'}
          language="graphql"
          showLineNumbers
          theme={dracula}
        />
        <div className="mt-4">
          <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={downloadQuery}>
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
    <div className="ml-3 mt-2 border-l-2 pl-3">
      <input
        className="w-full p-2 mb-1 bg-white border text-sm"
        placeholder="Field name"
        value={field.name}
        onChange={(e) => onChange(path, e.target.value)}
      />
      <button
        className="text-xs text-blue-500 mb-1 hover:underline"
        onClick={() => onAddSubField(path)}
      >
        + Add Sub-field
      </button>
      <button
        className="text-xs text-blue-500 mb-1 ml-2 hover:underline"
        onClick={() => onAddFieldAtSameLevel(path)}
      >
        + Add Field at Same Level
      </button>
      <button
        className="text-xs text-red-600 mb-1 ml-2 hover:underline"
        onClick={() => onRemoveField(path)}
      >
        - Remove Field
      </button>
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
