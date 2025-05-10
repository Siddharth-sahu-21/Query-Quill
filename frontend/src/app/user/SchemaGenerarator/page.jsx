'use client';

import { useState } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import axios from 'axios';
import React from 'react';
import { FaMinus } from 'react-icons/fa'; // Importing minus icon from react-icons

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
      fields: [
        { name: 'branch', type: 'String', required: true, isArray: false },
      ],
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
    newTypes[index].name = name.trim();
    setTypes(newTypes);
  };

  const addField = (typeIndex) => {
    const newTypes = [...types];
    newTypes[typeIndex].fields.push({ name: '', type: 'String', required: false, isArray: false, isIdField: false });
    setTypes(newTypes);
  };

  const removeField = (typeIndex, fieldIndex) => {
    const newTypes = [...types];
    newTypes[typeIndex].fields.splice(fieldIndex, 1);
    setTypes(newTypes);
  };

  const updateField = (typeIndex, fieldIndex, fieldKey, value) => {
    const newTypes = [...types];
    newTypes[typeIndex].fields[fieldIndex][fieldKey] = value;
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

    const queryDefs = validTypes
      .map((t) => `  get${t.name}(id: ID!): ${t.name}`)
      .join('\n');

    const mutationDefs = validTypes
      .map((t) => {
        const args = t.fields
          .filter((f) => f.name.trim() && !f.isIdField) // Exclude `id` field for mutations
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

    const queryType = queryDefs ? `\ntype Query {\n${queryDefs}\n}` : '';
    const mutationType = mutationDefs ? `\ntype Mutation {\n${mutationDefs}\n}` : '';

    return `${typeDefs}${queryType}${mutationType}`;
  };

  const saveSchema = async () => {
    const generatedSchema = generateSchema();
    if (!generatedSchema.trim()) {
      alert('Please generate a valid schema before saving.');
      return;
    }

    try {
      setIsSaving(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/schema/save`,
        {
          schema: generatedSchema,
          title: title, // Save with dynamic title
        },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        }
      );
      alert('Schema saved successfully!');
    } catch (error) {
      console.error('Error saving schema:', error);
      alert('Failed to save schema. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-16 p-6 bg-gray-100 text-black">
      <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600">GraphQL Schema Builder</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          {types.map((type, typeIndex) => (
            <div key={typeIndex} className="border-b border-gray-300 pb-6 mb-6">
              <input
                type="text"
                placeholder="Type Name"
                className="w-full p-3 mb-3 bg-gray-50 rounded-lg text-black"
                value={type.name}
                onChange={(e) => updateTypeName(typeIndex, e.target.value)}
              />
              {type.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="flex gap-3 items-center mb-4">
                  <input
                    type="text"
                    placeholder="Field Name"
                    className="w-1/4 p-3 bg-gray-50 rounded-lg text-black"
                    value={field.name}
                    onChange={(e) => updateField(typeIndex, fieldIndex, 'name', e.target.value)}
                  />
                  <select
                    className="w-1/4 p-3 bg-gray-50 rounded-lg text-black"
                    value={field.type}
                    onChange={(e) => updateField(typeIndex, fieldIndex, 'type', e.target.value)}
                  >
                    <option value="String">String</option>
                    <option value="Int">Int</option>
                    <option value="Float">Float</option>
                    <option value="Boolean">Boolean</option>
                    <option value="ID">ID</option>
                    {types
                      .filter((t) => t.name)
                      .map((t, idx) => (
                        <option key={idx} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                  </select>
                  <label className="flex items-center text-gray-700">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={field.isArray}
                      onChange={(e) =>
                        updateField(typeIndex, fieldIndex, 'isArray', e.target.checked)
                      }
                    />
                    List
                  </label>
                  <label className="flex items-center text-gray-700">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={field.required}
                      onChange={(e) =>
                        updateField(typeIndex, fieldIndex, 'required', e.target.checked)
                      }
                    />
                    Required
                  </label>
                  {/* Minus Button to Delete Field with minus icon */}
                  <button
                    onClick={() => removeField(typeIndex, fieldIndex)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    <FaMinus />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addField(typeIndex)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700 transition"
              >
                + Add Field
              </button>
              {/* Button to remove type */}
              {types.length > 1 && (
                <button
                  onClick={() => removeType(typeIndex)}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg w-full mt-6 hover:bg-red-700 transition"
                >
                  Delete Type
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addType}
            className="bg-green-600 text-white px-6 py-3 rounded-lg w-full hover:bg-green-700 transition"
          >
            + Add Type
          </button>
        </div>

        {/* Right: Schema Display */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-indigo-600">Generated Schema</h3>
          <CopyBlock
            text={generateSchema()}
            language="graphql"
            showLineNumbers={true}
            theme={dracula}
          />
          <input
            type="text"
            placeholder="Schema Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-4 p-3 bg-gray-50 rounded-lg text-black w-full"
          />
          <button
            onClick={saveSchema}
            disabled={isSaving}
            className={`mt-4 px-6 py-3 rounded-lg font-semibold text-white w-full ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transition'}`}
          >
            {isSaving ? 'Saving...' : 'Save Schema'}
          </button>
        </div>
      </div>
    </div>
  );
}
