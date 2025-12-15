// src/global.d.ts
// Ce fichier définit le type PrismaClient manuellement si TypeScript ne le trouve pas

// Importez le type pour qu'il soit bien chargé
import { PrismaClient } from '@prisma/client' 

// Déclare un type global pour la classe PrismaClient
declare global {
  type PrismaClient = import('@prisma/client').PrismaClient
}

// Assurez-vous que l'exportation existe pour que le fichier soit traité comme un module
export {};