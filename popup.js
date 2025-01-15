const toggleSwitch = document.getElementById("toggleSwitch");
const colorOverrideSwitch = document.getElementById("colorOverrideSwitch");
const refreshButton = document.getElementById('refreshButton');
const colorPicker = document.getElementById('colorPicker');
const colorValue = document.getElementById('colorValue');
const fixationPointSlider = document.getElementById('fixationPointSlider');
const sliderValue = document.getElementById('sliderValue');

chrome.storage.sync.get(["isEnabled", "isColorOverrideEnabled", "textVideColor", "fixationPoint"], ({ isEnabled, isColorOverrideEnabled, textVideColor, fixationPoint }) => {
  toggleSwitch.checked = isEnabled;
  colorOverrideSwitch.checked = isColorOverrideEnabled;
  if(textVideColor) {
    colorPicker.value = textVideColor;
    colorValue.textContent = textVideColor;
  }else{
    chrome.storage.sync.set({ textVideColor: '#5684E1' });
    colorPicker.value = '#5684E1';
    colorValue.textContent = '#5684E1';
  }
  if(fixationPoint) {
    fixationPointSlider.value = fixationPoint;
    sliderValue.textContent = fixationPoint;
  }else{
    chrome.storage.sync.set({ fixationPoint: 3 });
    fixationPointSlider.value = 3;
    sliderValue.textContent = 3;
  }
});

toggleSwitch.addEventListener("change", () => {
  refreshButton.style.display = 'block';
  const isEnabled = toggleSwitch.checked;
  const isColorOverrideEnabled = colorOverrideSwitch.checked;
  const color = isColorOverrideEnabled ? colorPicker.value : null;
  const fixationPoint = fixationPointSlider.value;
  chrome.storage.sync.set({ isEnabled });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: isEnabled ? "activateTextVide" : "deactivateTextVide",
      color: color,
      fixationPoint: fixationPoint
    });
  });
});

colorOverrideSwitch.addEventListener("change", () => {
  const isColorOverrideEnabled = colorOverrideSwitch.checked;
  chrome.storage.sync.set({ isColorOverrideEnabled });
  const isEnabled = toggleSwitch.checked;
  if(isEnabled){
    refreshButton.style.display = 'block';
  }
});

colorPicker.addEventListener("input", () => {
  const color = colorPicker.value;
  chrome.storage.sync.set({ textVideColor: color });
  colorValue.textContent = color;
  const isEnabled = toggleSwitch.checked;
  if(isEnabled){
    refreshButton.style.display = 'block';
  }
});

refreshButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.reload(tabs[0].id);
        refreshButton.style.display = 'none';
    });
});

fixationPointSlider.addEventListener("input", () => {
  const fixationPoint = fixationPointSlider.value;
  sliderValue.textContent = fixationPoint;
  chrome.storage.sync.set({ fixationPoint });
  const isEnabled = toggleSwitch.checked;
  if(isEnabled){
    refreshButton.style.display = 'block';
  }
});
