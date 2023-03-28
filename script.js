const frame = document.querySelector('.frame'),
photoContainer = document.querySelector('.photo-container'),
resizeSlider = document.querySelector('.resize-slider'),
cropBtn = document.querySelector('.crop-btn'),
croppedPhotoContainer = document.querySelector('.cropped-photo-container'),
photoToCrop = document.querySelector('.uploaded-photo'),
downloadBtn = document.querySelector('.download-btn'),
uploadBtn = document.querySelector('.upload-btn'),
uploadInput = document.querySelector('.upload-input')


// drag frame
frame.addEventListener('mousedown', mouseDown);
frame.addEventListener('touchstart', touchStart);

window.addEventListener('mouseup', mouseUp);
window.addEventListener('touchend', touchEnd);

function mouseMove(e) {
  frame.style.top = e.clientY - frame.parentElement.offsetTop - (frame.offsetHeight / 2) + 'px';
  frame.style.left = e.clientX - frame.parentElement.offsetLeft - (frame.offsetWidth / 2) + 'px';
}

function touchMove(e) {
  const touchLoc = e.targetTouches[0];
  frame.style.top = touchLoc.clientY - frame.parentElement.offsetTop - (frame.offsetHeight / 2) + 'px';
  frame.style.left = touchLoc.clientX - frame.parentElement.offsetLeft - (frame.offsetWidth / 2) + 'px';
}

function mouseDown() {
  window.addEventListener('mousemove', mouseMove);
  // window.addEventListener('touchmove', frameMove);
}

function mouseUp() {
  window.removeEventListener('mousemove', mouseMove)
  // window.removeEventListener('touchmove', frameMove)
}

function touchStart(e) {
  window.addEventListener('touchmove', touchMove);
}

function touchEnd() {
  window.removeEventListener('touchmove', touchMove)
}


// resize frame with slider
document.addEventListener('DOMContentLoaded', () => {
  resizeSlider.value = (+resizeSlider.min + +resizeSlider.max) / 2
  frame.style.width = (+resizeSlider.min + +resizeSlider.max) / 2 + 'px'
  frame.style.height = (+resizeSlider.min + +resizeSlider.max) / 2 + 'px'

})

resizeSlider.addEventListener('input', resizeFrame);

function resizeFrame() {
  frame.style.width = resizeSlider.value + 'px';
  frame.style.height = resizeSlider.value + 'px';
}


// crop photo
cropBtn.addEventListener('click', cropPhoto);

function cropPhoto() {
  croppedPhotoContainer.innerHTML = '';
  const photoRatio = photoToCrop.offsetWidth / photoToCrop.naturalWidth


  const canvas = document.createElement('canvas');
  // canvas.width = 96;
  // // canvas.height = 96;  
  // canvas.width = frame.offsetWidth;
  // canvas.height = frame.offsetHeight;  
  canvas.width = (photoToCrop.naturalWidth / photoToCrop.offsetWidth) * frame.offsetWidth;
  canvas.height = canvas.width
  
  croppedPhotoContainer.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  ctx.beginPath(); 
  // ctx.arc(48, 48, 48, 0, 2 * Math.PI); 
  // ctx.arc(frame.offsetWidth / 2, frame.offsetHeight / 2, frame.offsetHeight / 2, 0, 2 * Math.PI); 
  ctx.arc(canvas.width / 2,  canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI); 
  ctx.clip(); 

  const sx = frame.offsetLeft ;
  const sy = frame.offsetTop ;

  // ctx.drawImage(photoToCrop, sx / photoRatio, sy / photoRatio, frame.offsetWidth / photoRatio, frame.offsetHeight / photoRatio, 0, 0, 96 , 96)
  // ctx.drawImage(photoToCrop, sx / photoRatio , sy / photoRatio , frame.offsetWidth / photoRatio, frame.offsetHeight / photoRatio , 0, 0, frame.offsetWidth , frame.offsetHeight)
  ctx.drawImage(photoToCrop, sx / photoRatio , sy / photoRatio , frame.offsetWidth / photoRatio, frame.offsetHeight / photoRatio , 0, 0, canvas.width, canvas.height)
  
  downloadBtn.click();
}


// download photo
downloadBtn.addEventListener('click', () => {
  const canvas = document.querySelector('canvas');
  const photo = canvas.toDataURL('image/jpg');
  downloadBtn.setAttribute('href', photo )
})

// upload photo
uploadBtn.addEventListener('click', () => {
  uploadInput.click();
})

uploadInput.addEventListener('change', (e) => {
  photoContainer
  const file = e.target.files[0];
  if (file) {
    console.log(file);
    const objectUrl = URL.createObjectURL(file);
    // const uploadedImage = document.createElement('img');
    photoToCrop.src = objectUrl;
    // console.log(objectUrl);
    // const image = new Image();
    // image.src = objectUrl;
    // photoContainer.appendChild(image)
    
    setTimeout(() => {
      resizeSlider.setAttribute('max', photoToCrop.width + 50);
      resizeSlider.value = (+resizeSlider.min + +resizeSlider.max) / 2
      resizeFrame()
      console.log(photoToCrop.naturalWidth);
    }, 100)

  }
})