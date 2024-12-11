import "dotenv/config";
import { app } from "./app";
const port = process.env.PORT || 9000;
function startServer() {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting server", error);
  }
}
startServer();
