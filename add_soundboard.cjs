const fs = require('fs');
const path = require('path');

const gamesPath = path.join(__dirname, 'src', 'games.json');
const games = JSON.parse(fs.readFileSync(gamesPath, 'utf8'));

const htmlContent = `<!DOCTYPE html>
<html lang="en">

<head>
    <base href="https://cdn.jsdelivr.net/gh/genizy/soundboard@main/">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5521219086088837" crossorigin="anonymous"></script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-WX5VS54ZDW"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', 'G-WX5VS54ZDW');
    </script>
    <meta charset="UTF-8">
    <title>Soundboard</title>
    <script src="sounds.js" type="module"></script>
    <script src="main.js" type="module"></script>
    <link href="style.css" rel="stylesheet">
</head>

<body>
    <div id="controls">
        <button id="toggleFavorites" class="control-button favorites-toggle">⭐ Favorites: OFF</button>
        <button id="toggleButton" class="control-button overlap-toggle">🔇 Overlap: OFF</button>
        <button id="stopButton" class="control-button stop-button">⏹️ Stop All Sounds</button>
        <input id="searchInput" type="text" placeholder="Search sounds...">
    </div>
    <div id="soundboard"></div>
</body>

</html>`;

const newGame = {
  id: "regular-soundboard",
  title: "Soundboard",
  category: "Soundboard",
  description: "A regular soundboard with various sound effects.",
  thumbnail: "https://cdn-icons-png.flaticon.com/512/3293/3293046.png",
  html: htmlContent
};

games.push(newGame);
fs.writeFileSync(gamesPath, JSON.stringify(games, null, 2));
console.log("Soundboard added successfully");
