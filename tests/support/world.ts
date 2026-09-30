// Archivo para contexto compartido que mantiene el aislamiento entre scenarios
import { setWorldConstructor, World, type IWorldOptions } from '@cucumber/cucumber';
import type { Express } from 'express';
import type { Response } from 'supertest';
import { buildDependencies, createApp, type AppDependencies } from '../../src/app.js';

export class CustomWorld extends World {
  deps: AppDependencies;
  app: Express;
  lastResponse!: Response;

  constructor(options: IWorldOptions) {
    super(options);
    this.deps = buildDependencies();
    this.app = createApp(this.deps);
  }
}

setWorldConstructor(CustomWorld);