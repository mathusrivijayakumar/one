import { dbConnect } from "../src/app/lib/mongodb.js";
import  {createDefaultAdmin } from "../src/app/lib/mongodb.js";


(async () => {
    await dbConnect();
    await createDefaultAdmin();
    process.exit();
  })();