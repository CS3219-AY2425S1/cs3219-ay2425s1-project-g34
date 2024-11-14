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

const codeExecutionService = { getLanguageVersion, executeCode }

export default codeExecutionService