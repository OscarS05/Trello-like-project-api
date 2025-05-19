const boom = require('@hapi/boom');

class LabelColor {
  #value;

  static VALID_COLORS = {
    '#FF0000': 'red',
    '#00FF00': 'green',
    '#0000FF': 'blue',
    '#FFFF00': 'yellow',
    '#FFA500': 'orange',
    '#800080': 'purple',
    '#FFC0CB': 'pink',
    '#000000': 'black',
    '#FFFFFF': 'white',
    '#808080': 'gray',
    '#A52A2A': 'brown',
    '#008080': 'teal',
    '#FFD700': 'gold',
    '#4B0082': 'indigo',
    '#F0E68C': 'khaki',
    '#00CED1': 'dark turquoise',
    '#FF4500': 'orange red',
    '#2E8B57': 'sea green',
    '#4682B4': 'steel blue',
    '#D2691E': 'chocolate',
  };

  constructor(color) {
    if (!Object.keys(LabelColor.VALID_COLORS).includes(color)) {
      throw boom.badRequest(
        `Invalid label color: ${color}. Allowed colors are: ${Object.entries(
          LabelColor.VALID_COLORS,
        )
          .map(([hex, name]) => `${hex} (${name})`)
          .join(', ')}`,
      );
    }
    this.#value = color;
  }

  get value() {
    return this.#value;
  }

  equals(otherLabelColor) {
    if (!(otherLabelColor instanceof LabelColor)) {
      throw boom.badRequest(
        'Cannot compare LabelColor with a non-LabelColor object',
      );
    }
    return this.#value === otherLabelColor.value;
  }
}

module.exports = LabelColor;
