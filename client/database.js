const execute = async (sql, params = [], config = {}) => {
  let dbUrl = config.databaseUrl || process.env.DATABASE_URL;
  const authToken = config.databaseToken || process.env.DATABASE_AUTH_TOKEN;

  if (!dbUrl) {
    throw new Error("A URL do banco de dados (databaseUrl) não foi informada.");
  }

  dbUrl =
    (dbUrl.startsWith("libsql://")
      ? dbUrl.replace("libsql://", "https://")
      : dbUrl
    ).replace(/\/+$/, "") + "/v2/pipeline";

  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  const requestsList = [];

  for (const stmt of statements) {
    let formattedSql = stmt;

    if (params && params.length > 0) {
      for (const param of params) {
        const value = typeof param === "string" ? `'${param}'` : String(param);
        formattedSql = formattedSql.replace("?", value);
      }
    }

    requestsList.push({
      type: "execute",
      stmt: { sql: formattedSql },
    });
  }

  requestsList.push({ type: "close" });

  const payload = { requests: requestsList };
  const headers = { "Content-Type": "application/json" };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(dbUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
    }

    const res = await response.json();
    const results = res.results || [];

    const allRows = [];
    for (const result of results) {
      if (result.response && result.response.result) {
        const rs = result.response.result;
        const rawRows = rs.rows || [];

        for (const row of rawRows) {
          if (Array.isArray(row)) {
            allRows.push(row.map((col) => col.value));
          } else {
            allRows.push(row);
          }
        }
      } else if (result.type === "error") {
        throw new Error(
          `Erro no SQL do Turso: ${JSON.stringify(result.error)}`,
        );
      }
    }

    return allRows;
  } catch (e) {
    console.error("Falha ao executar query no Turso:", e.message);
    throw e;
  }
};
