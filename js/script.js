import { addController } from "./controller.js";
const container = document.querySelector(".container");

const displayData = async () => {
    const json = await fetch("http://127.0.0.1:3696/api/alldata");
    const data = await json.json();
    container.innerHTML = makeTree(data);
    console.log(data);
    addController();
}

displayData();

const makeTree = (data) => {
    let content = "";
    for (let key in data) {
        if (typeof data[key] === "object") {
            content += `<li>${key}</li><ul>`;
            content += `${showingTree(data[key])}`;
            content += `</ul>`
        } else {
            content += `<li data-node="child">${key}: ${data[key]}</li>`;
        }
    }
    return content;
}
/*
const makeTree = (data, isKey) => {
    let content = "";
    if (Array.isArray(data) === true) {
        data.forEach(obj => {
            if (!isKey) {
                content += makeTree(obj, isKey);
            }
            else {
                content += `<li>Individual</li><ul>`
                content += makeTree(obj, isKey);
                content += `</ul>`;
            }
        });
    } else {
        for (let key in data) {
            if (Array.isArray(data[key]) === true) {
                // make ul list
                content += `<li>${key}</li><ul>`;
                content += `${makeTree(data[key], key)}`;
                content += `</ul>`
            } else {
                // make li inside ul
                if (key != "_id") {
                    content += `<li data-node="child">${key}: ${data[key]}</li>`;
                }
            }
        }
    }
    return content;
};
*/