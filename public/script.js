const roomStock = {
    Single: 7,
    Double: 7,
    Twin: 2
};
// ===============================
// ROOM DATABASE
// ===============================
const rooms = {
    Single: {
        price: 80000,
        capacity: 1,
        images: [
            "images/single1.jpg",
            "images/single2.jpg"
        ]
    },
    Double: {
        price: 130000,
        capacity: 2,
        images: [
            "images/double1.jpg",
            "images/double2.jpg"
        ]
    },
    Twin: {
        price: 150000,
        capacity: 2,
        images: [
            "images/twin1.jpg",
            "images/twin2.jpg"
        ]
    }
};

// ===============================
// ROOM INFO + PRICE + IMAGES
// ===============================
function updateRoomInfo() {
    const room = document.getElementById("room")?.value;
    const nights = document.getElementById("nights")?.value || 1;

    const data = rooms[room];
    if (!data) return;

    // PRICE
    const priceDisplay = document.getElementById("priceDisplay");
    if (priceDisplay) {
        priceDisplay.innerText =
            "Total Price: UGX " + (data.price * nights);
    }

    // MAIN IMAGE
    const mainImage = document.getElementById("roomImage");
    if (mainImage) {
        mainImage.src = data.images[0];
    }

    // GALLERY (optional)
    const gallery = document.getElementById("gallery");
    if (gallery) {
        gallery.innerHTML = "";

        data.images.forEach(img => {
            const image = document.createElement("img");
            image.src = img;
            image.style.width = "100px";
            image.style.margin = "5px";
            image.style.borderRadius = "8px";

            gallery.appendChild(image);
        });
    }
}

// ===============================
// BOOKING SYSTEM
// ===============================
async function bookRoom() {
    const data = {
        name: document.getElementById("name")?.value,
        phone: document.getElementById("phone")?.value,
        room: document.getElementById("room")?.value,
        nights: document.getElementById("nights")?.value,
        paymentMethod: document.getElementById("payment")?.value
    };

    const res = await fetch("/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await res.json();

    const resultBox = document.getElementById("result");
    if (resultBox) {
        resultBox.innerHTML =
            "✅ Booking Successful!<br>" +
            "Total: UGX " + result.booking.totalPrice;
    }
}

// ===============================
// INITIAL PAGE SETUP
// ===============================
window.addEventListener("load", () => {

    // AUTO ROOM FROM URL
    const params = new URLSearchParams(window.location.search);
    const roomFromURL = params.get("room");

    const roomSelect = document.getElementById("room");

    if (roomFromURL && roomSelect) {
        roomSelect.value = roomFromURL;
    }

    updateRoomInfo();

    // EVENTS
    roomSelect?.addEventListener("change", updateRoomInfo);
    document.getElementById("nights")
        ?.addEventListener("input", updateRoomInfo);

    // SLIDER INIT
    initSlider();
});

// ===============================
// IMAGE SLIDER (SAFE + SWIPE)
// ===============================
let currentSlide = 0;

function initSlider() {
    const slider = document.querySelector(".slider");
    if (!slider) return;

    const slides = slider.querySelectorAll(".slide");
    const dots = slider.querySelectorAll(".dot");

    if (!slides.length) return;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove("active"));
        dots.forEach(d => d.classList.remove("active"));

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add("active");

        if (dots[currentSlide]) {
            dots[currentSlide].classList.add("active");
        }
    }

    // BUTTONS
    slider.querySelector(".next")?.addEventListener("click", () => {
        showSlide(currentSlide + 1);
    });

    slider.querySelector(".prev")?.addEventListener("click", () => {
        showSlide(currentSlide - 1);
    });

    // AUTO SLIDE
    setInterval(() => {
        showSlide(currentSlide + 1);
    }, 4000);

    // SWIPE SUPPORT
    let startX = 0;

    slider.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    });

    slider.addEventListener("touchend", (e) => {
        let endX = e.changedTouches[0].clientX;

        if (startX - endX > 50) {
            showSlide(currentSlide + 1);
        } else if (endX - startX > 50) {
            showSlide(currentSlide - 1);
        }
    });
}
function bookRoom() {
    const room = document.getElementById("room").value;
    const nights = document.getElementById("nights").value;

    const data = {
        id: Date.now(), // unique ID
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        room: room,
        nights: nights,
        paymentMethod: document.getElementById("payment").value,
        totalPrice: rooms[room].price * nights,
        status: "Pending"
    };

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.push(data);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    document.getElementById("result").innerHTML =
        "Booking successful! Status: Pending";
}
function getAvailability(roomType) {
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    // count ONLY approved bookings
    const used = bookings.filter(b => 
        b.room === roomType && b.status === "Approved"
    ).length;

    const total = roomStock[roomType];

    return {
        total: total,
        used: used,
        available: total - used
    };
}
// AVAILABILITY
const availability = getAvailability(room);

const availabilityBox = document.getElementById("availability");

if (availabilityBox) {
    availabilityBox.innerText =
        "Available Rooms: " +
        availability.available + " / " +
        availability.total;
}