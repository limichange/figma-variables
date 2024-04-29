import colorConverter from 'color-convert';

function formatName(name: string) {
  const newName = name
    .toLocaleLowerCase()
    .replace(/\,/g, '')
    .replace(/(\․|\ \()|(\)\ )|(\)\/)|\(|\)| |\//g, '-');

  // remove last -
  if (newName.endsWith('-')) {
    return newName.slice(0, -1);
  } else {
    return newName;
  }
}

figma.showUI(__html__);

figma.ui.onmessage = () => {
  const localVariableCollections = figma.variables.getLocalVariableCollections();
  const values: Record<string, Record<string, string | number | Record<string, string | number>>> = {};

  for (const localVariableCollection of localVariableCollections) {
    const { modes, name: localVariableCollectionName, variableIds } = localVariableCollection;

    values[localVariableCollectionName] = {};

    for (const mode of modes) {
      const currentModeId = mode.modeId;
      const currentModeName = formatName(mode.name);

      values[localVariableCollectionName][currentModeName] = {};

      variableIds.forEach((variableId) => {
        const variable = figma.variables.getVariableById(variableId);
        const variableName = formatName(variable.name);

        // console.log(variable);

        if (variable.resolvedType === 'COLOR') {
          const color = variable.valuesByMode[currentModeId];
          let colorValue = '';

          if (typeof color === 'object' && color['a'] === 0) {
            colorValue = 'transparent';
          } else if (color['a'] === 1) {
            const colorRGB = color as RGB;

            colorValue = '#' + colorConverter.rgb.hex(colorRGB.r * 100, colorRGB.g * 100, colorRGB.b * 100);
          } else if (color['a'] !== 1 && typeof color['a'] === 'number') {
            const colorRGBA = color as RGBA;
            colorValue = `rgba(${colorRGBA.r}, ${colorRGBA.g}, ${colorRGBA.b}, ${colorRGBA.a.toFixed(2)})`;
          } else if (color['type'] === 'VARIABLE_ALIAS') {
            const colorAlias = color as VariableAlias;
            const variableAlias = figma.variables.getVariableById(colorAlias.id);

            colorValue = formatName(variableAlias.name);

            if (colorValue === 'colors-foreground-fg-brand-primary-600-') {
              console.log(variable, variableAlias);
            }
          } else {
            console.log('!!!color', color);
          }

          values[localVariableCollectionName][currentModeName][variableName] = colorValue;
        } else if (variable.resolvedType === 'FLOAT') {
          const size = variable.valuesByMode[currentModeId] as number | VariableAlias;

          if (typeof size === 'number') {
            values[localVariableCollectionName][currentModeName][variableName] = size;
          } else if (size.type === 'VARIABLE_ALIAS') {
            size as VariableAlias;

            const sizeVariable = figma.variables.getVariableById(size.id);

            values[localVariableCollectionName][currentModeName][variableName] = formatName(sizeVariable.name);
          } else {
            console.log('!!!size', size);
          }
        } else {
          console.log('!!!variable', variable);
        }
      });
    }
  }

  console.log(values);

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
