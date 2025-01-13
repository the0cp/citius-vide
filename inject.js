chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if(request.action === "activateTextVide") {
    isEnabled = true;
    activateTextVide(request.color);
  }else if(request.action === "deactivateTextVide") {
    isEnabled = false;
    deactivateTextVide();
  }
});

chrome.storage.sync.get(["isEnabled", "isColorOverrideEnabled", "textVideColor"], ({ isEnabled, isColorOverrideEnabled, textVideColor }) => {
  if(isEnabled) {
    const color = isColorOverrideEnabled ? textVideColor : null;
    activateTextVide(color);
  }else{
    deactivateTextVide();
  }
});

function activateTextVide(color) {
  let textNodes = getTextNodes(document.body);
  textNodes.forEach((node) => {
    if(!node.parentNode.getAttribute("data-original-text")) {
      node.parentNode.setAttribute("data-original-text", node.nodeValue);
    }
    let videText = textVide.textVide(node.nodeValue, color); // Use the textVide API
    let newNode = document.createElement("span");
    newNode.innerHTML = videText;
    node.parentNode.replaceChild(newNode, node);
  });
}

function deactivateTextVide() {
  let videSpans = document.querySelectorAll("[data-original-text]");
  videSpans.forEach((span) => {
    span.textContent = span.getAttribute("data-original-text");
    span.removeAttribute("data-original-text");
  });
}

function getTextNodes(element) {
  let textNodes = [];
  let walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      if(
        !/^(script|style|noscript)$/i.test(node.parentNode.nodeName) &&
        node.textContent.trim().length > 0
      ) {
        return NodeFilter.FILTER_ACCEPT;
      }
    },
  }, false);

  let node;
  while (node = walk.nextNode()) {
    textNodes.push(node);
  }
  return textNodes;
}

console.log("Content script loaded");