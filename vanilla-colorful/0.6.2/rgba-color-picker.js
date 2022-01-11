/* https://unpkg.com/vanilla-colorful@0.6.2/rgba-color-picker.js?module */ import { RgbaBase } from "./lib/entrypoints/rgba.js";
/**
                                                              * A color picker custom element that uses RGBA object format.
                                                              *
                                                              * @element rgba-color-picker
                                                              *
                                                              * @prop {RgbaColor} color - Selected color in RGBA object format.
                                                              *
                                                              * @fires color-changed - Event fired when color property changes.
                                                              *
                                                              * @csspart hue - A hue selector container.
                                                              * @csspart saturation - A saturation selector container
                                                              * @csspart alpha - An alpha selector container.
                                                              * @csspart hue-pointer - A hue pointer element.
                                                              * @csspart saturation-pointer - A saturation pointer element.
                                                              * @csspart alpha-pointer - An alpha pointer element.
                                                              */
export class RgbaColorPicker extends RgbaBase {}

customElements.define('rgba-color-picker', RgbaColorPicker);