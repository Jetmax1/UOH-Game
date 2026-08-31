import { RemotePlayer } from './RemotePlayer.js';

/**
 * NetworkManager: Real-Time Cross-Tab Synchronization & Live Campus Student Population Engine
 */
export class NetworkManager {
  constructor(game) {
    this.game = game;
    this.localId = `std_${Math.random().toString(36).substr(2, 9)}`;
    this.isConnected = true;
    this.remotePlayers = new Map(); // id -> RemotePlayer

    // Real-Time Broadcast Channel for Cross-Tab & Multi-Window University Session Play
    this.channel = null;
    this.initBroadcastChannel();

    // Broadcast Tick Interval (~15Hz for smooth network updates)
    this.syncInterval = 65; // ms
    this.lastSyncTime = 0;

    // Initialize Dynamic Simulated Student Population
    this.initSimulatedStudentPopulation();

    // Callbacks
    this.onPlayerJoined = null;
    this.onPlayerLeft = null;
  }

  initBroadcastChannel() {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.channel = new BroadcastChannel('uoh_campus_multiplayer');
        this.channel.onmessage = (e) => this.handleNetworkMessage(e.data);

        // Announce local player presence to other tabs
        setTimeout(() => this.broadcastJoin(), 100);

        window.addEventListener('beforeunload', () => {
          this.broadcastLeave();
        });
      } catch (err) {
        console.warn('BroadcastChannel error, running local student simulation:', err);
      }
    }
  }

  initSimulatedStudentPopulation() {
    // 16 Authentic UoH Campus Students across sections
    const simulatedStudents = [
      // Main Campus
      {
        id: 'sim_rahul',
        name: 'Rahul Varma',
        level: 14,
        title: 'Campus Explorer',
        club: 'Photo & Nature',
        section: 'main',
        x: 780, y: 340,
        waypoints: [{ x: 780, y: 340 }, { x: 860, y: 460 }, { x: 740, y: 580 }, { x: 620, y: 420 }],
        department: 'School of Physics'
      },
      {
        id: 'sim_ananya',
        name: 'Ananya Sen',
        level: 18,
        title: 'Quizmaster',
        club: 'Literary & Quiz',
        section: 'main',
        x: 820, y: 360,
        waypoints: [{ x: 820, y: 360 }, { x: 720, y: 300 }, { x: 650, y: 360 }, { x: 740, y: 400 }],
        department: 'Dept of English'
      },
      {
        id: 'sim_karthik',
        name: 'Karthik Rao',
        level: 22,
        title: 'Systems Architect',
        club: 'Turing Coding',
        section: 'main',
        x: 680, y: 450,
        waypoints: [{ x: 680, y: 450 }, { x: 800, y: 550 }, { x: 920, y: 420 }, { x: 750, y: 380 }],
        department: 'SCIS'
      },
      // East Campus (Library & Sukoon Canteen)
      {
        id: 'sim_priya',
        name: 'Priya Sharma',
        level: 16,
        title: 'Field Photographer',
        club: 'Photo & Nature',
        section: 'east',
        x: 350, y: 480,
        waypoints: [{ x: 350, y: 480 }, { x: 480, y: 520 }, { x: 420, y: 650 }, { x: 300, y: 580 }],
        department: 'SN School of Arts'
      },
      {
        id: 'sim_rohit',
        name: 'Rohit Nair',
        level: 11,
        title: 'Active Scholar',
        club: 'Turing Coding',
        section: 'east',
        x: 420, y: 320,
        waypoints: [{ x: 420, y: 320 }, { x: 520, y: 360 }, { x: 460, y: 450 }, { x: 380, y: 390 }],
        department: 'SCIS'
      },
      {
        id: 'sim_divya',
        name: 'Divya Reddy',
        level: 9,
        title: 'Freshman',
        club: 'Literary & Quiz',
        section: 'east',
        x: 280, y: 600,
        waypoints: [{ x: 280, y: 600 }, { x: 360, y: 720 }, { x: 450, y: 680 }, { x: 320, y: 580 }],
        department: 'Centre for Neural Sciences'
      },
      // West Campus (Sports Complex & Stadium)
      {
        id: 'sim_vikram',
        name: 'Vikram Singh',
        level: 20,
        title: 'Team Captain',
        club: 'Athletics & Sports',
        section: 'west',
        x: 450, y: 420,
        waypoints: [{ x: 450, y: 420 }, { x: 620, y: 450 }, { x: 580, y: 600 }, { x: 400, y: 520 }],
        department: 'School of Management'
      },
      {
        id: 'sim_sneha',
        name: 'Sneha Patel',
        level: 13,
        title: 'Varsity Athlete',
        club: 'Athletics & Sports',
        section: 'west',
        x: 520, y: 380,
        waypoints: [{ x: 520, y: 380 }, { x: 420, y: 480 }, { x: 500, y: 580 }, { x: 600, y: 440 }],
        department: 'Dept of Sociology'
      },
      // South Campus (Life Sciences, Check Dam & Hostels)
      {
        id: 'sim_dr_ramesh',
        name: 'Tanvi Joshi',
        level: 17,
        title: 'Biotech Researcher',
        club: 'Life Sciences Club',
        section: 'south',
        x: 650, y: 420,
        waypoints: [{ x: 650, y: 420 }, { x: 780, y: 520 }, { x: 700, y: 680 }, { x: 580, y: 550 }],
        department: 'School of Life Sciences'
      },
      {
        id: 'sim_arjun',
        name: 'Arjun Das',
        level: 12,
        title: 'Campus Explorer',
        club: 'Photo & Nature',
        section: 'south',
        x: 820, y: 720,
        waypoints: [{ x: 820, y: 720 }, { x: 920, y: 840 }, { x: 860, y: 960 }, { x: 740, y: 850 }],
        department: 'School of Economics'
      }
    ];

    for (const data of simulatedStudents) {
      const rp = new RemotePlayer(data.id, { ...data, isAi: true });
      this.remotePlayers.set(data.id, rp);
    }
  }

  handleNetworkMessage(msg) {
    if (!msg || msg.senderId === this.localId) return;

    if (msg.type === 'sync') {
      let rp = this.remotePlayers.get(msg.senderId);
      if (!rp) {
        rp = new RemotePlayer(msg.senderId, {
          name: msg.name,
          level: msg.level,
          title: msg.title,
          club: msg.club,
          department: msg.department,
          isAi: false
        });
        this.remotePlayers.set(msg.senderId, rp);
        this.game.chatSystem?.addSystemMessage(`🎓 ${msg.name} joined the campus session!`);
        if (this.onPlayerJoined) this.onPlayerJoined(rp);
      }
      rp.updateState(msg);
    } else if (msg.type === 'chat') {
      this.game.chatSystem?.addMessage({
        id: msg.msgId,
        sender: msg.senderName,
        senderId: msg.senderId,
        title: msg.title,
        club: msg.club,
        channel: msg.channel,
        text: msg.text,
        timestamp: msg.timestamp
      });

      // Show speech bubble over the remote character
      const rp = this.remotePlayers.get(msg.senderId);
      if (rp) {
        rp.showSpeech(msg.text);
      }
    } else if (msg.type === 'emote') {
      const rp = this.remotePlayers.get(msg.senderId);
      if (rp) {
        rp.showEmote(msg.emote);
      }
      this.game.chatSystem?.addMessage({
        id: `emote_${Date.now()}`,
        sender: msg.senderName,
        senderId: msg.senderId,
        channel: 'local',
        text: `${msg.emote.icon} ${msg.emote.text}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } else if (msg.type === 'party_invite') {
      if (msg.targetId === this.localId) {
        this.game.uiManager?.showToast(`🤝 Party Invite from ${msg.senderName}!`, 'info');
      }
    } else if (msg.type === 'leave') {
      const rp = this.remotePlayers.get(msg.senderId);
      if (rp && !rp.isAi) {
        this.remotePlayers.delete(msg.senderId);
        this.game.chatSystem?.addSystemMessage(`👋 ${rp.name} left the campus session.`);
        if (this.onPlayerLeft) this.onPlayerLeft(msg.senderId);
      }
    }
  }

  broadcastSync(now) {
    if (!this.channel || now - this.lastSyncTime < this.syncInterval) return;
    this.lastSyncTime = now;

    const p = this.game.player;
    const prog = this.game.progression;
    const club = this.game.clubSystem?.getCurrentClubData();

    const payload = {
      type: 'sync',
      senderId: this.localId,
      name: prog?.studentName || 'Student',
      level: prog?.level || 1,
      title: prog?.activeTitle || 'Freshman',
      club: club ? club.shortName : 'Independent',
      department: prog?.department || 'School of Computer Sciences',
      x: Math.round(p.x),
      y: Math.round(p.y),
      z: Math.round(p.z || 0),
      direction: p.direction,
      walkFrame: p.walkFrame,
      isSprinting: p.isSprinting,
      section: this.game.worldMap.currentSection,
      interiorId: this.game.currentInterior ? this.game.player.currentInterior : null
    };

    try {
      this.channel.postMessage(payload);
    } catch (e) {}
  }

  broadcastChat(text, channel = 'local') {
    const prog = this.game.progression;
    const club = this.game.clubSystem?.getCurrentClubData();

    const payload = {
      type: 'chat',
      senderId: this.localId,
      senderName: prog?.studentName || 'Student',
      title: prog?.activeTitle || 'Student',
      club: club ? club.shortName : 'Independent',
      channel,
      text,
      msgId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      this.channel?.postMessage(payload);
    } catch (e) {}
  }

  broadcastEmote(emoteObj) {
    const prog = this.game.progression;
    const payload = {
      type: 'emote',
      senderId: this.localId,
      senderName: prog?.studentName || 'Student',
      emote: emoteObj
    };

    try {
      this.channel?.postMessage(payload);
    } catch (e) {}
  }

  broadcastJoin() {
    this.broadcastSync(Date.now());
  }

  broadcastLeave() {
    try {
      this.channel?.postMessage({
        type: 'leave',
        senderId: this.localId
      });
    } catch (e) {}
  }

  update(delta) {
    const now = performance.now();
    this.broadcastSync(now);

    // Update all remote players
    for (const rp of this.remotePlayers.values()) {
      rp.update(delta);
    }
  }

  getPlayersInCurrentScope(section, interiorId = null) {
    const list = [];
    for (const rp of this.remotePlayers.values()) {
      if (interiorId) {
        if (rp.interiorId === interiorId) list.push(rp);
      } else {
        if (!rp.interiorId && rp.section === section) list.push(rp);
      }
    }
    return list;
  }

  getNearbyStudent(x, y, radius = 50, section = 'main', interiorId = null) {
    const candidates = this.getPlayersInCurrentScope(section, interiorId);
    let closest = null;
    let closestDist = radius;

    for (const s of candidates) {
      const dist = Math.hypot(x - s.x, y - s.y);
      if (dist < closestDist) {
        closestDist = dist;
        closest = s;
      }
    }
    return closest;
  }
}
