import express from 'express';
import fetch from 'node-fetch';
const planets = (await import('npm-solarsystem')).default;

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', async (req, res) => {
  let apiKey = "7756a1e81f817c186cf57294e1c19b37b49c54b8f34e7c499ee0ce5cd86cd16e";

  let url =
    `https://api.unsplash.com/photos/random/?client_id=${apiKey}&featured=true&query=solar-system`;

  let response = await fetch(url);
  let data = await response.json();
  let randomImage = data.urls.full;

  res.render("index", { image: randomImage });
});

app.get('/earth', (req, res) => {
  let planetEarth = planets.getEarth();
  res.render('earth', { planetEarth });
});

app.get('/mars', (req, res) => {
  let planetMars = planets.getMars();
  res.render('mars', { planetMars });
});

app.get('/planet', (req, res) => {
  let planetName = req.query.planetName;
  let planetInfo = planets[`get${planetName}`]();

  res.render('planet', { planetInfo, planetName });
});

app.get('/nasa', async (req, res) => {
  try {
    const apiKey =
      "9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD";

    const url =
      `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const nasaData = await response.json();

    res.render('nasa', { nasaData });
  } catch (error) {
    console.error(error);

    res.status(500).send(
      "Unable to retrieve NASA's Picture of the Day."
    );
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});