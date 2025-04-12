import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const app = express();

app.use(express.json());

// 🧠 GET /api/scripts — Lista scripts no diretório especificado
app.get('/api/scripts', async (req, res) => {
  const directoryPath = req.query.path as string;

  if (!directoryPath) {
    return res.status(400).json({ error: 'Parâmetro "path" é obrigatório.' });
  }

  try {
    const stats = await fs.stat(directoryPath);
    if (!stats.isDirectory()) {
      return res.status(400).json({ error: 'O caminho informado não é um diretório válido.' });
    }

    const files = await fs.readdir(directoryPath);
    const scripts = files
      .filter((file) => file.endsWith('.sh'))
      .map((file) => ({
        name: file,
        path: path.join(directoryPath, file),
      }));

    res.json(scripts);
  } catch (error) {
    console.error('Erro ao escanear diretório:', error);
    res.status(500).json({ error: 'Erro ao escanear diretório.' });
  }
});

// ▶️ POST /api/execute — Executa script especificado
app.post('/api/execute', async (req, res) => {
  const { path: scriptPath } = req.body;

  if (!scriptPath || !scriptPath.endsWith('.sh')) {
    return res.status(400).json({ error: 'Script inválido.' });
  }

  try {
    const stats = await fs.stat(scriptPath);
    if (!stats.isFile()) {
      return res.status(400).json({ error: 'Arquivo de script não encontrado.' });
    }

    // Dá permissão de execução (caso ainda não tenha)
    await fs.chmod(scriptPath, '755');

    const { stdout, stderr } = await execAsync(`bash "${scriptPath}"`);

    res.json({
      success: true,
      output: stdout.trim(),
      error: stderr.trim(),
    });
  } catch (error) {
    console.error('Erro ao executar script:', error);
    res.status(500).json({ error: 'Erro ao executar o script.' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
});
