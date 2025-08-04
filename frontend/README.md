# Beat Chaser Frontend

A Next.js frontend application that communicates with the Beat Chaser Spring Boot backend via WebSocket and REST API.

## Features

- Real-time WebSocket communication with the backend
- Game session management (start/join games)
- Message display and logging
- Modern UI with Tailwind CSS
- TypeScript support

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Running Beat Chaser backend on `http://localhost:8080`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Connect to Backend**: The frontend will automatically attempt to connect to the WebSocket server at `ws://localhost:8080/ws`

2. **Start a Game**: Click "Start Single Player Game" to create a new game session

3. **Join a Game**: Enter a game session ID and click "Join Game Session"

4. **Send Test Messages**: Use the "Send Test Message" button to test WebSocket communication

5. **View Messages**: All WebSocket messages and API responses are displayed in the Messages panel

## API Endpoints Used

- `POST /api/session/start/singleplayer` - Start a new single player game
- `POST /api/session/join-game` - Join an existing game session

## WebSocket Topics

- `/topic/messages` - General messages
- `/topic/game` - Game-specific updates
- `/topic/errors` - Error messages

## WebSocket Destinations

- `/app/join-game` - Join a game session
- `/app/guess` - Submit a guess
- `/app/skip` - Skip current round
- `/app/message` - Send test messages

## Development

The application uses:
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **STOMP.js** for WebSocket communication
- **Socket.io-client** (installed but not used - backend uses STOMP)

## Project Structure

```
src/
├── app/
│   └── page.tsx          # Main page component
├── components/
│   ├── GameControls.tsx  # Game control panel
│   └── MessageDisplay.tsx # Message display component
└── services/
    └── websocketService.ts # WebSocket service
```

## Troubleshooting

1. **WebSocket Connection Failed**: Ensure the backend is running on port 8080
2. **CORS Errors**: The backend should have CORS configured to allow requests from `http://localhost:3000`
3. **STOMP Errors**: Check that the backend WebSocket endpoint is accessible at `/ws`

## Building for Production

```bash
npm run build
npm start
```
