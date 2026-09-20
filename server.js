// Entry point for cPanel's "Setup Node.js App" (Phusion Passenger).
// Passenger requires a plain Node HTTP server file to load — it doesn't run
// "npm start" / "next start" itself. This just boots Next.js's own request
// handler on the port Passenger assigns via process.env.PORT.
//
// Set this file as the "Application startup file" when creating the app in
// cPanel. Everything else (routes, API, middleware) still works exactly the
// same — this only changes how the server process is started.
const { createServer } = require("http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(process.env.PORT || 3000, () => {
    console.log(`SwiftToolHub listening on port ${process.env.PORT || 3000}`);
  });
});
