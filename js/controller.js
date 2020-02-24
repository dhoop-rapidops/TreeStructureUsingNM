const removeController = async (event) => {
    if (event.target.querySelector("div")) {
        event.target.querySelector("div").remove();
    }
    if (event.target.querySelector("form")) {
        event.target.addEventListener("mouseenter", appendController);
        event.target.querySelector("form").remove();
    }
}


const appendController = async (event) => {
    const listNode = event.target;
    const div = document.createElement("div");
    const addUpdateBtn = document.createElement("button");
    if (listNode.dataset.node == "child") {
        addUpdateBtn.innerHTML = "Update";
        addUpdateBtn.addEventListener("click", () => { addForm(listNode, div, { type: "update", valuePlaceholder: "Enter new value" }); });

    } else {
        console.log(event.target.parentElement.previousElementSibling);
        addUpdateBtn.innerHTML = "Add";
        addUpdateBtn.addEventListener("click", () => { addForm(listNode, div, { type: "add" }); });
    }
    const removeBtn = document.createElement("button");
    const moveBtn = document.createElement("button");
    moveBtn.addEventListener("click", () => { addForm(listNode, div, { type: "move", valuePlaceholder: "Enter Destination key" }); });
    removeBtn.innerHTML = "Remove";
    moveBtn.innerHTML = "Move";
    div.classList.add("controllerDiv");
    div.append(addUpdateBtn, removeBtn, moveBtn);
    listNode.append(div);
}   


/**
 * Get all li element and add controller
 */
const addController = () => {
    document.querySelectorAll("li").forEach((list) => {
        list.addEventListener("mouseenter", appendController);
        list.addEventListener("mouseleave", removeController);
    });
}


const addForm = (listNode, div, { type, valuePlaceholder = "value" }) => {
    const form = document.createElement("form");
    form.action = "/index";
    form.method = "POST";
    const value = document.createElement("input");
    const addBtn = document.createElement("input");
    const actionToPerform = document.createElement("input");
    actionToPerform.type = "hidden";
    actionToPerform.value = type;
    actionToPerform.name = "action";
    value.type = "text";
    value.name = "value";
    addBtn.type = "submit";
    addBtn.value = "Add";
    if (type == "add") {
        const key = document.createElement("input");
        key.type = value.type = "text";
        key.name = key.placeholder = "key";
        form.append(key);
    }
    value.placeholder = valuePlaceholder;
    form.append(value, actionToPerform, addBtn);
    listNode.removeEventListener("mouseenter", appendController);
    div.replaceWith(form);
}


export { addController };