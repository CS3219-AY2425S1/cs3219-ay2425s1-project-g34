import * as React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Chip, Autocomplete, FormControl } from '@mui/material';
import { topics } from '../../assets/topics';
import ErrorMessage from './ErrorMessageDialog'
import questionService from '../../services/question-service';
import '../../styles/create-question-dialog.css';
import useAuth from '../../hooks/useAuth';

const difficulty_lvl = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' }
];

const CreateQuestion = ({ open, handleClose }) => {
    const { cookies } = useAuth();

    const [difficulty, setDifficulty] = React.useState('Easy'); // Default difficulty
    const [imageFiles, setImageFiles] = React.useState([]); // State to hold image files
    const [errorOpen, setErrorOpen] = React.useState(false); // State to control error dialog visibility
    const [errorMessage, setErrorMessage] = React.useState(''); // State to store error message
    const [selectedTopics, setSelectedTopics] = React.useState([]); // State to store selected topics

    const [defaultCode, setDefaultCode] = React.useState({
        python: '',
        javascript: '',
        java: ''
    });
    const [testCases, setTestCases] = React.useState([]);

    const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
    };

    const handleImageFilesChange = (event) => {
        setImageFiles(event.target.files);
    };

    const handleTopicChange = (event, newValue) => {
        setSelectedTopics(newValue);
    };

    const handleTestCaseChange = (index, field, value) => {
        const updatedTestCases = [...testCases];
        updatedTestCases[index][field] = value;
        setTestCases(updatedTestCases);
    };

    const handleAddTestCase = () => {
        setTestCases([...testCases, { input: '', expected_output: '' }]);
    };

    const handleRemoveTestCase = (index) => {
        const updatedTestCases = testCases.filter((_, i) => i !== index);
        setTestCases(updatedTestCases);
    };

    const handleDefaultCodeChange = (language, event) => {
        setDefaultCode({ ...defaultCode, [language]: event.target.value });
    };

    const handleErrorClose = () => {
        setErrorOpen(false); // Close the error dialog
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        const formElements = event.currentTarget.elements;

        // Append each topic individually
        selectedTopics.forEach(topic => formData.append('topic', topic));

        // Append each image URL individually
        const images = formElements.images.value.split(',').map(image => image.trim());
        images.forEach(image => formData.append('images', image));

        formData.append('title', formElements.title.value);
        formData.append('description', formElements.description.value);
        formData.append('difficulty', difficulty);
        formData.append('examples', formElements.examples.value);
        formData.append('leetcode_link', formElements.leetcode_link.value);
        formData.append('default_code', JSON.stringify(defaultCode));
        formData.append('test_cases', JSON.stringify(testCases));

        // Append image files to formData
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append('imageFiles', imageFiles[i]);
        }

        try {
            await questionService.createQuestion(cookies, formData); // Call the createQuestion function
            window.location.reload();
            handleClose(); // Close the dialog after submission
        } catch (error) {
            setErrorMessage(error.message); // Set error message
            setErrorOpen(true); // Open error dialog
        }
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle className="dialog-title">
                Add New Question
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="title"
                            name="title"
                            label="Title (max 100 characters)"
                            type="text"
                            fullWidth
                            multiline
                            inputProps={{ maxLength: 100 }}
                            className="text-field"
                        />
                        <TextField
                            margin="dense"
                            required
                            id="description"
                            name="description"
                            label="Description (max 3000 characters)"
                            type="text"
                            fullWidth
                            multiline
                            minRows={4}
                            maxRows={16}
                            inputProps={{ maxLength: 3000 }}
                            className="text-field"
                        />

                        <FormControl fullWidth margin="dense">
                            <Autocomplete
                                multiple
                                id="searchable-topics"
                                options={topics}
                                value={selectedTopics}
                                onChange={handleTopicChange}
                                filterSelectedOptions
                                renderTags={(selected, getTagProps) =>
                                    selected.map((option, index) => (
                                    <Chip key={index} label={option} {...getTagProps({ index })} />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Topics"
                                    placeholder="Search for topics"
                                    />
                                )}
                                sx={{ width: '100%' }}
                            />
                        </FormControl>

                        <TextField
                            margin="dense"
                            fullWidth
                            id="difficulty"
                            select
                            label="Difficulty Level"
                            defaultValue="Easy"
                            onChange={handleDifficultyChange}
                            helperText="Select the difficulty level"
                            className="text-field"
                        >
                            {difficulty_lvl.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        {/* Default Code Inputs */}
                        <TextField
                            margin="dense"
                            required
                            id="python_default_code"
                            label="Python Default Code"
                            type="text"
                            fullWidth
                            multiline
                            value={defaultCode.python}
                            onChange={(e) => handleDefaultCodeChange('python', e)}
                            className="text-field"
                        />
                        <TextField
                            margin="dense"
                            required
                            id="javascript_default_code"
                            label="JavaScript Default Code"
                            type="text"
                            fullWidth
                            multiline
                            value={defaultCode.javascript}
                            onChange={(e) => handleDefaultCodeChange('javascript', e)}
                            className="text-field"
                        />
                        <TextField
                            margin="dense"
                            required
                            id="java_default_code"
                            label="Java Default Code"
                            type="text"
                            fullWidth
                            multiline
                            value={defaultCode.java}
                            onChange={(e) => handleDefaultCodeChange('java', e)}
                            className="text-field"
                        />
                        {/* Test Cases */}
                        {testCases.map((testCase, index) => (
                            <div key={index} className="test-case-container">
                                <TextField
                                    margin="dense"
                                    required
                                    label="Test Case Input"
                                    type="text"
                                    fullWidth
                                    value={testCase.input}
                                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                                    className="text-field"
                                />
                                <TextField
                                    margin="dense"
                                    required
                                    label="Test Case Expected Output"
                                    type="text"
                                    fullWidth
                                    value={testCase.expected_output}
                                    onChange={(e) => handleTestCaseChange(index, 'expected_output', e.target.value)}
                                    className="text-field"
                                />
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleRemoveTestCase(index)}
                                    className="remove-test-case-button"
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddTestCase}
                            className="add-test-case-button"
                        >
                            Add Test Case
                        </Button>
                        <TextField
                            margin="dense"
                            id="examples"
                            name="examples"
                            label="Examples (max 1000 characters)"
                            type="text"
                            fullWidth
                            multiline
                            maxRows={16}
                            inputProps={{ maxLength: 1000 }}
                            className="text-field"
                        />
                        <TextField
                            margin="dense"
                            id="images"
                            name="images"
                            label="Images URLs (comma separated)"
                            type="text"
                            fullWidth
                            multiline
                            className="text-field"
                        />
                        <input
                            type="file"
                            id="imageFiles"
                            name="imageFiles"
                            multiple
                            accept="image/jpeg, image/jpg, image/png"
                            onChange={handleImageFilesChange}
                            className="file-input"
                        />
                        <TextField
                            margin="dense"
                            id="leetcode_link"
                            name="leetcode_link"
                            label="Leetcode Link"
                            type="text"
                            fullWidth
                            multiline
                            className="text-field"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} className="dialog-actions">Cancel</Button>
                        <Button type="submit" className="dialog-actions">Add Question</Button>
                    </DialogActions>
                </form>
            </Dialog>

            <ErrorMessage
                open={errorOpen}
                handleClose={handleErrorClose}
                errorMessage={errorMessage}
            />
        </>
    );
};

export default CreateQuestion;