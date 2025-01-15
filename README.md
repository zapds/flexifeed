# FlexiFeed

FlexiFeed is a personalized news feed application that allows users to receive news articles tailored to their interests. The application uses various technologies to fetch, process, and display news articles in a user-friendly manner.

## Tech Stack

- **Frontend**: Svelte, Tailwind CSS
- **Backend**: Node.js, SvelteKit, Flask
- **Database**: SQLite
- **Authentication**: Google OAuth
- **Communication Protocol**: WebSocket for real-time updates
- **APIs**: Google News, OpenAI
- **Other Libraries**: Playwright, gnewsclient, aiosqlite

## Features

- User authentication via Google OAuth
- Personalized news feed based on user settings
- Fast data streaming using WebSocket
- News scraping using Playwright (Firefox)
- Summarization of news articles using OpenAI


## Setup Instructions

### Prerequisites

- Node.js
- Python

### Setup

1. **Clone the repository**:
    ```sh
    git clone https://github.com/zapds/flexifeed.git
    cd flexifeed
    ```

### Backend Setup

2. **Install Python dependencies**:
    ```sh
    pip install -r requirements.txt
    ```

3. **Set up the database**:
    ```sh
    sqlite3 database.db < schema.sql
    ```

4. **Run the Flask server**:
    ```sh
    python app.py
    ```

### Frontend Setup

1. **Install Node.js dependencies**:
    ```sh
    npm install
    ```

2. **Run the development server**:
    ```sh
    npm run dev
    ```

### Environment Variables

Create a .env file in the root directory and add the following environment variables:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-api-key
```

### Running the Application

1. **Start the backend server**:
    ```sh
    python app.py
    ```

2. **Start the frontend server**:
    ```sh
    npm run dev
    ```

3. Open your browser and navigate to `http://localhost:5173/` to access the application.

## Usage

- **Login**: Users can log in using their Google account.
- **Settings**: Users can set their preferred news topics and country.
- **Generate Feed**: Users can generate a personalized news feed based on their settings.
- **Summarize Articles**: Users can select articles to summarize and get a concise summary using OpenAI.

### Author
Narendhar T S (EC24B1053)