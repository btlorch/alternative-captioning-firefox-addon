function insertCaption(node) {
  if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === "IMG") {
    console.log("Found image with alt=\"" + "\"");
    return;
  }

  for (let i = 0; i < node.childNodes.length; i++) {
    insertCaption(node.childNodes[i]);
  }
}

// Start the recursion from the body tag.
insertCaption(document.body);