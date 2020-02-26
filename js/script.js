import { addController } from "./controller.js";
const container = document.querySelector(".container");

const displayData = async() => {
    const json = await fetch("http://127.0.0.1:3696/api/alldata");
    const data = await json.json();
    container.innerHTML = `<li>parent</li><ul>` + makeTree(data) + `</ul>`;
    console.log(data);
    addController();
    Array.from(document.getElementsByClassName("dot")).forEach(ele => {
        findHeight(ele);
    });
    //console.log(previousElementPosition);
}

displayData();

const makeTree = (docs) => {
    let content = "";
    docs.forEach(data => {
        const eachDocument = (data) => {
            let content = "";
            for (let key in data) {
                if (typeof data[key] === "object") {
                    content += `<li><span class="dot"><span class="line"></span></span>${key}</li><ul>`;
                    content += `${eachDocument(data[key])}`;
                    content += `</ul>`
                } else {
                    content += `<li data-node="child"><span class="dot"><span class="line"></span></span>${key}: ${data[key]}</li>`;
                }
            }
            return content;
        }
        content += eachDocument(data);
    })
    return content;
}

const previousElementPosition = [];

const findHeight = (ele) => {
    const pos = ele.getBoundingClientRect();
    for (let x = previousElementPosition.length - 1; x >= 0; x--) {
        if (pos.x > previousElementPosition[x].x) {
            break;
        }
        if (previousElementPosition[x].x == pos.x) {
            let distance = pos.y - previousElementPosition[x].y;
            if (distance > 0) {
                ele.firstElementChild.style.height = distance + "px";
            }
            break;
        }
    }
    previousElementPosition.push({ x: pos.x, y: pos.y });
};