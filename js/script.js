import { addController } from "./controller.js";
const container = document.querySelector(".container");

const displayData = async () => {
    const json = await fetch("http://127.0.0.1:3696/api/alldata");
    const data = await json.json();
    container.innerHTML = `<li>parent</li><ul>` + makeTree(data) + `</ul>`;
    console.log(data);
    addController();
}

displayData();

const makeTree = (docs) => {
    let content = "";
    docs.forEach(data => {
        const eachDocument = (data) => {
            let content = "";
            for (let key in data) {
                if (typeof data[key] === "object") {
                    content += `<li>${key}</li><ul>`;
                    content += `${eachDocument(data[key])}`;
                    content += `</ul>`
                } else {
                    content += `<li data-node="child">${key}: ${data[key]}</li>`;
                }
            }
            return content;
        }
        content += eachDocument(data);
    })
    return content;
}
