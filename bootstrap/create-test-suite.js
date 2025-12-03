#!/usr/bin/env node

/**
 * 🚀 CREATE TEST SUITE
 * Nutzung: npx ./create-test-suite --template=cms --name=mein-projekt
 */

const fs = require('fs-extra');
const path = require('path');
const { program } = require('commander');

program
  .option('-t, --template <type>', 'Template (cms, ecommerce, saas)')
  .option('-n, --name <name>', 'Projektname')
  .parse(process.argv);

const options = program.opts();

if (!options.template || !options.name) {
  console.error('❌ Bitte Template und Name angeben');
  process.exit(1);
}

const templates = {
  cms: 'template-cms',
  ecommerce: 'template-ecommerce',
  saas: 'template-saas'
};

const templateDir = path.join(__dirname, '../templates', templates[options.template]);
const targetDir = path.join(process.cwd(), options.name);

async function createProject() {
  try {
    // Kopiere Template
    await fs.copy(templateDir, targetDir);
    
    // Aktualisiere package.json Name
    const packagePath = path.join(targetDir, 'package.json');
    const packageJson = await fs.readJson(packagePath);
    packageJson.name = options.name;
    await fs.writeJson(packagePath, packageJson, { spaces: 2 });
    
    console.log(`✅ Projekt "${options.name}" erstellt`);
    console.log(`📁 Verzeichnis: ${targetDir}`);
    console.log('\n📋 NÄCHSTE SCHRITTE:');
    console.log(`1. cd ${options.name}`);
    console.log('2. npm install');
    console.log('3. Tests in /tests/examples/ anpassen');
    console.log('4. npm test');
    
  } catch (error) {
    console.error('❌ Fehler:', error.message);
  }
}

createProject();
