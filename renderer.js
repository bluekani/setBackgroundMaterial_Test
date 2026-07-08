let currentRgba = { r: 255, g: 255, b: 255, a: 0 };

window.electronAPI.setBackgroundMaterial('auto');
window.electronAPI.setBackgroundColor('rgba(255, 255, 255, 0)');

document.getElementById('minimize-btn').addEventListener('click', () => {
  window.electronAPI.minimizeWindow();
});

document.getElementById('maximize-btn').addEventListener('click', () => {
  window.electronAPI.maximizeWindow();
});

document.getElementById('close-btn').addEventListener('click', () => {
  window.electronAPI.closeWindow();
});

const sliders = {
  red: document.getElementById('red'),
  green: document.getElementById('green'),
  blue: document.getElementById('blue'),
  alpha: document.getElementById('alpha')
};

const displays = {
  red: document.getElementById('red-value'),
  green: document.getElementById('green-value'),
  blue: document.getElementById('blue-value'),
  alpha: document.getElementById('alpha-value')
};

function updateColorPreview() {
  const r = parseInt(sliders.red.value);
  const g = parseInt(sliders.green.value);
  const b = parseInt(sliders.blue.value);
  const a = parseInt(sliders.alpha.value) / 100;

  currentRgba = { r, g, b, a: parseInt(sliders.alpha.value) };

  displays.red.textContent = r;
  displays.green.textContent = g;
  displays.blue.textContent = b;
  displays.alpha.textContent = `${parseInt(sliders.alpha.value)}%`;
}

Object.values(sliders).forEach(slider => {
  slider.addEventListener('input', updateColorPreview);
});

document.getElementById('apply-color').addEventListener('click', async () => {
  const { r, g, b, a } = currentRgba;
  const rgbaString = `rgba(${r}, ${g}, ${b}, ${(a / 100).toFixed(2)})`;
  await window.electronAPI.setBackgroundColor(rgbaString);
});

document.querySelectorAll('.btn[data-material]').forEach(btn => {
  btn.addEventListener('click', async () => {
    document.querySelectorAll('.btn[data-material]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    await window.electronAPI.setBackgroundMaterial(btn.dataset.material);
  });
});

document.querySelector('.btn[data-material="auto"]').classList.add('active');
updateColorPreview();
