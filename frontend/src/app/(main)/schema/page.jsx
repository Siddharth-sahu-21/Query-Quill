'use client';
import { useState } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import axios from 'axios';
import React from 'react';

export default function SchemaBuilder() {
  const [types, setTypes] = useState([
    {
      name: '',
      fields: [{ name: '', type: 'String', required: false }],
    },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const addType = () => {
    setTypes([...types, { name: '', fields: [{ name: '', type: 'String', required: false }] }]);
  };

  const updateTypeName = (index, name) => {
    const newTypes = [...types];
    newTypes[index].name = name;
    setTypes(newTypes);
  };

  const addField = (typeIndex) => {
    const newTypes = [...types];
    newTypes[typeIndex].fields.push({ name: '', type: 'String', required: false });
    setTypes(newTypes);
  };

  const updateField = (typeIndex, fieldIndex, fieldKey, value) => {
    const newTypes = [...types];
    newTypes[typeIndex].fields[fieldIndex][fieldKey] =
      fieldKey === 'required' ? value : value.trim();
    setTypes(newTypes);
  };

  const generateSchema = () => {
    const validTypes = types.filter((t) => t.name.trim());

    const typeDefs = validTypes
      .map((t) => {
        const fields = t.fields
          .filter((f) => f.name.trim())
          .map((f) => `  ${f.name}: ${f.type}${f.required ? '!' : ''}`)
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
          .filter((f) => f.name.trim())
          .map((f) => `${f.name}: ${f.type}${f.required ? '!' : ''}`)
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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/schema/save`,
        {
          schema: generatedSchema,
          title: 'My Schema',
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
    <div className="mt-16 p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">GraphQL Schema Builder</h2>
      <div className="space-y-6">
        {types.map((type, typeIndex) => (
          <div key={typeIndex} className="bg-gray-800 p-4 rounded">
            <input
              type="text"
              placeholder="Type Name"
              className="w-full p-2 mb-2 bg-gray-700 rounded text-white"
              value={type.name}
              onChange={(e) => updateTypeName(typeIndex, e.target.value)}
            />
            {type.fields.map((field, fieldIndex) => (
              <div key={fieldIndex} className="flex gap-2 items-center mb-2">
                <input
                  type="text"
                  placeholder="Field Name"
                  className="w-1/3 p-2 bg-gray-700 rounded text-white"
                  value={field.name}
                  onChange={(e) => updateField(typeIndex, fieldIndex, 'name', e.target.value)}
                />
                <select
                  className="w-1/3 p-2 bg-gray-700 rounded text-white"
                  value={field.type}
                  onChange={(e) => updateField(typeIndex, fieldIndex, 'type', e.target.value)}
                >
                  <option value="String">String</option>
                  <option value="Int">Int</option>
                  <option value="Float">Float</option>
                  <option value="Boolean">Boolean</option>
                  <option value="ID">ID</option>
                </select>
                <label className="flex items-center text-white">
                  <input
                    type="checkbox"
                    className="mr-1"
                    checked={field.required}
                    onChange={(e) =>
                      updateField(typeIndex, fieldIndex, 'required', e.target.checked)
                    }
                  />
                  Required
                </label>
              </div>
            ))}
            <button
              onClick={() => addField(typeIndex)}
              className="bg-blue-700 text-white px-4 py-2 rounded"
            >
              + Add Field
            </button>
          </div>
        ))}
        <button onClick={addType} className="bg-green-700 text-white px-4 py-2 rounded">
          + Add Type
        </button>
      </div>

      <h3 className="text-xl text-white mt-8 mb-2 font-bold">Generated Schema</h3>
      <CopyBlock
        text={generateSchema()}
        language="graphql"
        showLineNumbers={true}
        theme={dracula}
      />

      <button
        onClick={saveSchema}
        disabled={isSaving}
        className={`mt-4 px-6 py-3 rounded-md font-semibold text-white ${
          isSaving ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isSaving ? 'Saving...' : 'Save Schema'}
      </button>
    </div>
  );
}
