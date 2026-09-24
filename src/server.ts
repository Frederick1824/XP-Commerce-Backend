import { buildDependencies, createApp } from './app.js';

const PORT = Number(process.env.PORT) || 3000;

const deps = buildDependencies();
const app = createApp(deps);

app.listen(PORT, () => {
  console.log(`XP-Commerce-Backend escuchando en http://localhost:${PORT}`);
});