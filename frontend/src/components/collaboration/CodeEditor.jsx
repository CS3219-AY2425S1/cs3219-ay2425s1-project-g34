import { useState, useEffect, useRef } from "react";
import { Editor, loader } from "@monaco-editor/react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import "../../styles/code-editor.css";

const CodeEditor = ({ language, onMount }) => {
    const [value, setValue] = useState("");
    const [theme, setTheme] = useState("vs-light");
    const [anchorEl, setAnchorEl] = useState(null);

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        setAnchorEl(null);
        console.log("Theme changed to", theme);
    };

    // For custom themes
    useEffect(() => {
        loader.init().then((monacoInstance) => {
            // Define Solarized Dark Theme
            monacoInstance.editor.defineTheme("solarized-dark", {
                base: "vs-dark",
                inherit: true,
                rules: [
                    { background: "002b36" },
                    { token: "comment", foreground: "657b83", fontStyle: "italic" },
                    { token: "string", foreground: "2aa198" },
                    { token: "variable", foreground: "b58900" },
                    { token: "keyword", foreground: "859900", fontStyle: "bold" },
                ],
                colors: {
                    "editor.background": "#002b36",
                    "editor.lineHighlightBackground": "#073642",
                    "editor.selectionBackground": "#586e75",
                },
            });

            // Define Solarized Light Theme
            monacoInstance.editor.defineTheme("solarized-light", {
                base: "vs",
                inherit: true,
                rules: [
                    { background: "fdf6e3" },
                    { token: "comment", foreground: "93a1a1", fontStyle: "italic" },
                    { token: "string", foreground: "2aa198" },
                    { token: "variable", foreground: "b58900" },
                    { token: "keyword", foreground: "859900", fontStyle: "bold" },
                ],
                colors: {
                    "editor.background": "#fdf6e3",
                    "editor.lineHighlightBackground": "#eee8d5",
                    "editor.selectionBackground": "#d33682",
                },
            });

            // Define Dracula Theme
            monacoInstance.editor.defineTheme("dracula", {
                base: "vs-dark",
                inherit: true,
                rules: [
                    { background: "282a36" },
                    { token: "comment", foreground: "6272a4", fontStyle: "italic" },
                    { token: "string", foreground: "f1fa8c" },
                    { token: "variable", foreground: "50fa7b" },
                    { token: "keyword", foreground: "ff79c6", fontStyle: "bold" },
                    { token: "number", foreground: "bd93f9" },
                ],
                colors: {
                    "editor.background": "#282a36",
                    "editor.lineHighlightBackground": "#44475a",
                    "editor.selectionBackground": "#44475a",
                },
            });

            // Define Monokai Theme
            monacoInstance.editor.defineTheme("monokai", {
                base: "vs-dark",
                inherit: true,
                rules: [
                    { background: "272822" },
                    { token: "comment", foreground: "75715e", fontStyle: "italic" },
                    { token: "string", foreground: "e6db74" },
                    { token: "variable", foreground: "f8f8f2" },
                    { token: "keyword", foreground: "f92672", fontStyle: "bold" },
                    { token: "number", foreground: "ae81ff" },
                ],
                colors: {
                    "editor.background": "#272822",
                    "editor.lineHighlightBackground": "#49483e",
                    "editor.selectionBackground": "#49483e",
                },
            });

            // Define Nord Theme
            monacoInstance.editor.defineTheme("nord", {
                base: "vs-dark",
                inherit: true,
                rules: [
                    { background: "2e3440" },
                    { token: "comment", foreground: "4c566a", fontStyle: "italic" },
                    { token: "string", foreground: "a3be8c" },
                    { token: "variable", foreground: "d8dee9" },
                    { token: "keyword", foreground: "81a1c1", fontStyle: "bold" },
                    { token: "number", foreground: "b48ead" },
                ],
                colors: {
                    "editor.background": "#2e3440",
                    "editor.lineHighlightBackground": "#3b4252",
                    "editor.selectionBackground": "#4c566a",
                },
            });

            monacoInstance.editor.setTheme(theme);
        });
    }, [theme]);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <div className="editor-container">
            <div className="editor-header">
                <h2>{language}</h2>
                <IconButton onClick={handleMenuClick} style={{ color: "white" }}>
                    <SettingsIcon/>
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() => handleThemeChange("vs-light")}>Light</MenuItem>
                    <MenuItem onClick={() => handleThemeChange("vs-dark")}>Dark</MenuItem>
                    <MenuItem onClick={() => handleThemeChange("hc-black")}>High Contrast</MenuItem>
                    <MenuItem onClick={() => handleThemeChange("solarized-dark")}>Solarized Dark</MenuItem>
                    <MenuItem onClick={() => handleThemeChange("solarized-light")}>Solarized Light</MenuItem>
                    <MenuItem onClick={() => handleThemeChange("dracula")}>Dracula</MenuItem>
                    <MenuItem onClick={() => handleThemeChange("monokai")}>Monokai</MenuItem>
                    <MenuItem onClick={() => handleThemeChange("nord")}>Nord</MenuItem>
                </Menu>
            </div>
            <div className="editor-content">
                <Editor
                    theme={theme}
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
    );
};

export default CodeEditor;