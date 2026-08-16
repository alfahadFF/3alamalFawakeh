exports.handler = async (event) => {
  const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
  const CASHIER_PIN = process.env.CASHIER_PIN;

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, x-cashier-pin",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "OK" };
  }

  try {
    // إرسال طلب جديد من المنيو أو تحديث حالة من الكاشير
    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");

      // التحقق من صلاحية الكاشير في حال تعديل الحالة
      if (body.action === "update_status") {
        const clientPin = event.headers["x-cashier-pin"];
        if (clientPin !== CASHIER_PIN) {
          return { statusCode: 401, headers, body: JSON.stringify({ error: "غير مصرح: رمز PIN غير صحيح" }) };
        }
      }

      const response = await fetch(SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    // جلب الطلبات (محمي بالكامل برمز PIN)
    if (event.httpMethod === "GET") {
      const clientPin = event.headers["x-cashier-pin"] || event.queryStringParameters?.pin;
      
      if (!clientPin || clientPin !== CASHIER_PIN) {
        return { 
          statusCode: 401, 
          headers, 
          body: JSON.stringify({ error: "غير مصرح: يرجى إدخال رمز الكاشير الصحيح" }) 
        };
      }

      const response = await fetch(SCRIPT_URL);
      const data = await response.json();
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };

  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
