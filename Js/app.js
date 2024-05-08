const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const url = "http://localhost:8000/get-image-raw/?x=0&y=0&width=512&height=512"; // Ajusta según tus parámetros

function initOpenJPEG() {
  if (!Module) {
    console.error("Module OpenJPEG not loaded");
    return;
  }

  Module.onRuntimeInitialized = async function () {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      const result = decodeImage(new Uint8Array(buffer));
      displayImage(result);
    } catch (err) {
      console.error("Error fetching or decoding image:", err);
    }
  };
}

function decodeImage(data) {
  const image = Module.ccall(
    "decode",
    "array", // Return type
    ["array"], // Argument types
    [data] // Arguments
  );

  return image;
}

function displayImage(imageData) {
  const { width, height, data } = imageData;
  const imageDataObj = new ImageData(
    new Uint8ClampedArray(data),
    width,
    height
  );
  ctx.putImageData(imageDataObj, 0, 0);
}

initOpenJPEG();
