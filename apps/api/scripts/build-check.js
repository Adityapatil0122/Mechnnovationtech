import("../src/app.js")
  .then(() => {
    console.log("API import check passed.");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
