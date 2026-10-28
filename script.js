const form = document.getElementById("appointmentForm");
const list = document.getElementById("appointmentList");
const message = document.getElementById("message");
const emptyMessage = document.getElementById("emptyMessage");
const dateInput = document.getElementById("date");

let appointments = JSON.parse(
    localStorage.getItem("outpatientAppointments") || "[]"
);

// Prevent booking past dates
const today = new Date();
const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

dateInput.min = localToday;

function saveAppointments() {
    localStorage.setItem(
        "outpatientAppointments",
        JSON.stringify(appointments)
    );
}

function displayAppointments() {
    list.innerHTML = "";

    appointments.forEach(function (appointment) {
        const row = document.createElement("tr");

        [
            appointment.patient,
            appointment.doctor,
            appointment.date,
            appointment.time
        ].forEach(function (value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const cancelButton = document.createElement("button");

        cancelButton.textContent = "Cancel";
        cancelButton.className = "cancel-btn";
        cancelButton.type = "button";

        cancelButton.addEventListener("click", function () {
            appointments = appointments.filter(function (item) {
                return item.id !== appointment.id;
            });

            saveAppointments();
            displayAppointments();
            message.style.color = "#087eaf";
            message.textContent = "Appointment cancelled.";
        });

        actionCell.appendChild(cancelButton);
        row.appendChild(actionCell);
        list.appendChild(row);
    });

    emptyMessage.style.display =
        appointments.length === 0 ? "block" : "none";
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const patient = document.getElementById("patientName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const doctor = document.getElementById("doctor").value;
    const date = dateInput.value;
    const time = document.getElementById("time").value;

    if (!patient || !doctor || !date || !time ||
        !/^[0-9]{10}$/.test(phone)) {
        message.style.color = "#dc3545";
        message.textContent =
            "Please enter valid details and a 10-digit phone number.";
        return;
    }

    if (date < localToday) {
        message.style.color = "#dc3545";
        message.textContent = "Please select today or a future date.";
        return;
    }

    const alreadyBooked = appointments.some(function (item) {
        return item.doctor === doctor &&
               item.date === date &&
               item.time === time;
    });

    if (alreadyBooked) {
        message.style.color = "#dc3545";
        message.textContent =
            "This doctor's time slot is already booked.";
        return;
    }

    const appointment = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        patient: patient,
        phone: phone,
        doctor: doctor,
        date: date,
        time: time
    };

    appointments.push(appointment);
    saveAppointments();
    displayAppointments();

    message.style.color = "#198754";
    message.textContent = "Appointment booked successfully!";

    form.reset();
    dateInput.min = localToday;
});

displayAppointments();
