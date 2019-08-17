const START_POSITION = 50;

function isTouch() {
  return 'ontouchstart' in window;
}

function hasNotImage(images) {
  return Boolean(
    images
      .map(img => img instanceof HTMLImageElement)
      .find(res => !res)
  );
}

function createControl() {
  const control = document.createElement('div');
  control.classList.add('control');
  return control;
}

function getClipPath(x) {
  return `polygon(${x}% 0%, 100% 0%, 100% 100%, ${x}% 100%)`;
}

function plugin(root) {
  if (!(root instanceof HTMLElement)) {
    throw new Error('Root element should be HTMLElement');
  }

  const images = [...root.querySelectorAll('img')];

  if (images.length !== 2 || hasNotImage(images)) {
    throw new Error('Root element should contain two HTMLImageElement');
  }

  let moving = false;

  const after = images[1];
  const control = createControl();
  root.append(control);

  function setPos(x) {
    after.style.clipPath = getClipPath(x);
    after.style.webkitClipPath = getClipPath(x);
    control.style.left = `${x}%`;
  }

  setPos(START_POSITION);

  const touch = isTouch();
  const startEvent = touch ? 'touchstart' : 'mousedown';
  const moveEvent = touch ? 'touchmove' : 'mousemove';
  const endEvent = touch ? 'touchend' : 'mouseup';

  control.addEventListener(startEvent, function(event) {
    event.preventDefault();
    moving = true;
  });

  root.addEventListener(moveEvent, function(event) {
    if (!moving) return;
    event.preventDefault();
    const x = !!event.touches ? event.touches[0].clientX : event.clientX;
    setPos(x * 100 / window.innerWidth);
  });

  root.addEventListener(endEvent, function() {
    moving = false;
  });
}

export default plugin;
