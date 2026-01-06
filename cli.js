#!/usr/bin/env node
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Todo API running on http://localhost:${PORT}`);
});
