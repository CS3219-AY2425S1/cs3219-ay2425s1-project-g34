import * as React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Chip, Autocomplete, FormControl } from '@mui/material';
import { topics } from '../../assets/topics';
import ErrorMessage from './ErrorMessageDialog';
import questionService from '../../services/question-service';
import '../../styles/create-question-dialog.css';
import useAuth from '../../hooks/useAuth';

const difficulty_lvl = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' }
];

const EditQuestion = ({ open, handleClose, question }) => {
    const { cookies } = useAuth();

    const [questionData, setQuestionData] = React.useState({
      title: question?.title || '',
      description: question?.description || '',
      topic: question?.topic.join(', ') || '', // Convert array to comma-separated string
      difficulty: question?.difficulty || 'Easy',
      examples: question?.examples || '',
      images: question?.images?.join(', ') || '', // Assuming images is an array, convert to comma-separated string
      leetcode_link: question?.leetcode_link || ''
    });

    const [defaultCode, setDefaultCode] = React.useState({
        python: question?.default_code?.python || '',
        javascript: question?.default_code?.javascript || '',
        java: question?.default_code?.java || ''
    });

    const [testCases, setTestCases] = React.useState(question?.test_cases || []);
    const [imageFiles, setImageFiles] = React.useState([]);
    const [errorOpen, setErrorOpen] = React.useState(false); // State to control error dialog visibility
    const [errorMessage, setErrorMessage] = React.useState(''); // State to store error message

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setQuestionData({ ...questionData, [name]: value });
    };

    const handleTopicChange = (event, newValue) => {
        setQuestionData({ ...questionData, topic: newValue.join(', ') });
    };

    const handleDifficultyChange = (event) => {
      setQuestionData({ ...questionData, difficulty: event.target.value });
    };

    const handleImageFilesChange = (event) => {
      setImageFiles(event.target.files);
    };

    const handleDefaultCodeChange = (language, event) => {
        setDefaultCode({ ...defaultCode, [language]: event.target.value });
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

    const handleErrorClose = () => {
      setErrorOpen(false); // Close the error dialog
    };

    const handleSubmit = async (event) => {
      event.preventDefault();

      const updatedQuestionData = {
          ...questionData,
          topic: questionData.topic.split(',').map((t) => t.trim()), // Convert topics back to array
          images: questionData.images.split(',').map((img) => img.trim()), // Convert images back to array
          default_code: JSON.stringify(defaultCode),
          test_cases: JSON.stringify(testCases)
      };

      console.log(updatedQuestionData.test_cases)
  
      const formData = new FormData();
      for (const key in updatedQuestionData) {
          if (Array.isArray(updatedQuestionData[key])) {
              updatedQuestionData[key].forEach(item => formData.append(key, item));
          } else {
              formData.append(key, updatedQuestionData[key]);
          }
      }

      for (let i = 0; i < imageFiles.length; i++) {
          formData.append('imageFiles', imageFiles[i]);
      }
  
      try {
          await questionService.updateQuestion(question._id, cookies, formData); // Assuming updateQuestion handles the API request for updating
          window.location.reload(); // Refresh the page after the update
          handleClose();
      } catch (error) {
          setErrorMessage(error.message); // Set error message
          setErrorOpen(true); // Open error dialog
      }
    };
    
    return (
      <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle className="dialog-title">Edit Question</DialogTitle>
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
              value={questionData.title}
              onChange={handleInputChange}
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
              value={questionData.description}
              onChange={handleInputChange}
              className="text-field"
            />
            
            <FormControl fullWidth margin="dense">
              <Autocomplete
                  multiple
                  id="searchable-topics"
                  options={topics}
                  value={questionData.topic.split(',').map((t) => t.trim())}
                  onChange={handleTopicChange}
                  filterSelectedOptions
                  renderTags={(selected, getTagProps) =>
                    selected.length > 0
                      ? selected.map((option, index) => (
                          <Chip key={index} label={option} {...getTagProps({ index })} />
                        ))
                      : null // Don't render anything if no topics are selected
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
                  isOptionEqualToValue={(option, value) => option === value} // Ensure equality checks
                  clearOnEscape
              />
          </FormControl>

            <TextField
              margin="dense"
              fullWidth
              id="difficulty"
              select
              label="Difficulty Level"
              value={questionData.difficulty}
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
              value={questionData.examples}
              onChange={handleInputChange}
              className="text-field"
            />
            <TextField
              margin="dense"
              id="images"
              name="images"
              label="Images (URLs)"
              type="text"
              fullWidth
              multiline
              value={questionData.images}
              onChange={handleInputChange}
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
              value={questionData.leetcode_link}
              onChange={handleInputChange}
              className="text-field"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} className="dialog-actions">Cancel</Button>
            <Button type="submit" className="dialog-actions">Update Question</Button>
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

export default EditQuestion;
