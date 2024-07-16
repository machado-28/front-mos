
export class Console {
    log({ size = "xx-large", color = "yellow", bg, text, params }) {
        console.log(`%c${text}`, `color:${color};font-size:${size}`, params);
    }

    table({  size = "xx-large", color = "yellow", bg, text, params}) {
        console.table(`%c${text}`, `color:${color};font-size:${size}`, params);
    }

}
export default new Console()