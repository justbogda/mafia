
import React from 'react';

export type RoleCategory = 'Town' | 'Mafia' | 'Killer' | 'Neutral' | 'Shifter';

export enum RoleType {
  MAFIA = 'Mafia',
  SERIAL_KILLER = 'Serial Killer',
  POLICE = 'Police',
  DOCTOR = 'Doctor',
  CITIZEN = 'Citizen',
  ARSONIST = 'Arsonist',
  JESTER = 'Jester',
  SURVIVOR = 'Survivor',
  EXECUTIONER = 'Executioner',
  AMNESIAC = 'Amnesiac',
}

export interface RoleInfo {
  color: string;
  icon: React.ReactNode;
  category: RoleCategory;
  description: string;
  ability: string;
  priority: number; // Lower numbers act/wake up earlier in the night
}

export interface Player {
  id: string;
  name: string;
}

export interface GameRoleRow {
  id: string;
  role: RoleType;
  assignedPlayerId: string | null;
  nightActions: string[];
  isAlive: boolean;
}

export interface GameState {
  players: Player[];
  rows: GameRoleRow[];
  nightCount: number;
}
