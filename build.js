const fs = require("fs")
let uris = [
  "./out/setup.js",
  "./out/button.js",
  "./out/script.js"
]
let js = "";
for (let uri of uris) {
  js += "\n" + fs.readFileSync(uri).toString();
}
fs.writeFileSync("dist.html", `<!DOCTYPE html>
<html lang="en" style="width: 100%; height: 100%; margin: 0px;">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body style="width: 100%; height: 100%; margin: 0px;" id="body">
  <div style="position: relative;">
    <canvas id="canvas" style="position: absolute; left: 0; top: 0; z-index: 1;"
    width="1600" height="900"></canvas>
    <canvas id="drawing_canvas" style="position: absolute; left: 0; top: 0; z-index: 0;"
    width="1600" height="900"></canvas>
  </div>
</body>
<script> ${js} </script>
</html>`)