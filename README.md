# Books4All: Library Management Website

**Books4All** is a user-friendly library management website that allows users to manage their book borrowing seamlessly. Users can sign up, log in, and borrow up to **5 books** at a time. The platform is built with modern web technologies, leveraging **Firebase** for database management and **Open Library's API** for fetching book data.

## Features

- **Fully responsive**: The website is designed to be fully responsive to ensure functionality across a variety of devices.
- **State Management**: The application utilizes **Redux Toolkit** for efficient and scalable global state management.
- **Debounced Search Bar**: Applied debouncing for limiting the load on the server.
- **Responsive Styling**: Designed with **Tailwind CSS**, ensuring a sleek, modern, and responsive user interface.
- **Loading Experience**: Implements a **shimmer effect** while loading content, offering a smooth visual experience during data fetching.
- **Infinite Scrolling**: Users can browse search results effortlessly with **infinite scrolling**, enhancing the overall user experience.
- **Authentication**: Secure user authentication through Firebase for seamless login and signup.

## Technologies Used

- **Firebase**: For real-time data storage and authentication.
- **Open Library API**: Fetches up-to-date book data.
- **Redux Toolkit**: Handles application-wide state management.
- **Tailwind CSS**: Provides utility-first CSS for responsive design.
- **React**: For building the interactive UI components.

## Installation

To run this project locally, follow these steps:

1.Clone the repository:
 ```bash
 git clone https://github.com/your-username/books4all.git
  ```

2.Navigate to the project directory 
 ```bash
 cd books4all
 ```

3.Install the dependencies:
 ```bash
  npm install
  ```

4. Set up Firebase credentials and API keys for Open Library in a .env file. Example of .env file content:
  ```bash
  REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_OPEN_LIBRARY_API=your-open-library-api-key
  ```

5.Run the application
```bash
npm start
```


