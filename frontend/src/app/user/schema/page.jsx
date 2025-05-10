'use client';

import { useState } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import axios from 'axios';
import React from 'react';
import { FaMinus, FaSpinner } from 'react-icons/fa';

export default function SchemaBuilder() {
  const [types, setTypes] = useState([
    {
      name: 'User',
      fields: [
        { name: 'id', type: 'ID', required: true, isArray: false, isIdField: true },
        { name: 'name', type: 'String', required: true, isArray: false },
        { name: 'posts', type: 'Post', required: true, isArray: true },
      ],
    },
    {
      name: 'Post',
      fields: [{ name: 'branch', type: 'String', required: true, isArray: false }],
    },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("My Schema");

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
    newTypes[typeIndex].fields.push({ name: '', type: 'String', required: false, isArray: false, isIdField: false });
    setTypes(newTypes);
  };

  const removeField = (typeIndex, fieldIndex) => {
    const field = types[typeIndex].fields[fieldIndex];
    if (field.isIdField) return;
    const newTypes = [...types];
    newTypes[typeIndex].fields.splice(fieldIndex, 1);
    setTypes(newTypes);
  };

  const updateField = (typeIndex, fieldIndex, key, value) => {
    const newTypes = [...types];
    newTypes[typeIndex].fields[fieldIndex][key] = value;
    setTypes(newTypes);
  };

  const generateSchema = () => {
    const validTypes = types.filter((t) => t.name.trim());
    const typeDefs = validTypes
      .map((t) => {
        const fields = t.fields
          .filter((f) => f.name.trim())
          .map((f) => {
            let fieldType = f.isArray ? `[${f.type}]` : f.type;
            const required = f.required ? '!' : '';
            return `  ${f.name}: ${fieldType}${required}`;
          })
          .join('\n');
        return `type ${t.name} {\n${fields}\n}`;
      })
      .join('\n\n');

    const queryDefs = validTypes.map((t) => `  get${t.name}(id: ID!): ${t.name}`).join('\n');
    const mutationDefs = validTypes
      .map((t) => {
        const args = t.fields
          .filter((f) => f.name.trim() && !f.isIdField)
          .map((f) => {
            let argType = f.isArray ? `[${f.type}]` : f.type;
            return `${f.name}: ${argType}${f.required ? '!' : ''}`;
          })
          .join(', ');
        return [
          `  create${t.name}(${args}): ${t.name}`,
          `  update${t.name}(id: ID!, ${args}): ${t.name}`,
          `  delete${t.name}(id: ID!): Boolean`,
        ].join('\n');
      })
      .join('\n');

    return `${typeDefs}\n\ntype Query {\n${queryDefs}\n}\n\ntype Mutation {\n${mutationDefs}\n}`;
  };

  const saveSchema = async () => {
    const trimmedTypes = types.map(t => ({
      ...t,
      name: t.name.trim(),
      fields: t.fields.map(f => ({ ...f, name: f.name.trim() })),
    }));

    const names = trimmedTypes.map(t => t.name);
    const hasDuplicates = names.some((name, i) => names.indexOf(name) !== i);

    if (hasDuplicates) return alert('Type names must be unique.');
    const validSchema = generateSchema();
    if (!validSchema.trim()) return alert('Please generate a valid schema before saving.');

    try {
      setIsSaving(true);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/schema/save`, {
        schema: validSchema,
        title: title.trim(),
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      alert('Schema saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save schema.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-12 p-6 bg-gray-50 text-gray-900">
      <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">GraphQL Schema Builder</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-6">
          {types.map((type, typeIndex) => (
            <div key={typeIndex} className="border-b pb-4">
              <input
                type="text"
                placeholder="Type Name"
                value={type.name}
                onChange={(e) => updateTypeName(typeIndex, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm mb-3"
              />

              {type.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="flex flex-wrap gap-3 items-center mb-2">
                  <input
                    type="text"
                    placeholder="Field Name"
                    value={field.name}
                    onChange={(e) => updateField(typeIndex, fieldIndex, 'name', e.target.value)}
                    className="flex-1 min-w-[100px] p-2 border border-gray-300 rounded-md text-sm"
                  />
                  <select
                    value={field.type}
                    onChange={(e) => updateField(typeIndex, fieldIndex, 'type', e.target.value)}
                    className="flex-1 min-w-[100px] p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="String">String</option>
                    <option value="Int">Int</option>
                    <option value="Float">Float</option>
                    <option value="Boolean">Boolean</option>
                    <option value="ID">ID</option>
                    {types.filter((t, i) => t.name && i !== typeIndex).map((t, idx) => (
                      <option key={idx} value={t.name}>{t.name}</option>
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
                    onClick={() => removeField(typeIndex, fieldIndex)}
                    disabled={field.isIdField}
                    className={`p-2 rounded-md text-white text-sm ${
                      field.isIdField ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                    }`}
                    title="Remove field"
                  >
                    <FaMinus />
                  </button>
                </div>
              ))}

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => addField(typeIndex)}
                  className="bg-slate-700 text-white px-4 py-2 rounded-md text-sm hover:bg-slate-800"
                >
                  + Add Field
                </button>
                {types.length > 1 && (
                  <button
                    onClick={() => removeType(typeIndex)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600"
                  >
                    Delete Type
                  </button>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={addType}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700"
          >
            + Add Type
          </button>
        </div>

        {/* Right Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Generated Schema</h3>
          <div className="flex-1 overflow-auto max-h-[400px] rounded-md">
            <CopyBlock
              text={generateSchema()}
              language="graphql"
              showLineNumbers
              wrapLines
              theme={dracula}
            />
          </div>

          <input
            type="text"
            placeholder="Schema Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-4 p-2 border border-gray-300 rounded-md text-sm w-full"
          />

          <button
            onClick={saveSchema}
            disabled={isSaving}
            className={`mt-4 w-full px-4 py-2 rounded-md text-sm font-medium text-white transition ${
              isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-800'
            }`}
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin" /> Saving...
              </span>
            ) : (
              'Save Schema'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
