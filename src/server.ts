import app from "./app";
import { connectDB } from "./config/db";
import { config } from "./config/env";

connectDB();

app.listen(config.PORT, () => {
    console.log(`Server running on http://localhost:${config.PORT}`);
});
