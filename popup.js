const toggleSwitch = document.getElementById("toggleSwitch");
const colorOverrideSwitch = document.getElementById("colorOverrideSwitch");
const refreshButton = document.getElementById('refreshButton');
const colorPicker = document.getElementById('colorPicker');

chrome.storage.sync.get(["isEnabled", "isColorOverrideEnabled", "textVideColor"], ({ isEnabled, isColorOverrideEnabled, textVideColor }) => {
  toggleSwitch.checked = isEnabled;
  colorOverrideSwitch.checked = isColorOverrideEnabled;
  if(textVideColor) {
    colorPicker.value = textVideColor;
  }
});

toggleSwitch.addEventListener("change", () => {
  refreshButton.style.display = 'block';
  const isEnabled = toggleSwitch.checked;
  const isColorOverrideEnabled = colorOverrideSwitch.checked;
  const color = isColorOverrideEnabled ? colorPicker.value : null;
  chrome.storage.sync.set({ isEnabled });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: isEnabled ? "activateTextVide" : "deactivateTextVide",
      color: color
    });
  });
});

colorOverrideSwitch.addEventListener("change", () => {
  const isColorOverrideEnabled = colorOverrideSwitch.checked;
  chrome.storage.sync.set({ isColorOverrideEnabled });
  refreshButton.style.display = 'block';
});

colorPicker.addEventListener("input", () => {
  chrome.storage.sync.set({ textVideColor: colorPicker.value });
  refreshButton.style.display = 'block';
});

refreshButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.reload(tabs[0].id);
        refreshButton.style.display = 'none';
    });
});