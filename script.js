let w = window.innerWidth;
let h = window.innerHeight;
let vw, vh;
const videoElement = document.querySelector(".input_video");
const canvasElement = document.querySelector(".output_canvas");
const ctx = canvasElement.getContext("2d");
let dc = document.getElementById("draw");
let oc = document.getElementById("overlay");
videoElement.addEventListener("play", () => {
  setTimeout(() => {
    document.getElementById("spinner").remove();
  }, 5000);
});
videoElement.addEventListener("loadedmetadata", (e) => {
  vw = videoElement.videoWidth;
  vh = videoElement.videoHeight;
  canvasElement.width = vw;
  canvasElement.height = vh;
  dc.width = vw;
  dc.height = vh;
  oc.width = vw;
  oc.height = vh;
});

document.getElementById("redButton").addEventListener("click", function () {
  color("red");
  updateButtonStyle("redButton");
});
document.getElementById("orangeButton").addEventListener("click", function () {
  color("orange");
  updateButtonStyle("orangeButton");
});
document.getElementById("yellowButton").addEventListener("click", function () {
  color("yellow");
  updateButtonStyle("yellowButton");
});
document.getElementById("greenButton").addEventListener("click", function () {
  color("green");
  updateButtonStyle("greenButton");
});
document.getElementById("blueButton").addEventListener("click", function () {
  color("blue");
  updateButtonStyle("blueButton");
});
document.getElementById("purpleButton").addEventListener("click", function () {
  color("purple");
  updateButtonStyle("purpleButton");
});
document.getElementById("pinkButton").addEventListener("click", function () {
  color("pink");
  updateButtonStyle("pinkButton");
});
document.getElementById("blackButton").addEventListener("click", function () {
  color("black");
  updateButtonStyle("blackButton");
});
document.getElementById("whiteButton").addEventListener("click", function () {
  color("white");
  updateButtonStyle("whiteButton");
});

let octx = oc.getContext("2d");
let dctx = dc.getContext("2d");
let x, y, px, py;

function updateButtonStyle(selectedButtonId) {
  // Reset border for all buttons
  const buttonIds = ["redButton", "orangeButton", "yellowButton", "greenButton", "blueButton", "purpleButton", "pinkButton", "blackButton", "whiteButton"];
  buttonIds.forEach(buttonId => {
    const button = document.getElementById(buttonId);
    button.style.border = "none";
  });
  // Set border for selected button
  const selectedButton = document.getElementById(selectedButtonId);
  selectedButton.style.border = "2px dashed white";
}

function color(color) {
  if (color=="red"){
    ctx.fillStyle = "#FF0000";
    dctx.strokeStyle = "#FF0000";
  }
  if (color=="orange"){
    ctx.fillStyle = "#FFA500";
    dctx.strokeStyle = "#FFA500";
  }
  if (color=="yellow"){
    ctx.fillStyle = "#FFFF00";
    dctx.strokeStyle = "#FFFF00";
  }
  if (color=="green"){
    ctx.fillStyle = "#008000";
    dctx.strokeStyle = "#008000";
  }
  if (color=="blue"){
    ctx.fillStyle = "#0000FF";
    dctx.strokeStyle = "#0000FF";
  }
  if (color=="purple"){
    ctx.fillStyle = "#800080";
    dctx.strokeStyle = "#800080";
  }
  if (color=="pink"){
    ctx.fillStyle = "#FFC0CB";
    dctx.strokeStyle = "#FFC0CB";
  }
  if (color=="black"){
    ctx.fillStyle = "#000000";
    dctx.strokeStyle = "#000000";
  }
  if (color=="white"){
    ctx.fillStyle = "#FFFFFF";
    dctx.strokeStyle = "#FFFFFF";
  }
  console.log(color)
}

function onResults(results) {
  ctx.save();
  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  octx.clearRect(0, 0, oc.width, oc.height);
  ctx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiHandLandmarks) {
    for (const landmarks of results.multiHandLandmarks) {
      //console.log(landmarks[12].z)
      px = x;
      py = y;
      x = landmarks[8].x * vw;
      y = landmarks[8].y * vh;
      //console.log(x,y)
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fill();
      //drawConnectors(ctx, landmarks, HAND_CONNECTIONS,{color: '#00ffee', lineWidth: 5});
      //drawLandmarks(ctx, landmarks, {color: '#ee00ff', lineWidth: 2});
      if (landmarks[8].y < landmarks[16].y - 0.1) {
        if (landmarks[8].y > landmarks[12].y) {
          octx.beginPath();
          octx.fillStyle = "rgba(15,143,255,0.5)";
          octx.rect(x - 20, y - 20, 50, 50);
          octx.fill();
          dctx.clearRect(x - 20, y - 20, 50, 50);
        } else {
          dctx.beginPath();
          dctx.moveTo(px, py);
          dctx.lineWidth = 3;
          dctx.lineTo(x, y);
          dctx.stroke();
        }
      }
      if (
        landmarks[20].y <
        landmarks[12].y - (-landmarks[12].z * 0.833 + 0.05)
      ) {
        dctx.clearRect(0, 0, dc.width, dc.height);
      }
    }
  }
  ctx.restore();
}

const hands = new Hands({
  locateFile: (file) => {
    return `hands/${file}`;
  },
});
hands.setOptions({
  selfieMode: true,
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: w,
  height: h,
});
camera.start();
