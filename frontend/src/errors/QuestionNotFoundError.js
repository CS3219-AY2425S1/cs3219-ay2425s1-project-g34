class QuestionNotFoundError extends Error {
    constructor(message = "No question found for the specified topic and difficulty.") {
        super(message);
        this.name = "QuestionNotFoundError";
    }
}

export default QuestionNotFoundError;
