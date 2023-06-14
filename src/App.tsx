import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

// const URL = import.meta.env.REACT_APP_API_ENDPOINT 
const URL : string = import.meta.env.VITE_API_ENDPOINT

// const URL = "shit"
const App: React.FC = () => {
  

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [prediction, setPrediction] = useState<string>("")

  useEffect(() => {
    
    handleClear()
    // Get the canvas element from the ref
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (canvas) {
      // Get the 2D rendering context
      const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

      // Initialize variables for drawing
      let isDrawing: boolean = false; // Flag to track if drawing is in progress
      let lastX:number = 0; // Last known X coordinate
      let lastY:number = 0; // Last known Y coordinate

      // Start drawing when mouse button is pressed down
      const startDrawing = (e: MouseEvent) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY]; // Update last known coordinates
      };

      // Draw lines as the mouse moves
      const draw = (e: MouseEvent) => {
        if (!isDrawing) return; // Exit if not currently drawing
        if (!ctx) return; // Exit if no context available

        // Set drawing style
        ctx.strokeStyle = "black";
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 1;

        // Start a new path and draw a line from last coordinates to current coordinates
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

        [lastX, lastY] = [e.offsetX, e.offsetY]; // Update last known coordinates
      };

      // Stop drawing when mouse button is released
      const stopDrawing = () => {
        isDrawing = false;
      };

      // Add event listeners for mouse events
      canvas.addEventListener("mousedown", startDrawing);
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("mouseup", stopDrawing);
    }
  }, []);

  //click save
  const handleSaveImage = () =>  {
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (canvas) {

    // Retrieve the modified base64 image data
    const imageDataURL:string = canvas.toDataURL("image/png");
  
      // Create a link element
      const link:HTMLAnchorElement = document.createElement("a");
      link.href = imageDataURL  ;
      link.download = "drawing.png";

      // Trigger a download
      link.click();
    }
  };
  
  const handlePrediction = () => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (canvas) {
      // Retrieve the canvas content as base64 string
      const base64Data: string = canvas.toDataURL("image/png");

      // Make the POST request using axios
      axios.post(URL, {image:base64Data}, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        // Handle the response from the server
        const prediction: string = response.data;
        setPrediction(prediction);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
    
    
    }
  }
  

  const handleClear = ()=>{
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (canvas) {
    const ctx:CanvasRenderingContext2D | null = canvas.getContext("2d") 
    // Retrieve the canvas content
    const imageData:ImageData | null =ctx && ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels:Uint8ClampedArray | null =imageData && imageData.data;

    //PIXELS CONTAINS THE ONE DIMENSIONAL ARRAY OF PIXELS IN THE IMAGE, BUT EACH PIXEL IS REPRESENTED BY 4 CONSECUTIVE ELEMENTS FOR RGBA
    //EXAMPLE: 10 X 10 = 100 PIXELS TOTAL, EACH PIXEL IS REPRESENTED BY 4 CONSECUTIVE ELEMENTS FOR ITS RGBA SO 100 X 4 = 400

    // Iterate over each pixel
    for (let i = 0;pixels != null && i < pixels.length; i += 1) {
        pixels[i] = 255;
    }
    // Put the modified image data back to the canvas
    if(imageData){
      ctx && ctx.putImageData(imageData, 0, 0);
    }

    
  }
}

  return (
    <>
      <div className="title">Let's test how good you are at writing numbers!!</div>
      <div className="instruction">Draw one digit only on the canvas and then click Predict and wait.</div>
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={28}
          height={28}
        />
      </div>
      <div className="save-container">
        <button className="save" onClick={handleSaveImage}>Save Image</button>
         <button className="predict" onClick={handlePrediction}>Predict</button>
         <button className="clear" onClick={handleClear}>Clear</button>
      </div>
      <div className="output-container">
        <h1 className="prediction">{prediction}</h1>
      </div>
      {/* <img src={base64} alt="base64" className="hey"/> */}
    </>


  );
};

export default App;
