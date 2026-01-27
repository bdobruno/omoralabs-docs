#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const program = new Command();

program
  .name('omoralabs')
  .description('Building blocks for composable, modern finance analytics')
  .version('0.1.0');

program
  .command('add <blueprint>')
  .description('Add a blueprint to your project')
  .action(async (blueprint) => {
    try {
      const blueprintName = blueprint.replace(/_/g, '-');
      const blueprintPath = path.join(__dirname, 'blueprints', blueprint);
      const registryPath = path.join(blueprintPath, 'registry.json');

      if (!fs.existsSync(registryPath)) {
        console.error(chalk.red(`Blueprint "${blueprint}" not found`));
        process.exit(1);
      }

      console.log(chalk.blue(`Adding ${blueprint}...`));

      const registry = await fs.readJSON(registryPath);
      const cwd = process.cwd();

      // Create project folder
      const projectDir = path.join(cwd, blueprintName);
      await fs.ensureDir(projectDir);

      // Create project structure
      const srcDir = path.join(projectDir, 'src', blueprint);
      const dbtDir = path.join(projectDir, `${blueprintName}_dbt`);
      const databaseDir = path.join(srcDir, 'database');

      await fs.ensureDir(srcDir);

      // Copy entire database folder structure
      const sourceDatabaseDir = path.join(__dirname, 'database');
      await fs.copy(sourceDatabaseDir, databaseDir, {
        filter: (src) => !src.endsWith('registry.json') && !src.includes('__pycache__')
      });
      console.log(chalk.green(`✓ Copied database structure`));

      // Copy blueprint's registry.json to database/
      await fs.copy(registryPath, path.join(databaseDir, 'registry.json'));
      console.log(chalk.green(`✓ Added database/registry.json`));

      // Copy semantic layers
      if (registry.semantic_layers) {
        const semanticLayersDir = path.join(srcDir, 'semantic_layers');
        await fs.ensureDir(semanticLayersDir);

        for (const [name, config] of Object.entries(registry.semantic_layers)) {
          const sourcePath = path.join(__dirname, config.schema);
          const targetPath = path.join(semanticLayersDir, `${name}.json`);

          if (fs.existsSync(sourcePath)) {
            await fs.copy(sourcePath, targetPath);
            console.log(chalk.green(`✓ Added semantic_layers/${name}.json`));
          }
        }
      }

      // Copy facts
      if (registry.facts) {
        const factsDir = path.join(srcDir, 'facts');
        await fs.ensureDir(factsDir);

        for (const [name, config] of Object.entries(registry.facts)) {
          const sourcePath = path.join(__dirname, config.schema);
          const targetPath = path.join(factsDir, `${name}.json`);

          if (fs.existsSync(sourcePath)) {
            await fs.copy(sourcePath, targetPath);
            console.log(chalk.green(`✓ Added facts/${name}.json`));
          }
        }
      }

      // Copy transformations (dbt models)
      if (registry.transformations) {
        const modelsDir = path.join(dbtDir, 'models');

        for (const [name, sqlPath] of Object.entries(registry.transformations)) {
          // Remove 'registry/' prefix since __dirname is already the registry folder
          const relativePath = sqlPath.replace(/^registry\//, '');
          const sourcePath = path.join(__dirname, relativePath);

          // Extract relative path from transformations/models/...
          const relPath = relativePath.replace(/^transformations\/models\//, '');
          const targetPath = path.join(modelsDir, relPath);

          if (fs.existsSync(sourcePath)) {
            await fs.ensureDir(path.dirname(targetPath));
            await fs.copy(sourcePath, targetPath);
            console.log(chalk.green(`✓ Added ${relPath}`));
          }
        }
      }

      // Copy dbt_project.yml
      const dbtProjectSource = path.join(blueprintPath, 'dbt_project.yml');
      if (fs.existsSync(dbtProjectSource)) {
        await fs.ensureDir(dbtDir);
        await fs.copy(dbtProjectSource, path.join(dbtDir, 'dbt_project.yml'));
        console.log(chalk.green(`✓ Added dbt_project.yml`));
      }

      // Copy schema.yml
      const schemaSource = path.join(blueprintPath, 'models', 'schema.yml');
      if (fs.existsSync(schemaSource)) {
        const modelsDir = path.join(dbtDir, 'models');
        await fs.ensureDir(modelsDir);
        await fs.copy(schemaSource, path.join(modelsDir, 'schema.yml'));
        console.log(chalk.green(`✓ Added models/schema.yml`));
      }

      // Copy blueprint models
      const blueprintModelsDir = path.join(blueprintPath, 'models');
      if (fs.existsSync(blueprintModelsDir)) {
        const files = await fs.readdir(blueprintModelsDir);
        const modelsDir = path.join(dbtDir, 'models');

        for (const file of files) {
          if (file.endsWith('.sql')) {
            await fs.copy(
              path.join(blueprintModelsDir, file),
              path.join(modelsDir, file)
            );
            console.log(chalk.green(`✓ Added models/${file}`));
          }
        }
      }

      console.log(chalk.bold.green(`\n✨ Successfully added ${blueprint} to ./${blueprintName}/`));

    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program.parse();
