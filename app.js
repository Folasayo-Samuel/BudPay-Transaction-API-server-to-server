const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const BUDPAY_API_BASE_URL = "https://api.budpay.com/api/s2s";
const SECRET_KEY = "sk_test_8blwbw6lalioquhbcvlooruz2qcsyksgmzsde6k";

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

app.post("/mastercard-payment/3ds2auth", async (req, res) => {
  try {
    const response = req.body;
    console.log(response.data);

    const { url, method, payload } = response._links;
    const dataToSend = {};

    payload.forEach((param) => {
      dataToSend[param] = response[param];
    });

    const responseFromLinks = await axios({
      method,
      url,
      data: dataToSend,
    });

    console.log(responseFromLinks.data);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post("/mastercard-payment/authpayer", (req, res) => {
  try {
    const response = req.body;
    console.log(response);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
