import colorConverter from 'color-convert';

figma.showUI(__html__);

figma.ui.onmessage = () => {
  const localVariableCollections = figma.variables.getLocalVariableCollections();

  for (const localVariableCollection of localVariableCollections) {
    const { modes, name: localVariableCollectionName, variableIds, defaultModeId } = localVariableCollection;
    const values: Record<string, Record<string, string | number>> = {};

    console.log(localVariableCollectionName, modes);

    if (localVariableCollectionName === '_Primitives') {
      // init
      values[localVariableCollectionName] = {};

      variableIds.forEach((variableId) => {
        const variable = figma.variables.getVariableById(variableId);

        if (variable.resolvedType === 'COLOR') {
          const color = variable.valuesByMode[defaultModeId] as RGBA;
          let colorValue = '';

          if (color.a === 0) {
            // transparent
            colorValue = 'transparent';
          } else if (color.a === 1) {
            // hex
            colorValue = '#' + colorConverter.rgb.hex(color.r * 100, color.g * 100, color.b * 100);
          } else {
            // rgba
            colorValue = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a.toFixed(2)})`;
          }

          const keyName = variable.name.toLocaleLowerCase().replace(/\(|\)| |\//g, '-');

          values[localVariableCollectionName][keyName] = colorValue;
        } else {
          console.log(variable.name, variable.valuesByMode[defaultModeId]);
        }
      });
    }

    console.log(values);
  }

  // figma.variables.getLocalVariablesAsync().then((variables) => {
  //   console.log(variables);

  //   for (const variable of variables) {
  //     if (variable.resolvedType === 'COLOR') {
  //       console.log(variable);
  //     }

  //     // color
  //     // if (variable.valuesByMode['5248:3']) {
  //     //   console.log(variable, variable.name, variable.valuesByMode['5248:3']);
  //     // } else {
  //     //   // console.log(variable.resolvedType, variable.name, variable.valuesByMode);
  //     // }
  //   }

  //   figma.ui.postMessage({
  //     type: 'return-local-variables',
  //     message: '2',
  //   });
  // });
};
