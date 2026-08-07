const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const GOOGLE_SHEET_CSV_URL = process.env.GOOGLE_SHEET_CSV_URL;

  if (!GOOGLE_SHEET_CSV_URL) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "لم يتم إعداد رابط غوغل شيت في متغيرات البيئة." })
    };
  }

  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL);
    const csvData = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "max-age=60, public"
      },
      body: csvData
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "فشل في جلب البيانات" })
    };
  }
};
