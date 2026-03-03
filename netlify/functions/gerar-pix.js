const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event) => {
  try {

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Método não permitido" })
      };
    }

    const { valor } = JSON.parse(event.body);

    const response = await fetch("https://api.pluggou.com/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PLUGGOU_SECRET_KEY}`
      },
      body: JSON.stringify({
        amount: valor,
        payment_method: "pix",
        description: "Doação",
        customer: {
          name: "Doador",
          email: "email@email.com",
          document: "12345678909"
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: 400,
        body: JSON.stringify(data)
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        pixCode: data.pix?.copy_paste
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};