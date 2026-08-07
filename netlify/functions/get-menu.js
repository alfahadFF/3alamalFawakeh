exports.handler = async function (event, context) {
  // قراءة رابط غوغل شيت من متغيرات البيئة
  const sheetUrl = process.env.GOOGLE_SHEET_CSV_URL;

  if (!sheetUrl) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "GOOGLE_SHEET_CSV_URL variable is missing" }),
    };
  }

  try {
    // استخدام fetch المدمجة أصلياً في Node.js
    const response = await fetch(sheetUrl);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: `Failed to fetch Google Sheet: ${response.statusText}`,
      };
    }

    const csvData = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      },
      body: csvData,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
