'use client';
import { useState, useEffect, useMemo } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import axios from 'axios';
import toast from 'react-hot-toast';
import debounce from 'lodash.debounce';
import React from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function QueryGenerator({ params: paramsPromise }) {
  const [projectId, setProjectId] = useState(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [queryType, setQueryType] = useState('query');
  const [operationName, setOperationName] = useState('');
  const [customOperationName, setCustomOperationName] = useState('GeneratedQuery');
  const [fields, setFields] = useState([{ name: '', subFields: [] }]);
  const [argumentsList, setArgumentsList] = useState([{ name: '', type: 'String' }]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    paramsPromise.then((resolvedParams) => {
      setProjectId(resolvedParams?.id || null);
    });
  }, [paramsPromise]);

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}`, {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });

        const { title, parameters } = response.data;
        setProjectTitle(title || 'Untitled Project');
        const { queryType, operationName, fields, argumentsList } = parameters || {};
        setQueryType(queryType || 'query');
        setOperationName(operationName || '');
        setFields(fields || [{ name: '', subFields: [] }]);
        setArgumentsList(argumentsList || [{ name: '', type: 'String' }]);
      } catch (error) {
        console.error('Error fetching project details:', error.response || error.message);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const addField = () => setFields([...fields, { name: '', subFields: [] }]);
  const updateField = (index, value) => {
    const newFields = [...fields];
    newFields[index].name = value;
    setFields(newFields);
  };
  const removeField = (index) => setFields(fields.filter((_, i) => i !== index));
  const addSubField = (index) => {
    const newFields = [...fields];
    newFields[index].subFields.push({ name: '' });
    setFields(newFields);
  };
  const updateSubField = (fieldIndex, subIndex, value) => {
    const newFields = [...fields];
    newFields[fieldIndex].subFields[subIndex].name = value;
    setFields(newFields);
  };
  const removeSubField = (fieldIndex, subIndex) => {
    const newFields = [...fields];
    newFields[fieldIndex].subFields = newFields[fieldIndex].subFields.filter((_, i) => i !== subIndex);
    setFields(newFields);
  };

  const addArgument = () => setArgumentsList([...argumentsList, { name: '', type: 'String' }]);
  const updateArgument = (index, field, value) => {
    const newArgs = [...argumentsList];
    newArgs[index][field] = value;
    setArgumentsList(newArgs);
  };
  const removeArgument = (index) => setArgumentsList(argumentsList.filter((_, i) => i !== index));

  const renderFields = (fieldsArray, indent = 2) => {
    return fieldsArray
      .filter((f) => f.name?.trim())
      .map((f) => {
        const space = ' '.repeat(indent);
        const subFieldsRendered = renderFields(f.subFields || [], indent + 2);
        return `${space}${f.name.trim()}${subFieldsRendered ? ` {\n${subFieldsRendered}\n${space}}` : ''}`;
      })
      .join('\n');
  };

  const generateQuery = () => {
    if (!operationName.trim()) return '';

    const validArgs = argumentsList.filter(
      (arg) => arg.name.trim() && /^(!?[\[\]A-Za-z0-9_!]+)$/.test(arg.type.trim())
    );

    const validFields = fields.filter((f) => f.name?.trim());
    if (validFields.length === 0) return '';

    const argsString = validArgs.map((arg) => `$${arg.name.trim()}: ${arg.type.trim()}`).join(', ');
    const argsUsage = validArgs.map((arg) => `${arg.name.trim()}: $${arg.name.trim()}`).join(', ');
    const fieldsString = renderFields(validFields);

    return `${queryType} ${customOperationName}${argsString ? `(${argsString})` : ''} {\n  ${operationName.trim()}${
      argsUsage ? `(${argsUsage})` : ''
    } {\n${fieldsString}\n  }\n}`;
  };

  const saveData = async () => {
    if (!projectId) {
      toast.error('Project ID is missing. Cannot save data.');
      return;
    }

    const generatedQuery = generateQuery();
    if (!generatedQuery) {
      toast.error('Generated query is invalid. Please check your inputs.');
      return;
    }

    const parameters = { queryType, operationName, fields, argumentsList };

    try {
      setIsSaving(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}/save`,
        { generatedQuery, parameters },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        }
      );
      toast.success('Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error.response || error.message);
      toast.error('Failed to save data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadAsZip = () => {
    const generatedQuery = generateQuery();
    if (!generatedQuery) {
      toast.error('No query to download.');
      return;
    }

    const zip = new JSZip();
    zip.file('generatedQuery.graphql', generatedQuery);

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'generatedQuery.zip');
      toast.success('Query downloaded as ZIP!');
    });
  };

  const debouncedSaveData = useMemo(() => debounce(saveData, 10000), [queryType, operationName, fields, argumentsList]);

  useEffect(() => {
    if (!projectId) return;
    debouncedSaveData();
    return () => debouncedSaveData.cancel();
  }, [debouncedSaveData, projectId]);

  if (!projectId) {
    return <div className="text-center text-gray-700 text-xl">Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 min-h-screen">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 space-y-6 bg-white p-6 rounded-lg shadow-lg text-gray-800">
        <h2 className="text-3xl font-bold text-blue-600">GraphQL Query Generator</h2>

        {/* Query Type */}
        <label className="block text-sm font-semibold">Query Type:</label>
        <select
          className="w-full p-3 bg-gray-100 rounded-md"
          value={queryType}
          onChange={(e) => setQueryType(e.target.value)}
        >
          <option value="query">Query</option>
          <option value="mutation">Mutation</option>
        </select>

        {/* Operation Name */}
        <label className="block text-sm font-semibold">Operation Name:</label>
        <input
          className="w-full p-3 bg-gray-100 rounded-md"
          placeholder="e.g., getUser"
          value={operationName}
          onChange={(e) => setOperationName(e.target.value)}
        />

        {/* Custom Operation Name */}
        <label className="block text-sm font-semibold">Custom Operation Name:</label>
        <input
          className="w-full p-3 bg-gray-100 rounded-md"
          placeholder="e.g., MyCustomQuery"
          value={customOperationName}
          onChange={(e) => setCustomOperationName(e.target.value)}
        />

        {/* Fields */}
        <label className="block text-sm font-semibold">Fields:</label>
        {fields.map((field, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                className="w-full p-3 bg-gray-100 rounded-md"
                placeholder="e.g., name"
                value={field.name}
                onChange={(e) => updateField(index, e.target.value)}
              />
              <button onClick={() => removeField(index)} className="bg-red-100 px-3 py-2 rounded-md text-red-600">-</button>
            </div>
            {field.subFields.map((subField, subIndex) => (
              <div key={`${index}-${subIndex}`} className="ml-4 flex items-center gap-2">
                <input
                  className="w-full p-3 bg-gray-100 rounded-md"
                  placeholder="Sub-field e.g., email"
                  value={subField.name}
                  onChange={(e) => updateSubField(index, subIndex, e.target.value)}
                />
                <button
                  onClick={() => removeSubField(index, subIndex)}
                  className="bg-red-100 px-3 py-2 rounded-md text-red-600"
                >
                  -
                </button>
              </div>
            ))}
            <button
              onClick={() => addSubField(index)}
              className="bg-blue-100 px-4 py-2 rounded-md text-blue-600"
            >
              + Add Sub-field
            </button>
          </div>
        ))}
        <button
          onClick={addField}
          className="bg-blue-100 px-4 py-2 rounded-md text-blue-600"
        >
          + Add Field
        </button>

        {/* Arguments */}
        <label className="block text-sm font-semibold">Arguments:</label>
        {argumentsList.map((arg, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              className="w-1/2 p-3 bg-gray-100 rounded-md"
              placeholder="Argument Name"
              value={arg.name}
              onChange={(e) => updateArgument(index, 'name', e.target.value)}
            />
            <select
              className="w-1/2 p-3 bg-gray-100 rounded-md"
              value={arg.type}
              onChange={(e) => updateArgument(index, 'type', e.target.value)}
            >
              <option value="String">String</option>
              <option value="String!">String!</option>
              <option value="Int">Int</option>
              <option value="Int!">Int!</option>
              <option value="Float">Float</option>
              <option value="Float!">Float!</option>
              <option value="Boolean">Boolean</option>
              <option value="Boolean!">Boolean!</option>
              <option value="ID">ID</option>
              <option value="ID!">ID!</option>
              <option value="[String]">[String]</option>
              <option value="[String]!">[String]!</option>
              <option value="[Int]">[Int]</option>
              <option value="[Int]!">[Int]!</option>
              <option value="[Float]">[Float]</option>
              <option value="[Float]!">[Float]!</option>
              <option value="[Boolean]">[Boolean]</option>
              <option value="[Boolean]!">[Boolean]!</option>
              <option value="[ID]">[ID]</option>
              <option value="[ID]!">[ID]!</option>
            </select>
            <button
              onClick={() => removeArgument(index)}
              className="bg-red-100 px-3 py-2 rounded-md text-red-600"
            >
              -
            </button>
          </div>
        ))}
        <button
          onClick={addArgument}
          className="bg-green-100 px-4 py-2 rounded-md text-green-600"
        >
          + Add Argument
        </button>
      </div>

      {/* Right Side - Generated Query */}
      <div className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-gray-800 text-2xl font-bold mb-4">Generated Query</h2>
        <CopyBlock
          text={generateQuery() || '# Invalid query. Please ensure operation name and fields are provided.'}
          language="graphql"
          showLineNumbers={true}
          theme={dracula}
        />
        <div className="flex gap-4 mt-6">
          <button
            onClick={saveData}
            disabled={isSaving}
            className={`px-6 py-3 rounded-md font-semibold text-white bg-blue-500 hover:bg-blue-600 transition ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={downloadAsZip}
            className="px-6 py-3 rounded-md font-semibold text-white bg-green-500 hover:bg-green-600 transition"
          >
            Download as ZIP
          </button>
        </div>
      </div>
    </div>
  );
}
