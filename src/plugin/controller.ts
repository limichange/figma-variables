import colorConverter from 'color-convert';
import getTailwindClasses from './getTailwindClasses';
import { getLastName } from './utils/getLastName';
import { formatName } from './utils/formatName';

figma.showUI(__html__, {
  width: 460,
  height: 300,
});

figma.ui.onmessage = (message) => {
  console.clear();

  if (message.type === 'get-tailwind-classes') {
    let currentNode: SceneNode | null = null;

    for (const node of figma.currentPage.selection) {
      currentNode = node;
      break;
    }

    if (currentNode) {
      const tailwindClasses = getTailwindClasses(currentNode);

      let code = `<div className="${tailwindClasses.join(' ')}"></div>`;

      if (currentNode.type === 'TEXT') {
        code = `<div className="${tailwindClasses.join(' ')}">${currentNode.characters}</div>`;
      }

      figma.ui.postMessage({
        type: 'return-tailwind-classes',
        message: code,
      });
    }

    return;
  }

  const localVariableCollections = figma.variables.getLocalVariableCollections();
  const values: Record<string, Record<string, string | number | Record<string, string | number>>> = {};

  for (const localVariableCollection of localVariableCollections) {
    const { modes, name: localVariableCollectionName, variableIds } = localVariableCollection;

    values[localVariableCollectionName] = {};

    for (const mode of modes) {
      const currentModeId = mode.modeId;
      const currentModeName = formatName(mode.name);

      values[localVariableCollectionName][currentModeName] = {};
      const currentMode = values[localVariableCollectionName][currentModeName];

      variableIds.forEach((variableId) => {
        const variable = figma.variables.getVariableById(variableId);
        const variableName = formatName(getLastName(variable.name));

        if (variable.resolvedType === 'COLOR') {
          const color = variable.valuesByMode[currentModeId];
          let colorValue = '';

          if (typeof color === 'object' && color['a'] === 0) {
            colorValue = 'transparent';
            currentMode[variableName] = colorValue;
          } else if (color['a'] === 1) {
            const colorRGB = color as RGB;

            colorValue = '#' + colorConverter.rgb.hex(colorRGB.r * 255, colorRGB.g * 255, colorRGB.b * 255);
            currentMode[variableName] = colorValue;
          } else if (color['a'] !== 1 && typeof color['a'] === 'number') {
            const colorRGBA = color as RGBA;
            colorValue = `rgba(${colorRGBA.r}, ${colorRGBA.g}, ${colorRGBA.b}, ${colorRGBA.a.toFixed(2)})`;
            currentMode[variableName] = colorValue;
          } else if (color['type'] === 'VARIABLE_ALIAS') {
            const colorAlias = color as VariableAlias;
            const variableAlias = figma.variables.getVariableById(colorAlias.id);

            currentMode[variableName] = `var(--${formatName(variableAlias.name)})`;
          } else {
            console.log('!!!color', color);
          }
        } else if (variable.resolvedType === 'FLOAT') {
          const size = variable.valuesByMode[currentModeId] as number | VariableAlias;

          if (typeof size === 'number') {
            currentMode[variableName] = size;
          } else if (size.type === 'VARIABLE_ALIAS') {
            size as VariableAlias;

            const sizeVariable = figma.variables.getVariableById(size.id);

            currentMode[variableName] = `var(--${formatName(getLastName(sizeVariable.name))})`;
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

  figma.ui.postMessage({
    type: 'return-local-variables',
    message: values,
  });

  // figma copy values

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
