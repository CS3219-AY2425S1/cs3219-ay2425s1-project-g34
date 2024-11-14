import { useState } from 'react';

import codeExecutionService from '../../services/code-execution-service';
import '../../styles/Testcase.css';

const Testcases = ({functionName, testCases, editorRef, language}) => {
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const runAllTestcases = async () => {
        if (language === "java") {
        alert("Testcases are not supported for Java language yet.\nCOMING SOON!");
            return;
        }

        const sourceCode = editorRef.current.getValue();
        if (!sourceCode || !testCases || testCases.length == 0) return;

        setLoading(true);
        try {
            const results = await codeExecutionService.executeCodeWithTestcases(language, functionName, sourceCode, testCases);
            setTestResults(results);
        } catch (error) {
            console.error("Error running testcases:", error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="testcase-container">
            {/* Test Button */}
            <div className="testcase-header">
                <button className='run-button' onClick={runAllTestcases} disabled={loading}>
                    {loading ? "Running..." : "Run Testcases"}
                </button>
            </div>

            {/* Results Table */}
            <div className="testcase-table">
                {testResults.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Input</th>
                                <th>Expected Output</th>
                                <th>Actual Output</th>
                                <th>Result</th>
                            </tr>
                        </thead>
                        <tbody>
                            {testResults.map((result, index) => (
                                <tr key={index}>
                                    <td>{result.input}</td>
                                    <td>{result.expected_output}</td>
                                    <td>{result.actualOutput}</td>
                                    <td>{result.isPassed ? "Passed" : "Failed"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )

}

export default Testcases;
