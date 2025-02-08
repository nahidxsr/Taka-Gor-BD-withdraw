document.addEventListener("DOMContentLoaded", function () {
    let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // Check if user is logged in, else redirect to login
    if (!loggedInUser) {
        window.location.href = "https://nahidxsr.github.io/login/";
        return;
    }

    // Set up balance
    let balance = loggedInUser.balance || 0;
    let takaBalance = (balance / 100).toFixed(2);

    document.getElementById("userBalance").innerText = balance;
    document.getElementById("userTaka").innerText = takaBalance;

    // Nagad/Bkash withdraw popup
    let nagadBtn = document.getElementById("nagad-btn");
    let bkashBtn = document.getElementById("bkash-btn");
    let walletBtn = document.getElementById("wallet-btn");
    let popupMethod = document.getElementById("popupMethod");
    let popupWallet = document.getElementById("popupWallet");

    nagadBtn.addEventListener("click", function () {
        popupMethod.style.display = "block";
    });

    bkashBtn.addEventListener("click", function () {
        popupMethod.style.display = "block";
    });

    walletBtn.addEventListener("click", function () {
        popupWallet.style.display = "block";
    });

    document.querySelectorAll(".close-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            popupMethod.style.display = "none";
            popupWallet.style.display = "none";
        });
    });

    // Update selected amount on click
    document.querySelectorAll(".amount-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            document.getElementById("amountInput").value = btn.textContent;
        });
    });

    // Submit button for Nagad/Bkash withdraw
    document.getElementById("submitNagadBkash").addEventListener("click", function () {
        const amount = document.getElementById("amountInput").value || "0";
        const selectedMethod = nagadBtn.checked ? 'Nagad' : 'Bkash';
        const message = `Withdraw request via ${selectedMethod}:\nAmount: ${amount} Taka`;
        sendToTelegram(message);  // Send message to Telegram bot
        popupMethod.style.display = "none";
    });

    // Submit button for Wallet withdraw
    document.getElementById("submitWallet").addEventListener("click", function () {
        let address = document.getElementById("walletAddress").value;
        if (address.trim() === "") {
            alert("Please enter your wallet address.");
        } else {
            const message = `Withdraw request to wallet:\nAddress: ${address}\nAmount: ${takaBalance} Taka`;
            sendToTelegram(message);  // Send message to Telegram bot
            popupWallet.style.display = "none";
        }
    });

    // Function to send message to Telegram bot
    function sendToTelegram(message) {
        const botToken = 'YOUR_BOT_TOKEN';  // Replace with your bot token
        const chatId = 'YOUR_CHAT_ID';  // Replace with your chat ID
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

        const data = {
            chat_id: chatId,
            text: message,
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (response.ok) {
                alert('Withdrawal request sent to Telegram.');
            } else {
                alert('Failed to send message. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error occurred while sending the message.');
        });
    }
});
