const Client = require('ssh2-sftp-client');
const fs = require('fs');
const path = require('path');

const sftp = new Client();

const config = {
  host: '168.231.90.114',
  port: 22,
  username: 'root',
  password: 'P1t0mb@sD0ces',
  readyTimeout: 99999,
};

const localDir = path.join(__dirname, 'dist');
const remoteDir = '/var/www/govmesh/dist';

async function uploadDir(localPath, remotePath) {
  const items = fs.readdirSync(localPath);
  for (const item of items) {
    const localItem = path.join(localPath, item);
    const remoteItem = `${remotePath}/${item}`;
    const stat = fs.statSync(localItem);
    if (stat.isDirectory()) {
      await sftp.mkdir(remoteItem, true).catch(() => {});
      await uploadDir(localItem, remoteItem);
    } else {
      process.stdout.write(`Enviando: ${remoteItem}\n`);
      await sftp.put(localItem, remoteItem);
    }
  }
}

async function main() {
  try {
    console.log('Conectando à VPS...');
    await sftp.connect(config);

    console.log(`Criando diretório remoto: ${remoteDir}`);
    await sftp.mkdir(remoteDir, true).catch(() => {});

    console.log('Enviando arquivos...');
    await uploadDir(localDir, remoteDir);

    console.log('\n✅ Upload concluído!');
    console.log('Agora rode:');
    console.log(`ssh root@168.231.90.114 "cp -r ${remoteDir}/* /opt/govmesh/ && chmod -R 755 /opt/govmesh"`);
  } catch (err) {
    console.error('❌ Erro:', err.message);
  } finally {
    await sftp.end();
  }
}

main();
