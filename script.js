document.addEventListener("DOMContentLoaded", function () {
  let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!loggedInUser) {
    window.location.href = "https://nahidxsr.github.io/login/";
    return;
  }

  let balance = loggedInUser.balance || 0;
  let takaBalance = (balance / 100).toFixed(2);

  document.getElementById("userBalance").innerText = balance;
  document.getElementById("userTaka").innerText = takaBalance;

  let nagadBtn = document.getElementById("nagad-btn");
  let bkashBtn = document.getElementById("bkash-btn");
  let walletBtn = document.getElementById("wallet-btn");
  let popupMethod = document.getElementById("popupMethod");
  let popupWallet = document.getElementById("popupWallet");
  let withdrawRequest = document.getElementById("withdrawRequest");

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

  // Select amount
  document.querySelectorAll(".amount-option").forEach(function (btn) {
    btn.addEventListener("click", function () {
      let amount = this.getAttribute("data-amount");
      withdrawRequest.innerText = `আপনি ${amount} টাকা উইথড্র করতে চান। নাম্বার দিন।`;
      document.getElementById("submitNagadBkash").disabled = false;
    });
  });

  // Submit button for Nagad/Bkash withdraw
  document.getElementById("submitNagadBkash").addEventListener("click", function () {
    let phoneNumber = document.getElementById("phoneNumber").value;
    if (phoneNumber.trim() === "") {
      alert("দয়া করে নাম্বার লিখুন।");
      return;
    }

    let amount = withdrawRequest.innerText.split(" ")[1];
    const message = `Withdraw request via ${amount} Taka:\nPhone Number: ${phoneNumber}`;
    sendToTelegram(message);
    popupMethod.style.display = "none";
  });

  // Submit button for Wallet withdraw
  document.getElementById("submitWallet").addEventListener("click", function () {
    let selectedWallet = document.querySelector('input[name="walletOption"]:checked');
    let address = document.getElementById("walletAddress").value;
    if (!selectedWallet) {
      alert("দয়া করে একটি ওয়ালেট নির্বাচন করুন।");
      return;
    }

    if (address.trim() === "") {
      alert("দয়া করে আপনার অ্যাড্রেস লিখুন।");
      return;
    }

    const walletType = selectedWallet.value;
    const message = `Withdraw request to wallet:\nWallet: ${walletType}\nAddress: ${address}\nAmount: ${takaBalance} Taka`;
    sendToTelegram(message);
    popupWallet.style.display = "none";
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
      alert('Error occurred while sending message.');
    });
  }
});
