import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ReactMarkdown from 'react-markdown';
import Monaco from "@monaco-editor/react";

const CodeDialog = ({ open, onClose, question, solution, language }) => {
  if (!question) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      scroll="paper"
      maxWidth={false}
      fullWidth
      PaperProps={{
        style: {
        width: '1200px', // Fixed width for the popup
        height: '800px', // Fixed height for the popup
        },
      }}
    >
      <IconButton aria-label="close" onClick={onClose} style={{position: 'absolute', right: 1, top: 1, padding: 1}}>
        <CloseIcon />
      </IconButton>

      <DialogContent
        sx={{
          overflow: 'hidden',
          maxHeight: '750px',
          display: 'flex',
          flex: '1',
        }}
      >

        {/* ===== LEFT HALF ===== */}
        <Box
          sx={{
            height: '100%',
            width: '50%',
            overflowY: 'auto',
            borderRight: '1px solid black',

            // Custom scrollbar styles
            '&::-webkit-scrollbar': {
              width: '10px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#CBCBCB',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555',
            },
          }}
        >
          <DialogTitle style={{color: 'black', fontSize: 30, fontFamily: 'Poppins', fontWeight: '800', wordWrap: 'break-word', paddingLeft: 0}}>
            {question.title}
            <Typography variant="body1" sx={{ marginTop: 1, marginBottom: 1, fontWeight: 'bold', fontFamily: 'Poppins' }}>
              <strong>Topic(s):</strong> {question.topic.join(', ')} &nbsp;&nbsp;&nbsp;&nbsp;
              <strong>Difficulty:</strong> {question.difficulty}
            </Typography>
          </DialogTitle>

          <ReactMarkdown
            children={question.description}
            components={{
              p: ({ children }) => (
                <Typography variant="body2" sx={{ marginBottom: 2, fontFamily: 'Poppins', fontSize: 16 }}>
                  {children}
                </Typography>
              ),
            }}
          />

          {question.images && question.images.length > 0 && (
            <Box sx={{ marginTop: 2 }}>
              {question.images.map((image, index) => (
                <Box key={index} sx={{ textAlign: 'center', marginBottom: 3 }}>
                  <img 
                    src={image} 
                    alt={`Question Image ${index + 1}`}
                    objectfit="contain" 
                    style={{ borderRadius: '5px', maxWidth: '100%', maxHeight: '200px' }}
                  />
                  <Typography variant="body2" sx={{ fontFamily: 'Poppins', marginBottom: 1 }}>
                    Image {index + 1}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>
        
        {/* ===== RIGHT HALF ===== */}
        <Monaco
          height="100%"
          width="50%"
          language={language || 'python'} // default to python
          theme="vs-dark"
          value={solution}
          options={{
            readOnly: true,
            lineNumbers: "on",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 16,
          }}
        />

      </DialogContent>
    </Dialog>
    );
};

export default CodeDialog;