// Load Data
function loadData(data) {
    let parentElement = document.getElementById("mainArea");
    for (let i = 0; i < data.length; i++) {
        let childrenElement = document.createElement("div");

        let grandChildrenElement1 = document.createElement("span");
        grandChildrenElement1.innerHTML = "TITLE: " + data[i].title + " ";

        let grandChildrenElement2 = document.createElement("span");
        grandChildrenElement2.innerHTML = "; DESCRIPTION: " + data[i].description + " ";

        let grandChildrenElement3 = document.createElement("button");
        grandChildrenElement3.innerHTML = 'Delete';
        let gist = "deleteData(" + data[i].id + ")";
        grandChildrenElement3.setAttribute("onclick", gist);

        childrenElement.appendChild(grandChildrenElement1);
        childrenElement.appendChild(grandChildrenElement2);
        childrenElement.appendChild(grandChildrenElement3);

        parentElement.appendChild(childrenElement);
    }
}

// Get data Using GET Request
function getData() {
    // Make this shit on your own
    fetch("http://localhost:3000/todos/")
        .then(response => {
            if (!response.ok) {
                throw new Error("HTTP status code: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            loadData(data);
        })
        .catch(error => {
            // Handle any errors that occurred during the request
            console.log("Error:", error);
        });

}

// Delete todos using DELETE Request
function deleteData(id) {
    let url = "http://localhost:3000/todos/" + id;
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(() => {
            console.log("Deleted a todo");
            let parentElement = document.getElementById("mainArea");
            parentElement.innerHTML = "";
            getData();
        })
}

// Create Data Using POST Request and Reload the Data
function onPress() {
    let title = document.getElementById("title");
    let description = document.getElementById("description");

    fetch("http://localhost:3000/todos/", {
        method:"POST",
        body:JSON.stringify({
            title:title.value,
            description:description.value
        }),
        headers:{
            "Content-Type":"application/json"
        }
    }).then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        let parentElement = document.getElementById("mainArea");
        parentElement.innerHTML = "";
        getData();
    });
}

window.onload = () => {
    getData();
    let button = document.getElementsByTagName("button")[0];
    button.setAttribute("onclick", "onPress()");
}
