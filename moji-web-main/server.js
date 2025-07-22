const app = require("./app");
const databaseConnect = require("./config/database");
const cloudinary = require("cloudinary").v2;

const port = 3001; //PORT

// database connect
databaseConnect();

// cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(port, () => {
  console.log(`Server started at port: http://localhost:${port}`);
});

// "mail": {
//     "transport": "SMTP",
//   "options": {
//     "service": "Mailgun",
//     "auth": {
//       "user": "postmaster@sandbox2539760222cd4eb58fe47aaadf62663d.mailgun.org",
//       "pass": "Pathfinder1?"
//     }
// }
// }

