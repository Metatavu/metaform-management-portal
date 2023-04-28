import Config from "app/config";

namespace ThemeUtils {

  /**
   * Coverts color hex value to rgb
   *
   * @param color color hex value
   */
  export const hexToRgb = (color: string) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    return {
      r: r,
      g: g,
      b: b
    };
  };

  /**
   * Gets color brightness
   *
   * @param r red value
   * @param g green value
   * @param b blue value
   */
  export const calculateBrightness = ({ r, g, b }: { r: number; g: number; b: number }) => {
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  /**
   * Gets the contrast text color based on the background color
   *
   * @param backgroundColor background color
   */
  export const getContrastTextColor = (backgroundColor: string) => {
    const rgb = hexToRgb(backgroundColor);
    const brightness = calculateBrightness(rgb);
    
    return brightness > 128 ? "#000000" : "#FFFFFF";
  };

  /**
   * Lightens a color by a percentage
   *
   * @param color color hex value
   * @param percent percent to lighten
   */
  export const lightenColor = (color: string, percent: number) => {
    const rgb = hexToRgb(color);
    const newRgb = {
      r: Math.round((255 - rgb.r) * percent) + rgb.r,
      g: Math.round((255 - rgb.g) * percent) + rgb.g,
      b: Math.round((255 - rgb.b) * percent) + rgb.b
    };

    return `rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`;
  };

  /**
   * Returns the background color of the header
   * @returns The background color of the header
   */
  export const getHeaderBackgroundColor = () => {
    if (Config.get().theme.useColoredHeader === "true") {
      return Config.get().theme.paletteSecondaryMain;
    }
    return "";
  };

  /**
   * Returns the text color of the header
   * @returns The text color of the header
   */
  export const getHeaderTextColor = () => {
    if (Config.get().theme.useColoredHeader === "true") {
      return getContrastTextColor(Config.get().theme.paletteSecondaryMain);
    }
    return "#ffffff";
  };

}

export default ThemeUtils;