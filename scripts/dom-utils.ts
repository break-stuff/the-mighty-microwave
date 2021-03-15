interface ICustomHTMLElement extends HTMLElement {
    on(event: string, callback: Function): ICustomHTMLElement;
}

export function $(selector: string): ICustomHTMLElement {
    return document.querySelector(selector);
}

export function $$(selector: string): ICustomHTMLElement[] {
    return Array.from(document.querySelectorAll(selector));
}

(HTMLElement as any).prototype.on = function (event: string, callback: Function): ICustomHTMLElement {
    this.addEventListener(event, callback);
    return this as ICustomHTMLElement;
};
