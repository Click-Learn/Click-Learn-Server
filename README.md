# Click-Learn-Server
The ClickLearn web app is built on a server backend that powers its core features and functionalities. The server-side code is responsible for managing user authentication, providing personalized learning experiences, serving up topic-based articles, and tracking user progress.

<img width="300px" src="https://user-images.githubusercontent.com/112413505/230037732-7743b5a9-8e2e-43f1-a21e-0cebb31da707.png" />

# Technology Stack
The ClickLearn server backend is built using a combination of popular web development technologies. The stack includes:

• Node.js: a server-side JavaScript runtime environment<br/>
• Express: a fast, minimalist web framework for Node.js<br/>
• MySql: database<br/>
• JSON Web Tokens (JWT): a standard for securely transmitting information between parties as a JSON object
• Google Auth: to verify login

# Architecture
The server backend follows a RESTful API architecture, which allows for easy integration with the front-end web app. The server exposes endpoints that the front-end can use to request and receive data. The API endpoints are responsible for handling authentication, data validation, and serving up content.

# Features
• User Authentication: The server handles user authentication using Passport and JWT. Users can log in with their Google account, and their data is securely stored and accessed through the database.<br/><br/>
• Personalized Learning: The server uses AI learning algorithms to provide users with personalized exercises and content. The algorithms analyze user behavior and adjust the difficulty level and type of exercises accordingly. Additionally, the algorithms analyze the user's preferred topics and provide them with words and exercises related to those topics.<br/><br/>
• Article Serving: The server serves up a selection of topic-based articles for users to read and study. The articles are stored in the database and fetched dynamically based on user preferences and interests.<br/><br/>
• User Progress Tracking: The server tracks user progress over time and stores it in the database. Users can view their progress and performance metrics, such as the number of words learned, the percentage of correct answers, and more.

# Deployment
The server backend is deployed on a cloud platform. The deployment process includes configuring the server environment, setting up the database, and deploying the code to the cloud server.

# Feedback and Support
We are constantly working to improve the ClickLearn server backend and welcome your feedback and suggestions. If you encounter any issues or have any questions, please feel free to contact us at clicklearnapp@gmail.com. We will do our best to respond promptly and provide the support you need.
