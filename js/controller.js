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
    const query = makeQuery(listNode);
    const div = document.createElement("div");
    const addUpdateBtn = document.createElement("button");
    if (listNode.dataset.node == "child") {
        addUpdateBtn.innerHTML = "Update";
        addUpdateBtn.addEventListener("click", () => { addForm(listNode, div, { type: "update", valuePlaceholder: "Enter new value", target: query }); });
    } else {
        addUpdateBtn.innerHTML = "Add";
        addUpdateBtn.addEventListener("click", () => { addForm(listNode, div, { type: "add", target: query }); });
    }
    const removeBtn = document.createElement("button");
    removeBtn.addEventListener("click", () => { addForm(listNode, div, { type: "remove", target: query }); });
    const moveBtn = document.createElement("button");
    moveBtn.addEventListener("click", () => { addForm(listNode, div, { type: "move", valuePlaceholder: "Enter Destination key", target: query }); });
    removeBtn.innerHTML = "Remove";
    moveBtn.innerHTML = "Move";
    div.classList.add("controllerDiv");
    if(listNode.innerHTML == "parent") {
        div.append(addUpdateBtn);
    } else {
        div.append(addUpdateBtn, removeBtn, moveBtn);
    }
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


const addForm = (listNode, div, { type, target, valuePlaceholder = "value" }) => {

    const form = document.createElement("form");
    form.action = "/index";
    form.method = "POST";
    const value = document.createElement("input");
    value.required = "required";
    const addBtn = document.createElement("input");
    const actionToPerform = document.createElement("input");
    const queryToFind = document.createElement("input");
    actionToPerform.type = queryToFind.type = "hidden";
    actionToPerform.value = type;
    actionToPerform.name = "action";
    queryToFind.value = target;
    queryToFind.name = "query";

    value.type = "text";
    value.name = "value";
    addBtn.type = "submit";
    addBtn.value = type;
    if (type == "add") {
        const key = document.createElement("input");
        key.type = value.type = "text";
        key.name = key.placeholder = "key";
        key.required = "require";
        form.append(key);
    }
    value.placeholder = valuePlaceholder;
    if (type == "remove") {
        addBtn.value = "Remove";
        form.append(actionToPerform, queryToFind, addBtn);
    } else {
        form.append(value, actionToPerform, queryToFind, addBtn);
    }
    div.replaceWith(form);
    listNode.removeEventListener("mouseenter", appendController);

}


const makeQuery = (node) => {

    let query = "" + node.innerHTML.split(":")[0];
    while (node.parentElement.previousElementSibling != null) {
        node = node.parentElement.previousElementSibling;
        if (node.nodeName == "LI" && node.innerHTML != "parent") {
            query += "." + node.innerHTML;
        }
    }
    return query.split(".").reverse().join(".");
}

export { addController };