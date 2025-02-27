document.addEventListener("DOMContentLoaded", function () {
    // Heart Disease Prediction Form
    document.getElementById("heartForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch("/predict/heart-disease", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        document.getElementById("result").innerText = "Heart Disease Prediction: " + result.prediction;
    });

    // Diabetes Prediction Form
    document.getElementById("diabetesForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch("/predict/diabetes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        document.getElementById("result").innerText = "Diabetes Prediction: " + result.prediction;
    });
});
