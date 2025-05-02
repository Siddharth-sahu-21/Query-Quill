'use client';
import { useState, useEffect } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import axios from 'axios';
import toast from 'react-hot-toast'; // Import only toast
import debounce from 'lodash.debounce';
import React from 'react';
import JSZip from 'jszip'; // Import JSZip for creating ZIP files
import { saveAs } from 'file-saver'; // Import FileSaver for downloading files

export default function QueryGenerator({ params: paramsPromise }) {
    const [projectId, setProjectId] = useState(null);
    const [queryType, setQueryType] = useState('query');
    const [operationName, setOperationName] = useState('');
    const [customOperationName, setCustomOperationName] = useState('GeneratedQuery'); // New state for custom operation name
    const [fields, setFields] = useState([{ name: '', subFields: [] }]);
    const [argumentsList, setArgumentsList] = useState([{ name: '', type: 'String' }]);
    const [isSaving, setIsSaving] = useState(false); // State to track saving status

    useEffect(() => {
        paramsPromise.then((resolvedParams) => {
            setProjectId(resolvedParams?.id || null);
        });
    }, [paramsPromise]);

    useEffect(() => {
        if (!projectId) return;

        const fetchSavedData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}`, {
                    headers: {
                        'x-auth-token': localStorage.getItem('token'),
                    },
                });

                const { queryType, operationName, fields, argumentsList } = response.data.parameters || {};
                setQueryType(queryType || 'query');
                setOperationName(operationName || '');
                setFields(fields || [{ name: '', subFields: [] }]);
                setArgumentsList(argumentsList || [{ name: '', type: 'String' }]);
            } catch (error) {
                console.error('Error fetching saved data:', error.response || error.message);
            }
        };

        fetchSavedData();
    }, [projectId]);

    const addField = () => setFields([...fields, { name: '', subFields: [] }]);
    const updateField = (index, value) => {
        const newFields = [...fields];
        newFields[index].name = value;
        setFields(newFields);
    };
    const removeField = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields);
    };

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
    const removeArgument = (index) => {
        const newArgs = argumentsList.filter((_, i) => i !== index);
        setArgumentsList(newArgs);
    };

    const renderFields = (fieldsArray, indent = 2) => {
        return fieldsArray
            .filter(f => f.name?.trim())
            .map(f => {
                const space = ' '.repeat(indent);
                const subFieldsRendered = renderFields(f.subFields || [], indent + 2);
                return `${space}${f.name.trim()}${subFieldsRendered ? ` {\n${subFieldsRendered}\n${space}}` : ''}`;
            })
            .join('\n');
    };

    const generateQuery = () => {
        if (!operationName.trim()) {
            console.error("Operation name is required.");
            return '';
        }

        const validArgs = argumentsList
            .filter(arg => arg.name.trim() && /^[A-Z][A-Za-z0-9_]*!?$/.test(arg.type.trim()));

        const validFields = fields.filter(f => f.name?.trim());
        if (validFields.length === 0) {
            console.error("At least one field is required.");
            return '';
        }

        const argsString = validArgs.map(arg => `$${arg.name.trim()}: ${arg.type.trim()}`).join(', ');
        const argsUsage = validArgs.map(arg => `${arg.name.trim()}: $${arg.name.trim()}`).join(', ');

        const fieldsString = renderFields(validFields);

        // Use the custom operation name provided by the user
        return `${queryType} ${customOperationName}${argsString ? `(${argsString})` : ''} {\n  ${operationName.trim()}${argsUsage ? `(${argsUsage})` : ''} {\n${fieldsString}\n  }\n}`;
    };

    const saveData = async () => {
        if (!projectId) {
            console.error('Project ID is missing. Cannot save data.');
            toast.error('Project ID is missing. Cannot save data.');
            return;
        }

        const generatedQuery = generateQuery();
        if (!generatedQuery) return;

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
            console.log('Data saved successfully:', response.data);
            toast.success('Data saved successfully!');
        } catch (error) {
            console.error('Error saving data:', error.response || error.message);
            toast.error('Failed to save data. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // New function to download the generated query as a ZIP file
    const downloadAsZip = () => {
        const generatedQuery = generateQuery();
        if (!generatedQuery) {
            toast.error('No query to download.');
            return;
        }

        const zip = new JSZip();
        zip.file('generatedQuery.graphql', generatedQuery); // Add the query to the ZIP file

        zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, 'generatedQuery.zip'); // Trigger the download
            toast.success('Query downloaded as ZIP!');
        });
    };

    // Auto-save with debounce
    const debouncedSaveData = debounce(saveData, 10000); // 10 seconds debounce
    useEffect(() => {
        if (!projectId) return;
        debouncedSaveData();
        return () => debouncedSaveData.cancel();
    }, [queryType, operationName, fields, argumentsList, projectId]);

    if (!projectId) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6">
            {/* Left Side - Form */}
            <div className="w-full md:w-1/2 space-y-4 bg-gray-800 p-4 rounded-lg text-white">
                <h2 className="text-xl font-bold">GraphQL Query Generator</h2>

                <label className="block">Query Type:</label>
                <select className="w-full p-2 bg-gray-700 rounded" value={queryType} onChange={e => setQueryType(e.target.value)}>
                    <option value="query">Query</option>
                    <option value="mutation">Mutation</option>
                </select>

                <label className="block">Operation Name:</label>
                <input
                    type="text"
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="e.g., getUser"
                    value={operationName}
                    onChange={e => setOperationName(e.target.value)}
                />

                {/* New Input for Custom Operation Name */}
                <label className="block">Custom Operation Name:</label>
                <input
                    type="text"
                    className="w-full p-2 bg-gray-700 rounded"
                    placeholder="e.g., MyCustomQuery"
                    value={customOperationName}
                    onChange={e => setCustomOperationName(e.target.value)}
                />

                <label className="block">Fields:</label>
                {fields.map((field, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                className="w-full p-2 bg-gray-700 rounded"
                                placeholder="e.g., name"
                                value={field.name}
                                onChange={e => updateField(index, e.target.value)}
                            />
                            <button onClick={() => removeField(index)} className="bg-red-600 px-2 py-1 rounded text-white">-</button>
                        </div>
                        {field.subFields.map((subField, subIndex) => (
                            <div key={subIndex} className="ml-4 flex items-center gap-2">
                                <input
                                    type="text"
                                    className="w-full p-2 bg-gray-600 rounded"
                                    placeholder="Sub-field e.g., email"
                                    value={subField.name}
                                    onChange={e => updateSubField(index, subIndex, e.target.value)}
                                />
                                <button onClick={() => removeSubField(index, subIndex)} className="bg-red-600 px-2 py-1 rounded text-white">-</button>
                            </div>
                        ))}
                        <button onClick={() => addSubField(index)} className="bg-blue-700 text-sm px-3 py-1 rounded">+ Add Sub-field</button>
                    </div>
                ))}
                <button onClick={addField} className="bg-blue-600 px-4 py-2 rounded">+ Add Field</button>

                <label className="block">Arguments:</label>
                {argumentsList.map((arg, index) => (
                    <div key={index} className="flex gap-2 items-center">
                        <input
                            type="text"
                            className="w-1/2 p-2 bg-gray-700 rounded"
                            placeholder="Argument Name"
                            value={arg.name}
                            onChange={e => updateArgument(index, 'name', e.target.value)}
                        />
                        <select
                            className="w-1/2 p-2 bg-gray-700 rounded"
                            value={arg.type}
                            onChange={e => updateArgument(index, 'type', e.target.value)}
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
                        <button onClick={() => removeArgument(index)} className="bg-red-600 px-2 py-1 rounded text-white">-</button>
                    </div>
                ))}
                <button onClick={addArgument} className="bg-green-600 px-4 py-2 rounded">+ Add Argument</button>
            </div>

            {/* Right Side - Real-Time Query Display */}
            <div className="w-full md:w-1/2 bg-gray-900 p-4 rounded-lg">
                <h2 className="text-white text-xl font-bold mb-2">Generated Query</h2>
                <CopyBlock text={generateQuery()} language="graphql" showLineNumbers={true} theme={dracula} />
                <div className="flex gap-4 mt-4">
                    <button onClick={saveData} disabled={isSaving} className={`px-4 py-2 rounded bg-blue-600 text-white ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}>
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={downloadAsZip} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
                        Download as ZIP
                    </button>
                </div>
            </div>
        </div>
    );
}