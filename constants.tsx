
import React from 'react';
import { RoleType, RoleInfo } from './types';

export const ROLE_METADATA: Record<RoleType, RoleInfo> = {
  [RoleType.AMNESIAC]: {
    color: 'text-cyan-400',
    icon: <i className="fa-solid fa-brain"></i>,
    category: 'Shifter',
    description: 'Remember a role from the graveyard and take its place.',
    ability: 'Select a dead player to inherit their role and powers.',
    priority: 1
  },
  [RoleType.POLICE]: {
    color: 'text-blue-500',
    icon: <i className="fa-solid fa-shield-halved"></i>,
    category: 'Town',
    description: 'Find the threats to the town.',
    ability: 'Investigate one player each night to see their alignment.',
    priority: 2
  },
  [RoleType.DOCTOR]: {
    color: 'text-emerald-500',
    icon: <i className="fa-solid fa-briefcase-medical"></i>,
    category: 'Town',
    description: 'Keep the innocent alive.',
    ability: 'Protect one player from being killed each night.',
    priority: 3
  },
  [RoleType.MAFIA]: {
    color: 'text-red-500',
    icon: <i className="fa-solid fa-gun"></i>,
    category: 'Mafia',
    description: 'Eliminate all non-mafia players.',
    ability: 'Vote to kill one person each night.',
    priority: 4
  },
  [RoleType.SERIAL_KILLER]: {
    color: 'text-rose-600',
    icon: <i className="fa-solid fa-skull"></i>,
    category: 'Killer',
    description: 'Kill everyone and be the last one standing.',
    ability: 'Select one player to kill every night. Immune to mafia attacks.',
    priority: 5
  },
  [RoleType.ARSONIST]: {
    color: 'text-orange-500',
    icon: <i className="fa-solid fa-fire"></i>,
    category: 'Killer',
    description: 'Douse everyone in gasoline and watch them burn.',
    ability: 'Douse players on nights 1-3. On night 4+, ignite to kill all doused victims.',
    priority: 6
  },
  [RoleType.SURVIVOR]: {
    color: 'text-amber-700',
    icon: <i className="fa-solid fa-vest"></i>,
    category: 'Neutral',
    description: 'Stay alive until the end of the game, no matter who wins.',
    ability: 'Has 2 bulletproof vests to survive night attacks.',
    priority: 7
  },
  [RoleType.EXECUTIONER]: {
    color: 'text-stone-400',
    icon: <i className="fa-solid fa-gavel"></i>,
    category: 'Neutral',
    description: 'Get your target executed during the day.',
    ability: 'Assigned a target at start. If target is lynched, you win.',
    priority: 8
  },
  [RoleType.JESTER]: {
    color: 'text-yellow-400',
    icon: <i className="fa-solid fa-mask"></i>,
    category: 'Neutral',
    description: 'Trick the town into executing you at the day vote.',
    ability: 'Wins ONLY if executed by the town. Has no night abilities.',
    priority: 9
  },
  [RoleType.CITIZEN]: {
    color: 'text-slate-400',
    icon: <i className="fa-solid fa-user-group"></i>,
    category: 'Town',
    description: 'Find and vote out the mafia.',
    ability: 'No night ability. Uses deduction during the day.',
    priority: 10
  },
};

export const INITIAL_ROLES: RoleType[] = [
  RoleType.MAFIA,
  RoleType.POLICE,
  RoleType.DOCTOR,
  RoleType.CITIZEN,
];
