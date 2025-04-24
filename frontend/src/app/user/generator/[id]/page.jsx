'use client';
import { useState, useEffect } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // Import toast and Toaster
import React from 'react';

export default function QueryGenerator({ params: paramsPromise }) {
    // Unwrap the params Promise
    const params = React.use(paramsPromise);
    const { id: projectId } = params || {}; // Extract project ID from unwrapped params

    const [queryType, setQueryType] = useState('query');
    const [operationName, setOperationName] = useState('');
    const [fields, setFields] = useState([{ name: '', subFields: [] }]);
    const [argumentsList, setArgumentsList] = useState([{ name: '', type: '' }]);
    const [isSaving, setIsSaving] = useState(false); // State to track saving status

    // Fetch saved data when the component loads
    useEffect(() => {
        if (!projectId) {
            console.error('Project ID is missing in the URL');
            toast.error('Project ID is missing. Please check the URL.');
            return;
        }

        const fetchSavedData = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/project/${projectId}`, {
                    headers: {
                        'x-auth-token': localStorage.getItem('token'),
                    },
                });

                // Extract saved parameters from the response
                const { queryType, operationName, fields, argumentsList } = response.data.parameters || {};
                setQueryType(queryType || 'query');
                setOperationName(operationName || '');
                setFields(fields || [{ name: '', subFields: [] }]);
                setArgumentsList(argumentsList || [{ name: '', type: '' }]);
            } catch (error) {
                console.error('Error fetching saved data:', error.response || error.message);
                toast.error('Failed to fetch saved data. Please try again.');
            }
        };

        fetchSavedData();
    }, [projectId]);

    // Function to add a new field
    const addField = () => setFields([...fields, { name: '', subFields: [] }]);

    // Function to add a sub-field to a specific field
    const addSubField = (index) => {
        const newFields = [...fields];
        newFields[index].subFields.push({ name: '', subFields: [] });
        setFields(newFields);
    };

    // Function to update a field's name
    const updateField = (index, value) => {
        const newFields = [...fields];
        newFields[index].name = value;
        setFields(newFields);
    };

    // Function to update a sub-field's name
    const updateSubField = (fieldIndex, subIndex, value) => {
        const newFields = [...fields];
        newFields[fieldIndex].subFields[subIndex].name = value;
        setFields(newFields);
    };

    // Function to add a new argument
    const addArgument = () => setArgumentsList([...argumentsList, { name: '', type: '' }]);

    // Function to update an argument's name or type
    const updateArgument = (index, field, value) => {
        const newArgs = [...argumentsList];
        newArgs[index][field] = value;
        setArgumentsList(newArgs);
    };

    const renderFields = (fieldsArray, indent = 2) => {
        return fieldsArray
            .filter(f => f.name)
            .map(f => {
                const subFields = renderFields(f.subFields, indent + 2);
                const space = ' '.repeat(indent);
                return `${space}${f.name}${subFields ? ` {\n${subFields}\n${space}}` : ''}`;
            })
            .join('\n');
    };

    const generateQuery = () => {
        const argsString = argumentsList
            .filter(arg => arg.name && arg.type)
            .map(arg => `$${arg.name}: ${arg.type}`)
            .join(', ');

        const fieldsString = renderFields(fields);

        const argsUsage = argumentsList
            .filter(arg => arg.name && arg.type)
            .map(arg => `${arg.name}: $${arg.name}`)
            .join(', ');

        return `${queryType} ${operationName}${argsString ? `(${argsString})` : ''} {\n  ${operationName}${argsUsage ? `(${argsUsage})` : ''} {\n${fieldsString}\n  }\n}`;
    };

    const saveData = async () => {
        if (!projectId) {
            toast.error('Project ID is missing. Cannot save data.');
            return;
        }

        const generatedQuery = generateQuery();
        const parameters = { queryType, operationName, fields, argumentsList };

        try {
            setIsSaving(true); // Set saving state
            console.log('Saving data:', { generatedQuery, parameters }); // Debugging log
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
            toast.success('Data saved successfully!', { id: 'save-success' }); // Use unique ID
        } catch (error) {
            console.error('Error saving data:', error.response || error.message); // Log detailed error
            toast.error('Something went wrong. Please try again.', { id: 'save-error' }); // Use unique ID
        } finally {
            setIsSaving(false); // Reset saving state
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 p-6">
            {/* Toaster Component */}
            <Toaster position="top-right" reverseOrder={false} />

            {/* Left Side - Form */}
            <div className="w-full md:w-1/2 space-y-4 bg-gray-800 p-4 rounded-lg text-white">
                <h2 className="text-xl font-bold">GraphQL Query Generator</h2>

                <label className="block">Query Type:</label>
                <select className="w-full p-2 bg-gray-700 rounded" value={queryType} onChange={e => setQueryType(e.target.value)}>
                    <option value="query">Query</option>
                    <option value="mutation">Mutation</option>
                </select>

                <label className="block">Operation Name:</label>
                <input type="text" className="w-full p-2 bg-gray-700 rounded" placeholder="e.g., getUser" value={operationName} onChange={e => setOperationName(e.target.value)} />

                <label className="block">Fields:</label>
                {fields.map((field, index) => (
                    <div key={index} className="space-y-2">
                        <input type="text" className="w-full p-2 bg-gray-700 rounded" placeholder="e.g., name" value={field.name} onChange={e => updateField(index, e.target.value)} />
                        {field.subFields.map((subField, subIndex) => (
                            <div key={subIndex} className="ml-4">
                                <input type="text" className="w-full p-2 bg-gray-600 rounded" placeholder="Sub-field e.g., email" value={subField.name} onChange={e => updateSubField(index, subIndex, e.target.value)} />
                            </div>
                        ))}
                        <button onClick={() => addSubField(index)} className="bg-blue-700 text-sm px-3 py-1 rounded">+ Add Sub-field</button>
                    </div>
                ))}
                <button onClick={addField} className="bg-blue-600 px-4 py-2 rounded">+ Add Field</button>

                <label className="block">Arguments:</label>
                {argumentsList.map((arg, index) => (
                    <div key={index} className="flex gap-2">
                        <input type="text" className="w-1/2 p-2 bg-gray-700 rounded" placeholder="Argument Name" value={arg.name} onChange={e => updateArgument(index, 'name', e.target.value)} />
                        <input type="text" className="w-1/2 p-2 bg-gray-700 rounded" placeholder="Argument Type" value={arg.type} onChange={e => updateArgument(index, 'type', e.target.value)} />
                    </div>
                ))}
                <button onClick={addArgument} className="bg-green-600 px-4 py-2 rounded">+ Add Argument</button>
            </div>

            {/* Right Side - Real-Time Query Display */}
            <div className="w-full md:w-1/2 bg-gray-900 p-4 rounded-lg">
                <h2 className="text-white text-xl font-bold mb-2">Generated Query</h2>
                <CopyBlock
                    text={generateQuery()}
                    language="graphql"
                    showLineNumbers={true}
                    theme={dracula}
                />
                <button
                    onClick={saveData}
                    disabled={isSaving}
                    className={`mt-4 px-4 py-2 rounded bg-blue-600 text-white ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                >
                    {isSaving ? 'Saving...' : 'Save'}
                </button>
            </div>
        </div>
    );
}