$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('_id');
    getTicketById(ticketId);
});

function getTicketById(ticketId) {
    fetch(`http://localhost:8088/api/todo/${ticketId}`, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ZjQwNDc0ZWY1MDdkNmNkZmYyZWQ4NGE0NjdiMGJiMTkyMjo5NzNhMjhjN2Q5MGQ4ZTg3M2E5OTRlMmViNDk4ZGQ0MzQ1NmF0MFBwMVQ='
        // 'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
    .then((response) => response.json())
    .then((data) => {
        if (data && data.result && data.result.length > 0) {
            console.log(data);
            showTicketDetails(data.result[0]);
        }
    })
    .catch((err) => console.log(err));
}

function showTicketDetails(ticketObj) {
    $('#nir-ticket-number').text(ticketObj.ticketNumber);
    $('#nir-ticket-title').text(ticketObj.title);
    $('#nir-ticket-desc').text(ticketObj.desc);
    $('#nir-ticket-status').text(getStatus(ticketObj.status));
    $('#nir-ticket-assignedto').text(ticketObj.asignee);
}

function getStatus(status) {
    if (status === 'in-progress') {
        return 'In Progress'
    } else if (status === 'not-started') {
        return 'Not Started';
    } else if (status === 'completed') {
        return 'Completed';
    }
    return 'Not Started';
}