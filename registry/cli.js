#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const program = new Command();

program
  .name('omoralabs')
  .description('Building blocks for composable, modern finance analytics')
  .version(require('./package.json').version);

program
  .command('add <blueprint>')
  .description('Add a blueprint to your project')
  .action(async (blueprint) => {
    try {
      const blueprintName = blueprint;
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

      // Copy workers
      if (registry.workers) {
        const workersDir = path.join(srcDir, 'workers');
        await fs.ensureDir(workersDir);

        for (const name of registry.workers) {
          const sourcePath = path.join(__dirname, 'workers', name);
          const targetPath = path.join(workersDir, name);

          if (fs.existsSync(sourcePath)) {
            await fs.copy(sourcePath, targetPath);
            console.log(chalk.green(`✓ Added workers/${name}/`));
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
        const modelsDir = path.join(dbtDir, 'models');

        // Recursively copy all .sql files and subdirectories
        const copyModelsRecursively = async (sourceDir, targetDir) => {
          const entries = await fs.readdir(sourceDir, { withFileTypes: true });

          for (const entry of entries) {
            const sourcePath = path.join(sourceDir, entry.name);
            const targetPath = path.join(targetDir, entry.name);

            if (entry.isDirectory()) {
              await fs.ensureDir(targetPath);
              await copyModelsRecursively(sourcePath, targetPath);
            } else if (entry.name.endsWith('.sql')) {
              await fs.copy(sourcePath, targetPath);
              const relativePath = path.relative(blueprintModelsDir, sourcePath);
              console.log(chalk.green(`✓ Added models/${relativePath}`));
            }
          }
        };

        await copyModelsRecursively(blueprintModelsDir, modelsDir);
      }

      // Copy config files to project root
      const configDir = path.join(blueprintPath, 'config');
      if (fs.existsSync(configDir)) {
        const configFiles = await fs.readdir(configDir);
        for (const file of configFiles) {
          await fs.copy(
            path.join(configDir, file),
            path.join(projectDir, file)
          );
          console.log(chalk.green(`✓ Added ${file}`));
        }
      }

      // Copy data files (CSVs) to appropriate folders
      const dataDir = path.join(blueprintPath, 'data');
      if (fs.existsSync(dataDir)) {
        // Copy semantic_layers CSVs
        const dataSemanticLayersDir = path.join(dataDir, 'semantic_layers');
        if (fs.existsSync(dataSemanticLayersDir)) {
          const csvFiles = await fs.readdir(dataSemanticLayersDir);
          const targetSemanticDir = path.join(srcDir, 'semantic_layers');

          for (const file of csvFiles) {
            if (file.endsWith('.csv')) {
              await fs.copy(
                path.join(dataSemanticLayersDir, file),
                path.join(targetSemanticDir, file)
              );
              console.log(chalk.green(`✓ Added semantic_layers/${file}`));
            }
          }
        }

        // Copy facts CSVs
        const dataFactsDir = path.join(dataDir, 'facts');
        if (fs.existsSync(dataFactsDir)) {
          const csvFiles = await fs.readdir(dataFactsDir);
          const targetFactsDir = path.join(srcDir, 'facts');

          for (const file of csvFiles) {
            if (file.endsWith('.csv')) {
              await fs.copy(
                path.join(dataFactsDir, file),
                path.join(targetFactsDir, file)
              );
              console.log(chalk.green(`✓ Added facts/${file}`));
            }
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
