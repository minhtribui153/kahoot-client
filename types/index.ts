export type Question = {
    type: "input" | "number" | "confirm" | "list" | "rawlist" | "expand" | "checkbox" | "password" | "editor";
    name: String;
    message: String | Function;
    default?: String | Number | Boolean | Array<any> | Function;
    choices?: Array<String | Number | Object> | Function;
    validate?: Function;
    filter?: Function;
    transformer?: Function;
    when?: Function;
    pageSize?: Number;
    prefix?: String;
    suffix?: String;
    askAnswered?: Boolean;
    loop?: Boolean;
}