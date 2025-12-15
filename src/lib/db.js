// src/lib/db.js
// Ceci utilise la syntaxe JavaScript standard (sans types) pour contourner le problème
// de cache de TypeScript.

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis; // Utiliser globalThis sans type

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;