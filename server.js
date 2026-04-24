const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// CONNECT DATABASE
mongoose.connect("cmongodb+srv://munezerogodwin738:<db_password>@cluster0.owhvk6l.mongodb.net/?appName=Cluster0")
.then(() => console.log("Database connected"))
.catch(err => console.log(err));
app.use(express.json());
app.use(express.static("public"));

const Booking = require("./models/Booking");

app.post("/book", async (req, res) => {
    const { name, phone, room, nights, paymentMethod } = req.body;

    const prices = {
        Single: 80000,
        Double: 130000,
        Twin: 150000
    };

    const totalPrice = prices[room] * Number(nights);

    const booking = new Booking({
        name,
        phone,
        room,
        nights,
        totalPrice,
        paymentMethod,
        status: "pending"
    });

    await booking.save();

    // Simulate payment request
    console.log(`Sending ${paymentMethod} payment request to ${phone}`);

    res.json({
        message: "Booking created. Complete payment on your phone.",
        booking
    });
});

// ADMIN VIEW
app.get("/admin/bookings", (req, res) => {
    res.json(bookings);
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
const ADMIN = {
    username: "admin",
    password: "munezero45"
};

app.post("/admin/login", (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN.username && password === ADMIN.password) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.post("/confirm-payment/:id", async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    booking.status = "paid";
    await booking.save();

    res.json({ message: "Payment confirmed" });
});
const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

// SERVE FRONTEND
app.use(express.static(path.join(__dirname, "public")));

// DEFAULT ROUTE
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, () => {
    console.log("Server running...");
});