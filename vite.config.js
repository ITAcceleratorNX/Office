import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { processLead } from "./api/lib/process-lead.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      {
        name: "lead-api-dev",
        configureServer(server) {
          server.middlewares.use("/api/send-lead", (req, res, next) => {
            if (req.method !== "POST") {
              next();
              return;
            }

            let raw = "";
            req.on("data", (chunk) => {
              raw += chunk;
            });
            req.on("end", async () => {
              try {
                const payload = raw ? JSON.parse(raw) : {};
                await processLead(payload);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ ok: true }));
              } catch (err) {
                const status = err.code === "VALIDATION" ? 400 : err.code === "CONFIG" ? 503 : 500;
                res.statusCode = status;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    error: err.message || "Не удалось отправить заявку",
                    fields: err.fields || undefined,
                  })
                );
              }
            });
          });
        },
      },
    ],
  };
});
