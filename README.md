# Digit Recognition App

A modern web application that recognizes handwritten digits using machine learning. Draw a digit on the canvas and get real-time predictions powered by a TensorFlow model deployed on Google Cloud Functions.

## 🚀 Features

- **Interactive Canvas**: Draw digits with mouse or touch support
- **Real-time Recognition**: Get instant predictions from 0-9
- **Save Functionality**: Download your drawings as PNG images
- **Responsive Design**: Works on desktop and mobile devices
- **Machine Learning**: Powered by TensorFlow model trained on MNIST dataset (60,000 handwritten digits)
- **Serverless Backend**: Google Cloud Functions for scalable predictions

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Custom CSS
- **HTTP Client**: Axios
- **Backend**: Google Cloud Functions
- **ML Model**: TensorFlow (MNIST dataset)
- **Image Processing**: Canvas API + OpenCV (server-side)

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (version 16 or higher)
- npm or yarn package manager
- A Google Cloud Function endpoint for digit recognition

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd digit-recognition
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_ENDPOINT=your_google_cloud_function_url
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🎯 Usage

1. **Draw a Digit**: Use your mouse or finger to draw a single digit (0-9) on the canvas
2. **Get Prediction**: Click the "Guess" button to send your drawing to the ML model
3. **View Result**: The predicted digit will appear below the canvas
4. **Save Image**: Use the "Save Image" button to download your drawing
5. **Clear Canvas**: Click "Clear" to start over

## 📁 Project Structure

```
digit-recognition/
├── public/
│   └── vite.svg                 # Vite logo
├── src/
│   ├── App.tsx                  # Main application component
│   ├── Footer.tsx               # Footer component
│   ├── index.css                # Global styles
│   ├── main.tsx                 # Application entry point
│   └── vite-env.d.ts           # Vite type definitions
├── index.html                   # HTML template
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # Project documentation
```

## ⚙️ Environment Configuration

The application requires the following environment variable:

- `VITE_API_ENDPOINT`: URL of your Google Cloud Function that handles digit recognition

Example:
```env
VITE_API_ENDPOINT=https://your-region-your-project.cloudfunctions.net/predict-digit
```

## 🔨 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Canvas Configuration

The drawing canvas is configured with:
- **Size**: 28x28 pixels (scaled by factor of 12 for display = 336x336px)
- **Line Width**: 30px for clear digit drawing
- **Color**: Black on white background
- **Format**: PNG for image export

## 🤖 API Integration

The app sends POST requests to the Google Cloud Function with:
```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

The server responds with the predicted digit as a string.

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your preferred hosting service:
   - Vercel
   - Netlify
   - GitHub Pages
   - Firebase Hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 👨‍💻 Author

Created by @nald

---

**Note**: This project requires a separate Google Cloud Function for the machine learning backend. The frontend sends base64-encoded images to the serverless function, which processes them using TensorFlow and OpenCV to return digit predictions.
