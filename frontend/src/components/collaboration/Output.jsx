import { useState } from 'react';

import codeExecutionService from '../../services/code-execution-service';
import '../../styles/Output.css';

const Output = ({editorRef, language}) => {
    const [output, setOutput] = useState(null);
    const [loading, setLoading] = useState(false);

    const runCode = async () => {
        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return;
        try {
            setLoading(true);
            const {run:result} = await codeExecutionService.executeCode(language, sourceCode);
            setOutput(result.output);
        } catch (error) {
            console.error("Error running code:", error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="output-container" >
            <div className="output-header" >
                <button className='run-button' onClick={runCode} disabled={loading}>
                    {loading ? "Loading..." : "Run"}
                </button>  
            </div>

            <div className="output-content" >
                {output ? output : 'Click "Run" to execute code'}
            </div>
        </div>
    );
}

export default Output;
