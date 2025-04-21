'use client';
import { useState } from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';

export default function QueryGenerator() {
    const [queryType, setQueryType] = useState('query');
    const [operationName, setOperationName] = useState('');
    const [fields, setFields] = useState([{ name: '', subFields: [] }]);
    const [argumentsList, setArgumentsList] = useState([{ name: '', type: '' }]);

    const addField = () => setFields([...fields, { name: '', subFields: [] }]);

    const addSubField = (index) => {
        const newFields = [...fields];
        newFields[index].subFields.push({ name: '', subFields: [] });
        setFields(newFields);
    };

    const updateField = (index, value) => {
        const newFields = [...fields];
        newFields[index].name = value;
        setFields(newFields);
    };

    const updateSubField = (fieldIndex, subIndex, value) => {
        const newFields = [...fields];
        newFields[fieldIndex].subFields[subIndex].name = value;
        setFields(newFields);
    };

    const addArgument = () => setArgumentsList([...argumentsList, { name: '', type: '' }]);

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
            </div>
        </div>
    );
}
