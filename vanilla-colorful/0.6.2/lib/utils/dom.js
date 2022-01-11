/* https://unpkg.com/vanilla-colorful@0.6.2/lib/utils/dom.js?module */ const cache = {};
export const tpl = html => {
  let template = cache[html];
  if (!template) {
    template = document.createElement('template');
    template.innerHTML = html;
    cache[html] = template;
  }
  return template;
};
export const fire = (target, type, detail) => {
  target.dispatchEvent(new CustomEvent(type, {
    bubbles: true,
    detail }));

};