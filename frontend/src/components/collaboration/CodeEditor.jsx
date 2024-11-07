import { useState } from "react"
import { Editor } from "@monaco-editor/react"
import "../../styles/code-editor.css"
import { MenuItem, IconButton, Popper, Paper } from "@mui/material";
import { usePopupState, bindTrigger, bindMenu } from 'material-ui-popup-state/hooks';
import { ArrowDropDown } from "@mui/icons-material";

const CodeEditor = ({ language, onMount }) => {
    const [value, setValue] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState(language);

    const popupState = usePopupState({ variant: 'popover', popupId: 'language-selector' });

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
    };

    return (
        <div className="editor-container">
            <div className="editor-header">
                <div className="language-selector">
                    <IconButton {...bindTrigger(popupState)} sx={{ color: "#FFF", padding: "0"}}>
                        {selectedLanguage} <ArrowDropDown />
                    </IconButton>

                    {/* Popper for dropdown menu */}
                    <Popper {...bindMenu(popupState)} sx={{ zIndex: 2 }}>
                        <Paper>
                            <MenuItem onClick={() => { setSelectedLanguage('python'); popupState.close(); }}>Python</MenuItem>
                            <MenuItem onClick={() => { setSelectedLanguage('javascript'); popupState.close(); }}>JavaScript</MenuItem>
                            <MenuItem onClick={() => { setSelectedLanguage('java'); popupState.close(); }}>Java</MenuItem>
                        </Paper>
                    </Popper>
                </div>
            </div>
            <div className="editor-content">
                <Editor
                    theme="vs-light"
                    defaultLanguage="python"
                    language={selectedLanguage}
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