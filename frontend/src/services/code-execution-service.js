import axios from "axios"

const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston",
})

const getLanguageVersion = async (language) => {
    try {
        const response = await API.get(`/runtimes`)
        const runtimes = response.data;

        const runtime = runtimes.find(runtime => runtime.language.toLowerCase() === language.toLowerCase())

        if (runtime) {
            console.log(`Using version for ${language}: ${runtime.version}`);
            return runtime.version
        } else {
            
            throw new Error(`Language ${language} not found`)
        }
    } catch (error) {
        console.error("Error getting language version:", error)
        throw error

    }
}

const executeCode = async (language, sourceCode) => {
    try {
        const version = await getLanguageVersion(language)
        const response = await API.post("/execute", {
            language,
            version,
            files: [{ content: sourceCode }]
        })
        return response.data
    } catch (error) {
        console.error("Error executing code:", error)
        throw error
    }
}

const replaceTabsWithSpaces = (code, spacesPerTab) => {
    // Replace tabs with the correct number of spaces for indentation
    return code.split('\n').map(line => line.replace(/\t/g, ' '.repeat(spacesPerTab))).join('\n');
};

const cleanInput = (input) => {
    return input.replace(/[\w\s]*=/g, '').trim(); // Remove variable assignments
}

const formatJavaInput = (input) => {
    try {
        // 1. Handle string input: Wrap in double quotes for Java string literal
        if (input.startsWith('"') && input.endsWith('"')) {
            return input; // It's already a valid Java string
        }

        // 2. Handle arrays (e.g., [1, 2, 3] or [2, 3, 5, 1, 3])
        if (input.startsWith("[") && input.endsWith("]")) {
            // For a 1D array
            let arrayElements = input.slice(1, -1).split(",").map(val => val.trim());
            return "new int[]{" + arrayElements.join(", ") + "}";
        }

        // 3. Handle matrix (2D array)
        if (input.startsWith("[[") && input.endsWith("]]")) {
            let matrix = input.slice(2, -2).split("],[").map(row => {
                return "new int[]{" + row.split(",").map(val => val.trim()).join(", ") + "}";
            });
            return "new int[][]{" + matrix.join(", ") + "}";
        }

        // 4. Handle objects (simple key-value pairs, e.g., {"key": "value"})
        if (input.startsWith("{") && input.endsWith("}")) {
            let obj = input.slice(1, -1).split(",").map(pair => {
                let [key, value] = pair.split(":").map(val => val.trim());
                return `"${key}": "${value}"`; // For simple key-value pairs as strings
            });
            return "new HashMap<String, String>{" + obj.join(", ") + "}";
        }

        // 5. Handle numbers (integers, floats)
        if (!isNaN(input)) {
            return input; // Return as a raw number if it's a valid number
        }

        // 6. Handle boolean values (true/false)
        if (input.toLowerCase() === 'true' || input.toLowerCase() === 'false') {
            return input.toLowerCase();
        }

        if (input.startsWith("[") && input.endsWith("]")) {
            let arrayElements = input.slice(1, -1).split(",").map(val => val.trim());
            return "new ArrayList<Integer>(Arrays.asList(" + arrayElements.join(", ") + "))";
        }        

        // If we don't recognize the format, return the input as-is
        return input;
    } catch (error) {
        console.error("Error formatting Java input:", error);
        return input; // Fallback if formatting fails
    }
};

const prepareTestcaseCode = (language, functionName, sourceCode, input) => {
    let codeToExecute;

    if (language === "python") {
        // Python uses 4 spaces per indentation level
        const formattedSourceCode = replaceTabsWithSpaces(sourceCode.trim(), 4);
        codeToExecute = `
${formattedSourceCode}

print(Solution().${functionName}(${input}))
        `;
    } else if (language === "javascript") {
        // JavaScript typically uses 2 spaces per indentation level
        const formattedSourceCode = replaceTabsWithSpaces(sourceCode.trim(), 2);
        const cleanedInput = cleanInput(input);
        codeToExecute = `
${formattedSourceCode}

console.log(${functionName}(${cleanedInput}))
        `;
    } else if (language === "java") {
        // Java uses 4 spaces per indentation level
        const formattedSourceCode = replaceTabsWithSpaces(sourceCode.trim(), 4);
        const cleanedInput = formatJavaInput(cleanInput(input));
        codeToExecute = `
${formattedSourceCode}

System.out.println(new Solution().${functionName}(${cleanedInput}));
        `;
    } else {
        throw new Error(`Unsupported language: ${language}`);
    }

    return codeToExecute;
};

const normalizeOutput = (output) => {
    return output
        .replace(/\s*,\s*/g, ',')
        .replace(/\s*\[\s*/g, '[')
        .replace(/\s*\]\s*/g, ']')
        .replace(/\s*\(\s*/g, '(')
        .replace(/\s*\)\s*/g, ')')
        .replace(/'/g, '"')
        .trim();
};

const executeCodeWithTestcases = async (language, functionName, sourceCode, testCases) => {
    const version = await getLanguageVersion(language)

    const results = await Promise.all(testCases.map(async (testCase) => {
        const { input, expected_output } = testCase;
        const codeToExecute = prepareTestcaseCode(language, functionName, sourceCode, input);

        let retries = 3; // Number of retries before failing
        let delay = 1000; // Initial delay (1 second)

        while (retries > 0) {
            try {
                const response = await API.post("/execute", {
                    language,
                    version,
                    files: [{ content: codeToExecute }]
                });

                const actualOutput = response.data.run.output;

                // Normalize both actual and expected output
                const normalizedActualOutput = normalizeOutput(actualOutput);
                const normalizedExpectedOutput = normalizeOutput(expected_output);

                const isPassed = normalizedActualOutput === normalizedExpectedOutput;
                return { input, expected_output, actualOutput: normalizedActualOutput, isPassed }

            } catch (error) {
                if (error.response && error.response.status === 429) {
                    console.log(`Rate limit exceeded. Retrying in ${delay / 1000} seconds...`);
                    retries -= 1;
                    await new Promise(res => setTimeout(res, delay)); // Wait before retrying
                    delay *= 2; // Exponential backoff: Increase the delay on each retry
                } else {
                    console.error("Error executing code:", error);
                    return { input, expected_output, actualOutput: error.message, isPassed: false }
                }
            }
        }

        return { input, expected_output, actualOutput: "Failed after retries", isPassed: false }
    }));

    return results;
}

const codeExecutionService = { getLanguageVersion, executeCode, executeCodeWithTestcases }

export default codeExecutionService