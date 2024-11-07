import { useState } from "react"
import { Editor } from "@monaco-editor/react"
import "../../styles/code-editor.css"

const CodeEditor = ({ language, onMount }) => {
    const [value, setValue] = useState("");

    return (
        <div className="editor-container">
            <div className="editor-header">
                <h2>{language}</h2>
            </div>
            <div className="editor-content">
                <Editor
                    theme="vs-light"
                    defaultLanguage="python"
                    language={language}
                    onMount={onMount}
                    defaultValue=""
                    value={value}
                    onChange={(value) => setValue(value)}
                    options={{
                        fontSize: 12,
                        scrollBeyondLastLine: false,
                        minimap: { enabled: false }
                    }}
                />
            </div>
        </div>
    )
}

export default CodeEditor