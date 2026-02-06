import React, { useState, useMemo } from 'react';
import { Player, GameRoleRow, RoleType, RoleCategory } from './types';
import { INITIAL_ROLES, ROLE_METADATA } from './constants';
import { Button } from './components/ui/Button';
import { Badge } from './components/ui/Badge';
import { Card } from './components/ui/Card';
import { Input } from './components/ui/Input';

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [nightCount, setNightCount] = useState(2);
  const [rows, setRows] = useState<GameRoleRow[]>(
    INITIAL_ROLES.map((role) => ({
      id: crypto.randomUUID(),
      role,
      assignedPlayerId: null,
      nightActions: Array(10).fill(''),
      isAlive: true,
    }))
  );
  
  const [showRoleBank, setShowRoleBank] = useState(false);

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const prioA = ROLE_METADATA[a.role].priority;
      const prioB = ROLE_METADATA[b.role].priority;
      return prioA - prioB;
    });
  }, [rows]);

  const groupedRoles = useMemo(() => {
    const roles = Object.keys(ROLE_METADATA) as RoleType[];
    const groups: Record<RoleCategory, RoleType[]> = {
      Town: [], Mafia: [], Killer: [], Neutral: [], Shifter: []
    };
    roles.forEach(role => groups[ROLE_METADATA[role].category].push(role));
    return groups;
  }, []);

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;
    setPlayers(prev => [...prev, { id: crypto.randomUUID(), name: newPlayerName.trim() }]);
    setNewPlayerName('');
  };

  const addRoleToGame = (type: RoleType) => {
    setRows(prev => [...prev, {
      id: crypto.randomUUID(),
      role: type,
      assignedPlayerId: null,
      nightActions: Array(10).fill(''),
      isAlive: true,
    }]);
    setShowRoleBank(false);
  };

  const removeRoleRow = (id: string) => {
    const row = rows.find(r => r.id === id);
    if (!row) return;
    const confirmMsg = (row.assignedPlayerId || row.nightActions.some(a => a)) 
      ? `Slot contains data. PERMANENTLY delete ${row.role}?` 
      : `Remove ${row.role} slot?`;
    if (window.confirm(confirmMsg)) setRows(prev => prev.filter(r => r.id !== id));
  };

  const clearNightColumn = (nightIndex: number) => {
    if (window.confirm(`Clear all actions for Night ${nightIndex + 1}?`)) {
      setRows(prev => prev.map(row => ({
        ...row,
        nightActions: row.nightActions.map((a, i) => i === nightIndex ? '' : a)
      })));
    }
  };

  const clearAllAssignments = () => {
    if (window.confirm("RESET: Clear all assignments, night actions, and revive all players?")) {
      setRows(prev => prev.map(row => ({
        ...row,
        assignedPlayerId: null,
        nightActions: row.nightActions.map(() => ''),
        isAlive: true
      })));
    }
  };

  const assignPlayer = (rowId: string, playerId: string | null) => {
    setRows(prev => prev.map(row => row.id === rowId ? { ...row, assignedPlayerId: playerId } : row));
  };

  const updateAction = (rowId: string, nightIndex: number, playerId: string) => {
    setRows(prev => prev.map(row => 
      row.id === rowId ? { ...row, nightActions: row.nightActions.map((a, i) => i === nightIndex ? playerId : a) } : row
    ));
  };

  const toggleStatus = (rowId: string) => {
    setRows(prev => prev.map(row => row.id === rowId ? { ...row, isAlive: !row.isAlive } : row));
  };

  const getIsPlayerAssignedElsewhere = (playerId: string, currentRowId: string) => {
    return rows.some(row => row.assignedPlayerId === playerId && row.id !== currentRowId);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-red-500/30">
      <div className="max-w-7xl mx-auto px-2 py-4 md:px-8 md:py-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-800/60 mb-6 md:mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] shrink-0">
                <i className="fa-solid fa-user-secret text-xl md:text-2xl"></i>
              </div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tighter uppercase italic">The Syndicate Game</h1>
            </div>
            <p className="text-zinc-400 font-medium text-xs md:text-sm ml-1">Advanced Tactical Management for Mafia Operations</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="flex w-full sm:w-auto items-center gap-2">
              <Input
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                placeholder="Player Name..."
                className="w-full sm:w-56"
              />
              <Button onClick={addPlayer} className="shrink-0">Add Player</Button>
            </div>
            
            <div className="relative w-full sm:w-auto">
              <Button 
                variant="destructive" 
                className="w-full sm:w-auto gap-2"
                onClick={() => setShowRoleBank(!showRoleBank)}
              >
                <i className="fa-solid fa-plus-circle"></i> Role Bank
              </Button>
              
              {showRoleBank && (
                <Card className="absolute right-0 mt-3 w-full sm:w-72 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 border-zinc-700 shadow-2xl">
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {(Object.keys(groupedRoles) as RoleCategory[]).map(cat => (
                      groupedRoles[cat].length > 0 && (
                        <div key={cat} className="group/cat">
                          <div className="px-4 py-2 bg-zinc-950/80 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-b border-zinc-800/50">
                            {cat} Units
                          </div>
                          {groupedRoles[cat].map(role => (
                            <button
                              key={role}
                              onClick={() => addRoleToGame(role)}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors text-left"
                            >
                              <span className={`${ROLE_METADATA[role].color} text-sm`}>{ROLE_METADATA[role].icon}</span>
                              <span className="text-xs font-semibold text-zinc-300">{role}</span>
                            </button>
                          ))}
                        </div>
                      )
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-8 items-start">
          
          {/* Main Table Content */}
          <div className="xl:col-span-3 space-y-4">
            <Card className="overflow-hidden border-zinc-800/50 bg-zinc-900/30">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed min-w-[800px]">
                  <thead>
                    <tr className="bg-zinc-950 border-b border-zinc-800">
                      <th className="px-3 py-4 text-[9px] font-black uppercase text-zinc-400 tracking-widest text-center w-[40px]">#</th>
                      <th className="px-3 py-4 text-[9px] font-black uppercase text-zinc-400 tracking-widest w-[160px]">Role</th>
                      <th className="px-3 py-4 text-[9px] font-black uppercase text-zinc-400 tracking-widest w-[180px]">Player</th>
                      {[...Array(nightCount)].map((_, i) => (
                        <th key={i} className="px-1 py-3 text-[9px] font-black uppercase text-zinc-400 tracking-widest text-center">
                          <div className="flex flex-col items-center gap-1 group/header">
                            <span>N{i + 1}</span>
                            <button 
                              onClick={() => clearNightColumn(i)}
                              className="text-[7px] text-zinc-500 hover:text-red-500/80 transition-colors opacity-0 group-header:opacity-100 focus:opacity-100"
                              title={`Clear N${i+1}`}
                            >
                              <i className="fa-solid fa-eraser"></i>
                            </button>
                          </div>
                        </th>
                      ))}
                      <th className="px-3 py-4 text-[9px] font-black uppercase text-zinc-400 tracking-widest text-center w-[100px]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {sortedRows.length === 0 ? (
                      <tr>
                        <td colSpan={nightCount + 4} className="px-6 py-24 text-center text-zinc-400 font-medium italic">
                          No active deployments. Access Role Bank to begin.
                        </td>
                      </tr>
                    ) : (
                      sortedRows.map((row, idx) => {
                        const meta = ROLE_METADATA[row.role];
                        return (
                          <tr key={row.id} className={`group hover:bg-white/[0.01] transition-colors ${!row.isAlive ? 'opacity-25 grayscale' : ''}`}>
                            <td className="px-3 py-3 text-center">
                              <span className="text-zinc-500 font-mono text-[9px]">{idx + 1}</span>
                            </td>
                            <td className="px-3 py-3 overflow-hidden">
                              <div className="flex items-center gap-2 group/info relative overflow-hidden">
                                <div className={`w-7 h-7 flex-shrink-0 rounded-lg flex items-center justify-center bg-zinc-950 border border-zinc-800/50 ${meta.color} text-xs shadow-inner`}>
                                  {meta.icon}
                                </div>
                                <div className="flex flex-col gap-0.5 overflow-hidden">
                                  <span className="text-[10px] font-black uppercase tracking-tight truncate text-zinc-200">{row.role}</span>
                                  <Badge variant={meta.category} className="w-max">{meta.category}</Badge>
                                </div>
                                <div className="absolute left-0 bottom-full mb-3 w-56 bg-zinc-950 border border-zinc-800 p-3 rounded-lg opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-50 pointer-events-none shadow-2xl">
                                  <p className="text-[10px] text-zinc-300 leading-snug mb-2 uppercase font-bold tracking-tight">{meta.description}</p>
                                  <p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter">Ability: <span className="text-zinc-200 font-normal normal-case">{meta.ability}</span></p>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-3 overflow-hidden">
                              <select
                                value={row.assignedPlayerId || ''}
                                onChange={(e) => assignPlayer(row.id, e.target.value || null)}
                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-md px-2 py-1.5 text-[10px] font-medium focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all cursor-pointer text-zinc-300 truncate appearance-none"
                              >
                                <option value="">- VACANT -</option>
                                {players.map(p => {
                                  const taken = getIsPlayerAssignedElsewhere(p.id, row.id);
                                  return (
                                    <option key={p.id} value={p.id} disabled={taken}>
                                      {p.name} {taken ? ' (Taken)' : ''}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                            {[...Array(nightCount)].map((_, i) => (
                              <td key={i} className="px-1 py-3 overflow-hidden">
                                <select
                                  value={row.nightActions[i] || ''}
                                  onChange={(e) => updateAction(row.id, i, e.target.value)}
                                  className="w-full bg-transparent border-b border-zinc-800/50 hover:border-zinc-600 focus:outline-none focus:border-red-500/50 text-[10px] text-center font-mono py-1 appearance-none cursor-pointer text-zinc-400"
                                >
                                  <option value="">-</option>
                                  {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                              </td>
                            ))}
                            <td className="px-3 py-3">
                              <div className="flex items-center justify-center gap-1">
                                <Button 
                                  variant={row.isAlive ? 'outline' : 'destructive'} 
                                  size="icon" 
                                  className="h-6 w-6"
                                  onClick={() => toggleStatus(row.id)}
                                >
                                  <i className={`fa-solid ${row.isAlive ? 'fa-skull' : 'fa-heart-pulse'} text-[9px]`}></i>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 hover:text-red-500 text-zinc-400"
                                  onClick={() => removeRoleRow(row.id)}
                                >
                                  <i className="fa-solid fa-trash-can text-[9px]"></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 md:px-6 bg-zinc-950/80 border-t border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  <Button variant="ghost" size="sm" onClick={() => setNightCount(p => Math.min(p + 1, 10))} className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] shrink-0">
                    <i className="fa-solid fa-plus mr-2 text-[8px]"></i> Extend Night
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearAllAssignments} 
                    className="text-zinc-400 font-bold uppercase tracking-widest text-[9px] hover:text-red-400 border border-transparent hover:border-red-900/30 shrink-0"
                  >
                    <i className="fa-solid fa-rotate-left mr-2 text-[8px]"></i> Reset All
                  </Button>
                </div>
                <div className="flex gap-4 items-center text-[9px] font-black uppercase tracking-widest text-zinc-400 w-full sm:w-auto justify-between sm:justify-end">
                  <span>Players: {players.length}</span>
                  <span>Roles: {rows.length}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Player Roster */}
          <div className="space-y-6">
            <Card className="p-4 md:p-5">
              <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-2">
                <i className="fa-solid fa-users text-red-500 text-[10px]"></i>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">Player Roster</h3>
              </div>
              
              <div className="space-y-1 max-h-[40vh] md:max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                {players.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-zinc-500 space-y-2 opacity-50">
                    <i className="fa-solid fa-user-plus text-xl"></i>
                    <p className="text-[9px] font-bold uppercase tracking-widest">Awaiting Players</p>
                  </div>
                ) : (
                  players.map(p => {
                    const active = rows.some(r => r.assignedPlayerId === p.id);
                    return (
                      <div 
                        key={p.id}
                        className={`group flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-300 ${
                          active 
                            ? 'bg-red-950/10 border-red-900/30' 
                            : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5 overflow-hidden">
                          <span className={`text-[10px] font-bold truncate ${active ? 'text-red-400' : 'text-zinc-200'}`}>{p.name}</span>
                          {active && (
                            <div className="flex items-center gap-1.5 text-[7px] font-black uppercase tracking-tighter text-red-600/80">
                              <span className="w-1 h-1 bg-red-600 rounded-full animate-pulse"></span>
                              Deployed
                            </div>
                          )}
                        </div>
                        
                        {!active ? (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400"
                            onClick={() => setPlayers(pList => pList.filter(pl => pl.id !== p.id))}
                          >
                            <i className="fa-solid fa-xmark text-[9px]"></i>
                          </Button>
                        ) : (
                          <i className="fa-solid fa-fingerprint text-red-500/20 text-[10px]"></i>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </Card>

            <div className="rounded-xl border border-dashed border-zinc-800 p-5 flex flex-col items-center justify-center text-center bg-zinc-900/20">
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">Operational Protocol</p>
              <p className="text-[9px] text-zinc-400 leading-relaxed font-medium">
                Select a Player for each Role. Use Night Columns (N1, N2) to track target IDs per cycle. Status toggles record permanent eliminations.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
