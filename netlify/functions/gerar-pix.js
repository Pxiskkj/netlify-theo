exports.handler = async (event) => {

  // Impede erro quando acessar via navegador (GET)
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método não permitido" })
    };
  }

  try {

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Body vazio" })
      };
    }

    const body = JSON.parse(event.body);

    const response = await fetch("https://api.pluggoucash.com/v1/transactions/create-pix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.PLUGGOU_API_KEY}`
      },
      body: JSON.stringify({
        amount: body.amount,
        description: "Doação para tratamento do Theo",
        payer: {
          name: body.name,
          document: body.document
        }
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
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
