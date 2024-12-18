import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ReactMarkdown from 'react-markdown';

const QuestionDialog = ({ open, question, onClose }) => {
  if (!question) return null;  // If no problem is selected, return null

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      scroll="paper" 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        style: {
        width: '600px', // Fixed width for the popup
        height: '500px', // Fixed height for the popup
        },
      }}
    >
      <DialogTitle style={{color: 'black', fontSize: 36, fontFamily: 'Poppins', fontWeight: '800', wordWrap: 'break-word'}}>
        {question.title}
        <IconButton aria-label="close" onClick={onClose} style={{position: 'absolute', right: 8, top: 8}}>
          <CloseIcon />
        </IconButton>
                
        <Typography variant="body1" sx={{ marginTop: 1, marginBottom: 1, fontWeight: 'bold', fontFamily: 'Poppins' }}>
          <strong>Topic(s):</strong> {question.topic.join(', ')} &nbsp;&nbsp;&nbsp;&nbsp;
          <strong>Difficulty:</strong> {question.difficulty}
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          overflowY: 'auto',
          maxHeight: '350px',
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

        <ReactMarkdown
          children={question.description}
          components={{
            p: ({ children }) => (
              <Typography variant="body2" sx={{ marginBottom: 2, fontFamily: 'Poppins' }}>
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

      </DialogContent>
    </Dialog>
    );
};

export default QuestionDialog;