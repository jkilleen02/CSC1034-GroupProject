const API_URL = "https://ngeorge05.webhosting1.eeecs.qub.ac.uk/dbConnector.php";

let chartInstance = null;

function sendQuery(query) {
    return fetch(API_URL, {
        method: "POST",
        body: new URLSearchParams({ query: query })
    }).then(res => res.json());
}

function addFundraiser() {
    let name = document.getElementById("name").value;
    let location = document.getElementById("location").value;
    let target = document.getElementById("target").value;

    if (name === "" || location === "" || target === "") {
        alert("Please fill all fields");
        return;
    }

    let query = "INSERT INTO tblfundraiser (fundraiserName, fundraiserLocation, fundraiserDate, targetAmount) VALUES ('"
        + name + "', '" + location + "', CURDATE(), " + target + ")";

    sendQuery(query).then(result => {
        if (!result.success) {
            alert(result.error);
            return;
        }

        alert("Fundraiser added!");
        loadFundraisers();
    });
}

function loadFundraisers() {
    let query = "SELECT * FROM tblfundraiser";

    sendQuery(query).then(result => {
        if (!result.success) {
            alert(result.error);
            return;
        }

        let table = document.getElementById("table");
        table.innerHTML = "";

        let names = [];
        let targets = [];

        result.data.forEach(f => {
            names.push(f.fundraiserName);
            targets.push(f.targetAmount);

            table.innerHTML += `
                <tr>
                    <td>${f.fundraiserName}</td>
                    <td>${f.fundraiserLocation}</td>
                    <td>${f.targetAmount}</td>
                    <td>
                        <button onclick="editFundraiser(${f.fundraiserID})">Edit</button>
                        <button class="delete-btn" onclick="deleteFundraiser(${f.fundraiserID})">Delete</button>
                    </td>
                </tr>
            `;
        });

        loadChart(names, targets);
    });
}

function editFundraiser(id) {
    let name = prompt("Enter new fundraiser name:");
    let location = prompt("Enter new location:");
    let target = prompt("Enter new target amount:");

    if (!name || !location || !target) {
        return;
    }

    let query = "UPDATE tblfundraiser SET fundraiserName='"
        + name + "', fundraiserLocation='"
        + location + "', targetAmount="
        + target + " WHERE fundraiserID=" + id;

    sendQuery(query).then(result => {
        if (!result.success) {
            alert(result.error);
            return;
        }

        alert("Fundraiser updated!");
        loadFundraisers();
    });
}

function deleteFundraiser(id) {
    if (!confirm("Are you sure you want to delete this fundraiser?")) {
        return;
    }

    let query = "DELETE FROM tblfundraiser WHERE fundraiserID=" + id;

    sendQuery(query).then(result => {
        if (!result.success) {
            alert(result.error);
            return;
        }

        loadFundraisers();
    });
}

function loadChart(names, targets) {
    let ctx = document.getElementById("myChart").getContext("2d");

    if (chartInstance !== null) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: names,
            datasets: [{
                label: "Target Amount",
                data: targets
            }]
        }
    });
}
