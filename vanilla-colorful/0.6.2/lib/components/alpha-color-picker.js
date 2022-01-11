/* https://unpkg.com/vanilla-colorful@0.6.2/lib/components/alpha-color-picker.js?module */ import { ColorPicker, $css, $sliders } from "./color-picker.js";
import { Alpha } from "./alpha.js";
import alphaCss from "../styles/alpha.js";
export class AlphaColorPicker extends ColorPicker {
  get [$css]() {
    return [...super[$css], alphaCss];
  }
  get [$sliders]() {
    return [...super[$sliders], Alpha];
  }}