# Veil

## Veil is an app that automatically blurs faces in videos while keeping the rest of the content intact.

<img src="./frontend/public/VeilA.png" width="300" />

[![Stack icons](https://skillicons.dev/icons?i=ts,next,flask,python,opencv)](https://skillicons.dev)

## Features
- Detects and blurs faces in videos
- Returns the video with blurred faces

## How to Run Locally

### 1. Clone the Repository
Clone this repo to your local machine:
```bash
git clone git@github.com:drshooby/Veil.git
cd Veil
```

### 2. Set up the Frontend
Go to the `frontend` directory, install dependencies, and start the app:
```bash
cd frontend
npm install
npm run dev
```
The frontend will run at `http://localhost:3000`.

### 3. Set up the Backend
Go to the `backend` directory and install Python dependencies:
```bash
cd ../backend
pip install -r requirements.txt
```

Start the backend server:
```bash
python app.py
```
The backend will run at `http://localhost:8080`.

## Usage
1. Upload a video to the frontend.
2. The app will process the video, blur the faces, and generate a new video.
3. Download the video with blurred faces.

## Contributing
Feel free to submit issues or pull requests if you want to contribute!

## License
Veil is open source and available under the MIT License.
