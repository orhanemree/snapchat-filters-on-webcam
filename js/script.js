const canvas = document.getElementById("canvas");
const colorInput = document.getElementById("color");
const downloadLink = document.getElementById("download-link");
const deniedWarn = document.querySelector(".denied-warn");
const mobileWarn = document.querySelector(".mobile-warn");

// filter checkboxes
const headCheckbox = document.getElementById("christmas-head");
const ornamentCheckbox = document.getElementById("christmas-ornament");
const backgroundCheckbox = document.getElementById("christmas-background");
const fatherCheckbox = document.getElementById("father-christmas");

// bacground color checkboxes
const backgroundCheckboxes = [...document.querySelectorAll("[name=backgrounds]")];

// clear checkboxes button
const clearBtn = document.getElementById("clear");
clearBtn.addEventListener("click", () => {
    backgroundCheckboxes.forEach(el => {
        el.checked = false;
    });
    headCheckbox.checked = false;
    ornamentCheckbox.checked = false;
    backgroundCheckbox.checked = false;
    fatherCheckbox.checked = false;
});


const backgrounds = [
    {
        "name": "blue",
        "color": "rgba(56, 145, 228, 0.5)"
    },
    {
        "name": "yellow",
        "color": "rgba(182, 228, 56, 0.5)"
    },
    {
        "name": "black",
        "color": "rgba(0, 0, 0, 0.5)"
    },
    {
        "name": "red",
        "color": "rgba(228, 56, 85, 0.5)"
    },
    {
        "name": "green",
        "color": "rgba(105, 228, 56, 0.5)"
    }
];

let outputWidth, outputHeight, faceTracker, videoInput, imgSpidermanMask, size;

function preload() {
    christmasHeadImg = loadImage("./img/christmas-head.png");
    christmasOrnamentImg = loadImage("./img/christmas-ornament.png");
    christmasBackgroundImg = loadImage("./img/christmas-background.png");
    fatherChristmasImg = loadImage("./img/father-christmas.png");
}

function setup() {
    outputWidth = windowWidth * 40 / 100;
    outputHeight = outputWidth * 0.75;
    
    
    mobileWarn.style.display = "none";
    if (window.matchMedia("(max-width: 768px)").matches) {
        outputWidth = windowWidth * 50 / 100;
        outputHeight = outputWidth * 0.75
    } 
    if (window.matchMedia("(max-width: 480px)").matches) {
        outputWidth = windowWidth * 80 / 100;
        outputHeight = outputWidth * 0.75;
        mobileWarn.style.display = "block";
        setTimeout( ()=> {
            mobileWarn.style.display = "none";
        }, 7000);
    }

    createCanvas(outputWidth, outputHeight);

    canvas.width = outputWidth;
    canvas.height = outputHeight;

    videoInput = createCapture(VIDEO);
    videoInput.size(outputWidth, outputHeight);
    videoInput.hide();
    
    faceTracker = new clm.tracker();
    faceTracker.init();
    faceTracker.start(videoInput.elt);
    
    navigator.permissions.query({name:"camera"}).then(function(result) {
        if (result.state === "denied"){
            deniedWarn.style.display = "block";
        } else {
            deniedWarn.style.display = "none";
        }
    });
    
    const p5canvas = document.getElementById("defaultCanvas0");
    
    const captureBtn = document.querySelector(".capture");
    captureBtn.addEventListener("click", async () => {
        canvas.getContext('2d').drawImage(p5canvas, 0, 0, p5canvas.width, p5canvas.height);
        canvas.addEventListener("click", () => {
            const imageDataUrl = canvas.toDataURL('image/png');
            downloadLink.setAttribute("href", imageDataUrl);
            downloadLink.setAttribute("download", "image");
        })
    });
}

function draw() {
    image(videoInput, 0, 0, outputWidth, outputHeight);
    if (headCheckbox.checked) {
        christmasHead();
    }
    if (ornamentCheckbox.checked) {
        christmasOrnament();
    }
    if (backgroundCheckbox.checked) {
        christmasBackground();
    }
    if (fatherCheckbox.checked) {
        fatherChristmas();
    }
    const checkedBackground = backgroundCheckboxes.filter(checkbox => checkbox.checked === true);
    if (checkedBackground.length !== 0) {
        const bgColor = backgrounds.filter(color => color.name === checkedBackground[0].id);
        background(bgColor[0].color);
    }
}

const christmasHead = () => {
    const positions = faceTracker.getCurrentPosition();
    console.log(positions)
    if (positions) {
        push();
        size = 3;
        const wx = Math.abs(positions[13][0] - positions[1][0]) * size;
        const wy = Math.abs(positions[7][1] - Math.min(positions[16][1], positions[20][1])) * size;
        translate(-wx / 2, -wy / 2);
        image(christmasHeadImg, positions[0][0], positions[0][1], wx, wy);
    }
}

const christmasOrnament = () => {
    const positions = faceTracker.getCurrentPosition();
    if (positions) {
        push();
        size = 0.4;
        const wx = Math.abs(positions[13][0] - positions[1][0]) * size;
        const wy = Math.abs(positions[7][1] - Math.min(positions[16][1], positions[20][1])) * size;
        translate(-wx / 2, -wy / 2);
        image(christmasOrnamentImg, positions[32][0], positions[32][1], wx, wy);
        image(christmasOrnamentImg, positions[27][0], positions[27][1], wx, wy);
    }
}

const christmasBackground = () => {
    background(christmasBackgroundImg);
}

const fatherChristmas = () => {
    const positions = faceTracker.getCurrentPosition();
    if (positions) {
        push();
        size = 1.2;
        const wx = Math.abs(positions[13][0] - positions[1][0]) * size;
        const wy = Math.abs(positions[7][1] - Math.min(positions[16][1], positions[20][1])) * size;
        translate(-wx / 2, -wy / 2);
        image(fatherChristmasImg, positions[41][0], positions[41][1], wx, wy);
    }
}

function windowResized() {

    outputWidth = windowWidth * 40 / 100;
    outputHeight = outputWidth * 0.75;

    if (window.matchMedia("(max-width: 768px)").matches) {
        outputWidth = windowWidth * 50 / 100;
        outputHeight = outputWidth * 0.75
    } 
    if (window.matchMedia("(max-width: 480px)").matches) {
        outputWidth = windowWidth * 80 / 100;
        outputHeight = outputWidth * 0.75;
    }

    resizeCanvas(outputWidth, outputHeight);

    canvas.width = outputWidth;
    canvas.height = outputHeight;
}