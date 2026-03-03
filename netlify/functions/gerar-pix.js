exports.handler = async (event) => {

  // Só aceita POST
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
        description: "Doação para tratamento",
        payer: {
          name: body.name || "Doador",
          document: body.document || "00000000000"
        }
      })
    });

    const data = await response.json();

    // Retorna exatamente o que a Pluggou respondeu
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
