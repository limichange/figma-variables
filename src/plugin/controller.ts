figma.showUI(__html__);

figma.ui.onmessage = () => {
  figma.variables.getLocalVariablesAsync().then((collections) => {
    console.log(collections);

    figma.ui.postMessage({
      type: 'return-local-variables',
      message: '2',
    });
  });
};
