/* https://unpkg.com/@a11y/focus-trap@1.0.5/focus-trap.js?module */ import { debounce } from "./debounce.js";
import { isFocusable, isHidden } from "./focusable.js";
import { queryShadowRoot } from "./shadow.js";
/**
                                                    * Template for the focus trap.
                                                    */
const template = document.createElement("template");
template.innerHTML = `
	<div id="start"></div>
	<div id="backup"></div>
	<slot></slot>
	<div id="end"></div>
`;
/**
    * Focus trap web component.
    * @customElement focus-trap
    * @slot - Default content.
    */
export class FocusTrap extends HTMLElement {
  /**
                                             * Attaches the shadow root.
                                             */
  constructor() {
    super();
    // The debounce id is used to distinguish this focus trap from others when debouncing
    this.debounceId = Math.random().toString();
    this._focused = false;
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));
    this.$backup = shadow.querySelector("#backup");
    this.$start = shadow.querySelector("#start");
    this.$end = shadow.querySelector("#end");
    this.focusLastElement = this.focusLastElement.bind(this);
    this.focusFirstElement = this.focusFirstElement.bind(this);
    this.onFocusIn = this.onFocusIn.bind(this);
    this.onFocusOut = this.onFocusOut.bind(this);
  }
  // Whenever one of these attributes changes we need to render the template again.
  static get observedAttributes() {
    return [
    "inactive"];

  }
  /**
     * Determines whether the focus trap is active or not.
     * @attr
     */
  get inactive() {
    return this.hasAttribute("inactive");
  }
  set inactive(value) {
    value ? this.setAttribute("inactive", "") : this.removeAttribute("inactive");
  }
  /**
     * Returns whether the element currently has focus.
     */
  get focused() {
    return this._focused;
  }
  /**
     * Hooks up the element.
     */
  connectedCallback() {
    this.$start.addEventListener("focus", this.focusLastElement);
    this.$end.addEventListener("focus", this.focusFirstElement);
    // Focus out is called every time the user tabs around inside the element
    this.addEventListener("focusin", this.onFocusIn);
    this.addEventListener("focusout", this.onFocusOut);
    this.render();
  }
  /**
     * Tears down the element.
     */
  disconnectedCallback() {
    this.$start.removeEventListener("focus", this.focusLastElement);
    this.$end.removeEventListener("focus", this.focusFirstElement);
    this.removeEventListener("focusin", this.onFocusIn);
    this.removeEventListener("focusout", this.onFocusOut);
  }
  /**
     * When the attributes changes we need to re-render the template.
     */
  attributeChangedCallback() {
    this.render();
  }
  /**
     * Focuses the first focusable element in the focus trap.
     */
  focusFirstElement() {
    this.trapFocus();
  }
  /**
     * Focuses the last focusable element in the focus trap.
     */
  focusLastElement() {
    this.trapFocus(true);
  }
  /**
     * Returns a list of the focusable children found within the element.
     */
  getFocusableElements() {
    return queryShadowRoot(this, isHidden, isFocusable);
  }
  /**
     * Focuses on either the last or first focusable element.
     * @param {boolean} trapToEnd
     */
  trapFocus(trapToEnd) {
    if (this.inactive)
    return;
    let focusableChildren = this.getFocusableElements();
    if (focusableChildren.length > 0) {
      if (trapToEnd) {
        focusableChildren[focusableChildren.length - 1].focus();
      } else
      {
        focusableChildren[0].focus();
      }
      this.$backup.setAttribute("tabindex", "-1");
    } else
    {
      // If there are no focusable children we need to focus on the backup
      // to trap the focus. This is a useful behavior if the focus trap is
      // for example used in a dialog and we don't want the user to tab
      // outside the dialog even though there are no focusable children
      // in the dialog.
      this.$backup.setAttribute("tabindex", "0");
      this.$backup.focus();
    }
  }
  /**
     * When the element gains focus this function is called.
     */
  onFocusIn() {
    this.updateFocused(true);
  }
  /**
     * When the element looses its focus this function is called.
     */
  onFocusOut() {
    this.updateFocused(false);
  }
  /**
     * Updates the focused property and updates the view.
     * The update is debounced because the focusin and focusout out
     * might fire multiple times in a row. We only want to render
     * the element once, therefore waiting until the focus is "stable".
     * @param value
     */
  updateFocused(value) {
    debounce(() => {
      if (this.focused !== value) {
        this._focused = value;
        this.render();
      }
    }, 0, this.debounceId);
  }
  /**
     * Updates the template.
     */
  render() {
    this.$start.setAttribute("tabindex", !this.focused || this.inactive ? `-1` : `0`);
    this.$end.setAttribute("tabindex", !this.focused || this.inactive ? `-1` : `0`);
    this.focused ? this.setAttribute("focused", "") : this.removeAttribute("focused");
  }}

window.customElements.get("focus-trap") || window.customElements.define("focus-trap", FocusTrap);
