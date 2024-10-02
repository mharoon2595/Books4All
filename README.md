Books4All: Library Management Website
Books4All is a user-friendly library management website that allows users to manage their book borrowing seamlessly. Users can sign up, log in, and borrow up to 5 books at a time. The platform is built with modern web technologies, leveraging Firebase for database management and Open Library's API for fetching book data.

Features
State Management: The application utilizes Redux Toolkit for efficient and scalable global state management.
Responsive Styling: Designed with Tailwind CSS, ensuring a sleek, modern, and responsive user interface.
Loading Experience: Implements a shimmer effect while loading content, offering a smooth visual experience during data fetching.
Infinite Scrolling: Users can browse search results effortlessly with infinite scrolling, enhancing the overall user experience.
Authentication: Secure user authentication through Firebase for seamless login and signup.
Technologies Used
Firebase: For real-time data storage and authentication.
Open Library API: Fetches up-to-date book data.
Redux Toolkit: Handles application-wide state management.
Tailwind CSS: Provides utility-first CSS for responsive design.
React: For building the interactive UI components.
Installation
To run this project locally, follow these steps:

Clone the repository:
bash
Copy code
git clone https://github.com/your-username/books4all.git
Navigate to the project directory:
bash
Copy code
cd books4all
Install the dependencies:
bash
Copy code
npm install
Set up Firebase credentials and API keys for Open Library in a .env file.
Run the application:
bash
Copy code
npm start
