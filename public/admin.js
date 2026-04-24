// ===============================
// ROOM STOCK (MUST MATCH script.js)
// ===============================
const roomStock = {
    Single: 7,
    Double: 7,
    Twin: 2
};

// ===============================
// AVAILABILITY FUNCTION
// ===============================
function getAvailability(roomType) {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    const used = bookings.filter(b =>
        b.room === roomType && b.status === "Approved"
    ).length;

    const total = roomStock[roomType];

    return {
        total,
        used,
        available: total - used
    };
}

// ===============================
// LOAD BOOKINGS
// ===============================
function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const table = document.getElementById("bookingsTable");

    if (!table) return;

    table.innerHTML = "";

    bookings.forEach(b => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${b.name || ""}</td>
            <td>${b.phone || ""}</td>
            <td>${b.room || ""}</td>
            <td>${b.nights || ""}</td>
            <td>${b.paymentMethod || ""}</td>
            <td>UGX ${b.totalPrice || 0}</td>
            <td>${b.status || "Pending"}</td>
            <td>
                <button onclick="approveBooking(${b.id})">Approve</button>
                <button onclick="deleteBooking(${b.id})">Delete</button>
            </td>
        `;

        table.appendChild(row);
    });
}

// ===============================
// APPROVE BOOKING
// ===============================
function approveBooking(id) {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    bookings = bookings.map(b => {
        if (b.id === id) {
            b.status = "Approved";
        }
        return b;
    });

    localStorage.setItem("bookings", JSON.stringify(bookings));

    loadBookings();
    showRoomStats();
}

// ===============================
// DELETE BOOKING
// ===============================
function deleteBooking(id) {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    bookings = bookings.filter(b => b.id !== id);

    localStorage.setItem("bookings", JSON.stringify(bookings));

    loadBookings();
    showRoomStats();
}

// ===============================
// ROOM STATS
// ===============================
function showRoomStats() {
    const container = document.getElementById("roomStats");

    if (!container) return;

    container.innerHTML = "";

    ["Single", "Double", "Twin"].forEach(room => {
        const data = getAvailability(room);

        const div = document.createElement("div");

        div.innerHTML = `
            <strong>${room}</strong>: 
            ${data.available} available / ${data.total}
        `;

        container.appendChild(div);
    });
}

// ===============================
// INIT
// ===============================
window.onload = () => {
    loadBookings();
    showRoomStats();
};