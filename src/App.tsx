import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import Footer from "./Footer";

const URL: string = import.meta.env.VITE_API_ENDPOINT;

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [prediction, setPrediction] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    handleClear();

    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (canvas) {
      const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
      let isDrawing: boolean = false;
      let lastX: number = 0;
      let lastY: number = 0;

      const startDrawing = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        isDrawing = true;
        [lastX, lastY] = getCoordinates(e);
      };

      const draw = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        if (!isDrawing) return;
        if (!ctx) return;

        ctx.strokeStyle = "black";
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 1;

        const [currentX, currentY] = getCoordinates(e) as [number, number];

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        [lastX, lastY] = [currentX, currentY];
      };

      const stopDrawing = () => {
        isDrawing = false;
      };

      const getCoordinates = (e: MouseEvent | TouchEvent): [number, number] => {
        let clientX: number | undefined, clientY: number | undefined;
        if (e instanceof MouseEvent) {
          clientX = e.clientX;
          clientY = e.clientY;
        } else if (e instanceof TouchEvent) {
          clientX = e.touches[0]?.clientX;
          clientY = e.touches[0]?.clientY;
        }
        const { left, top }: DOMRect = canvas.getBoundingClientRect();
        const scaleX: number = canvas.width / (canvas.offsetWidth * 12);
        const scaleY: number = canvas.height / (canvas.offsetHeight * 12);
        return [
          clientX ? (clientX - left) * scaleX : 0,
          clientY ? (clientY - top) * scaleY : 0,
        ];
      };

      canvas.addEventListener("mousedown", startDrawing);
      canvas.addEventListener("mousemove", draw);
      canvas.addEventListener("mouseup", stopDrawing);

      canvas.addEventListener("touchstart", startDrawing);
      canvas.addEventListener("touchmove", draw);
      canvas.addEventListener("touchend", stopDrawing);
    }
  }, []);

  //click save
  const handleSaveImage = () => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (canvas) {
      // Retrieve the modified base64 image data
      const imageDataURL: string = canvas.toDataURL("image/png");

      // Create a link element
      const link: HTMLAnchorElement = document.createElement("a");
      link.href = imageDataURL;
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

      // Set the loading state to true
      setLoading(true);

      // Make the POST request using axios
      axios
        .post(
          URL,
          { image: base64Data },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          // Handle the response from the server
          const prediction: string = response.data;
          setPrediction(prediction);
        })
        .catch((error) => {
          console.log("Error:", error);
        })
        .finally(() => {
          // Set the loading state to false after the request completes
          setLoading(false);
        });
    }
  };

  const handleClear = () => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (canvas) {
      const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
      // Retrieve the canvas content
      const imageData: ImageData | null =
        ctx && ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels: Uint8ClampedArray | null = imageData && imageData.data;

      //PIXELS CONTAINS THE ONE DIMENSIONAL ARRAY OF PIXELS IN THE IMAGE, BUT EACH PIXEL IS REPRESENTED BY 4 CONSECUTIVE ELEMENTS FOR RGBA
      //EXAMPLE: 10 X 10 = 100 PIXELS TOTAL, EACH PIXEL IS REPRESENTED BY 4 CONSECUTIVE ELEMENTS FOR ITS RGBA SO 100 X 4 = 400

      // Iterate over each pixel
      for (let i = 0; pixels != null && i < pixels.length; i += 1) {
        pixels[i] = 255;
      }
      // Put the modified image data back to the canvas
      if (imageData) {
        ctx && ctx.putImageData(imageData, 0, 0);
      }
    }
  };

  return (
    <>
      <div className="title">
        Let's test how good you are at writing numbers!!
      </div>
      <div className="instruction">
        Draw one digit only on the canvas and then click <strong>Guess</strong> and wait.
      </div>
      <div className="canvas-container">
        <canvas ref={canvasRef} width={28} height={28} />
      </div>
      <div className="save-container">
        <button className="save" onClick={handleSaveImage}>
          Save Image
        </button>
        <button className="predict" onClick={handlePrediction}>
          Guess
        </button>
        <button className="clear" onClick={handleClear}>
          Clear
        </button>
      </div>
      <div className="output-container">

      {loading ? (
          <h1>Loading...</h1>
        ) : (
          <h1 className="prediction">{prediction}</h1>
        )}
      </div>

      <Footer></Footer>
  
    </>
  );
};

export default App;
