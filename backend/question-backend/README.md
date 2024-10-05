## Running Question Service (Locally)

1. Open Command Line/Terminal and navigate into the `question-backend` directory.

2. Run the command: `npm install`. This will install all the necessary dependencies.

3. Run the command `npm start` to start the Question Service in production mode, or use `npm run dev` for development mode, which includes features like automatic server restart when you make code changes.

4. Using applications like Postman, you can interact with the User Service on port 4000. If you wish to change this, please update the `.env` file (there is a sample file under `.envsample`).

## Running Question Service (Containerized)

1. Open Command Line/Terminal and navigate into the `question-backend` directory.

2. Run the command: `docker build -t question-backend .`. This will build the Docker Image.

3. Run the command `docker run --name question-service -p 4000:4000 -d question-backend` to run the Question Service in the Docker Container.

4. Alternatively, if you wish to edit your code and see the changes in real-time, you can bind the current working directory to the Docker Container. (Note: Ensure that you have the folder `node_modules` with all the necessary dependencies in your local system. If not `npm install` locally.)

   - For macOS users: run `docker run --name question-service -p 4000:4000 -v $(pwd):/app -d question-backend`
   - For Windows Command Line users: run `docker run --name question-service -p 4000:4000 -v “%cd%:/app” -d question-backend`
   - For Windows Powershell users: run `docker run --name question-service -p 4000:4000 -v ${PWD}:/app -d question-backend`

5. To stop and remove the Docker Container, run `docker stop question-service` and `docker rm question-service`

## Question Service API Guide

### Create Question

- This endpoint allows adding a new question to the database.
- HTTP method: `POST`
- Endpoint: `http://localhost:4000/api/questions`
- Body

  - Required: `title` (string), `description` (string), `topic` (string array), `difficulty` (string), `input` (mixed), `expected_output` (mixed)
  - Optional: `images` (string array), `leetcode_link` (string)

    ```json
    {
      "title": "Random Question",
      "description": "Random Question Description",
      "topic": ["Algorithms", "Database"],
      "difficulty": "Medium",
      "input": ["1", "2", "3"],
      "expected_output": [1, 2, 3],
      "images": [
        "https://assets.leetcode.com/uploads/2018/12/07/circularlinkedlist.png"
      ],
      "leetcode_link": "https://leetcode.com/problems/linked-list-cycle/"
    }
    ```

- Headers

  - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

  - Explanation: This endpoint requires the client to include a JWT (JSON Web Token) in the HTTP request header for authentication and authorization. This token is generated during the authentication process (i.e., login) and contains information about the user's identity. The server verifies this token to ensure that the client is authorized to access the data.

  - Auth Rules:
    - Admin users: Can create new question. The server verifies the user associated with the JWT token is an admin user and allows creating new question.
    - Non-admin users: Not allowed access.

- Responses:

  | Response Code               | Explanation                                                   |
  | --------------------------- | ------------------------------------------------------------- |
  | 201 (Created)               | Question created successfully, created question data returned |
  | 400 (Bad Request)           | Missing or wrong fields                                       |
  | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT              |
  | 403 (Forbidden)             | Access denied for non-admin users creating new question       |
  | 409 (Conflict)              | Duplicate title encountered                                   |
  | 500 (Internal Server Error) | Database or server error                                      |

### Get Question

- This endpoint allows retrieval of a single question from the database using the question's ID.
- HTTP method: `GET`
- Endpoint: `http://localhost:4000/api/questions/${questionId}`

- Parameters

  - Required: `questionId` path parameter
  - Example: `http://localhost:4000/api/questions/66f56debce5843e0172cb1bb`

- Headers

  - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

- Responses:

  | Response Code               | Explanation                                      |
  | --------------------------- | ------------------------------------------------ |
  | 200 (OK)                    | Success, question data returned                  |
  | 400 (Bad Request)           | Missing or wrong field (question ID)             |
  | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT |
  | 404 (Not Found)             | Question with specified ID not found             |
  | 500 (Internal Server Error) | Database or server error                         |

### Get All Questions (with Filter)

- This endpoint allows retrieval of all questions from the database or a subset of questions based on their topic/difficulty.
- HTTP method: `GET`
- Endpoint to get all questions: `http://localhost:4000/api/questions`
- Endpoint to filter questions: `http://localhost:4000/api/questions?${category}=${filter}`
- Parameters

  - Optional: `category` and `filter` path parameters
  - Examples:
    - `http://localhost:4000/api/questions/`
    - `http://localhost:4000/api/questions?topic=Algorithms&difficulty=Hard`
    - `http://localhost:4000/api/questions?topic=Algorithms&topic=Strings`

- Headers

  - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`

- Responses:

  | Response Code               | Explanation                                      |
  | --------------------------- | ------------------------------------------------ |
  | 200 (OK)                    | Success, question data returned                  |
  | 400 (Bad Request)           | Missing or wrong field                           |
  | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT |
  | 500 (Internal Server Error) | Database or server error                         |

### Update Question

- This endpoint allows updating a question and their related data in the database using the question's ID.
- HTTP Method: `PUT`
- Endpoint: `http://localhost:4000/api/questions/${questionId}`
- Parameters

  - Required: `questionId` path parameter

- Body

  - At least one of the following fields is required: `title` (string), `description` (string), `topic` (string array), `difficulty` (string), `input` (mixed), `expected_output` (mixed), `images` (string array), `leetcode_link` (string)

    ```json
    {
      "title": "Edited Question",
      "description": "Newly edited description",
      "topic": ["Data Structures"],
      "difficulty": "Hard",
      "input": "xyz",
      "expected_output": "zyx",
      "images": "https://i.pinimg.com/736x/4e/fe/44/4efe44e6acdf1c4cb638f9b424e28eed.jpg",
      "leetcode_link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
    ```

- Headers

  - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
  - Auth Rules:
    - Admin users: Can update question data. The server verifies the user associated with the JWT token is an admin user and allows updating of question data.
    - Non-admin users: Not allowed access.

- Responses:

  | Response Code               | Explanation                                                   |
  | --------------------------- | ------------------------------------------------------------- |
  | 200 (OK)                    | Question updated successfully, updated question data returned |
  | 400 (Bad Request)           | Missing or wrong fields                                       |
  | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT              |
  | 403 (Forbidden)             | Access denied for non-admin users updating question data      |
  | 404 (Not Found)             | Question with specified ID not found                          |
  | 409 (Conflict)              | Duplicate title encountered                                   |
  | 500 (Internal Server Error) | Database or server error                                      |

### Delete Question

- This endpoint allows deletion of a question and their related data from the database using the question's ID.
- HTTP Method: `DELETE`
- Endpoint: `http://localhost:4000/api/questions/${questionId}`
- Parameters

  - Required: `questionId` path parameter

- Headers

  - Required: `Authorization: Bearer <JWT_ACCESS_TOKEN>`
  - Auth Rules:
    - Admin users: Can delete question data. The server verifies the user associated with the JWT token is an admin user and allows deleting of question data.
    - Non-admin users: Not allowed access.

- Responses:

  | Response Code               | Explanation                                                   |
  | --------------------------- | ------------------------------------------------------------- |
  | 200 (OK)                    | Question deleted successfully, deleted question data returned |
  | 400 (Bad Request)           | Missing or wrong fields                                       |
  | 401 (Unauthorized)          | Access denied due to missing/invalid/expired JWT              |
  | 403 (Forbidden)             | Access denied for non-admin users deleting question data      |
  | 404 (Not Found)             | Question with specified ID not found                          |
  | 500 (Internal Server Error) | Database or server error                                      |
