import { Mode } from './prisma/generated/enums.ts';
import { requestSerial } from './serial.ts';
import Express from 'express';

const PORT = 8080;

const app = Express();

app.get('/temp', async (req, res) => {
  try {
    const temp = await requestSerial("set_high");
    res.json(temp);
  } catch (error) {
    console.error(error);
    console.log("manejado");
    res.status(500).json({ error: 'Failed to get temperature' });
  }
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
