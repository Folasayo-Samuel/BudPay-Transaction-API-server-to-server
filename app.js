const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const BUDPAY_API_BASE_URL = "https://api.budpay.com/api/s2s";
const SECRET_KEY = "";

app.post("/test/encryption", async (req, res) => {
  try {
    const cardPayload = {
      data: {
        number: "5123450000000008",
        expiryMonth: "10",
        expiryYear: "22",
        cvv: "100",
        pin: "1234",
      },
      reference: "1253627873656276350",
    };

    const encryptedCard = await encryptCard(cardPayload);
    res.json({ card: encryptedCard });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Encryption failed", message: error.message });
  }
});

async function encryptCard(cardPayload) {
  try {
    const response = await axios.post(
      `${BUDPAY_API_BASE_URL}/test/encryption`,
      cardPayload,
      {
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error("Card encryption failed");
  }
}

app.post("/transaction/initialize", async (req, res) => {
  try {
    const transactionPayload = req.body;

    const transactionResponse = await initializeTransaction(transactionPayload);
    res.json({
      status: true,
      message: "Transaction initialized",
      data: transactionResponse,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: "Transaction initialization failed",
      message: error.message,
    });
  }
});

async function initializeTransaction(transactionPayload) {
  try {
    const response = await axios.post(
      `${BUDPAY_API_BASE_URL}/transaction/initialize`,
      transactionPayload,
      {
        headers: {
          Authorization: `Bearer ${SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Transaction initialization failed");
  }
}

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
