declare module '*.wasm' {
    const content: ArrayBuffer; // { [className: string]: string };
    export = content;
}
