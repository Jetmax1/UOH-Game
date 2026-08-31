/**
 * SocialSystem: University Friends, Party System, Emotes & Student Moderation
 */
export const EMOTES = [
  { id: 'wave', label: 'Wave', icon: '👋', text: '*waves hello*' },
  { id: 'thumbsup', label: 'Thumbs Up', icon: '👍', text: '*gives a thumbs up*' },
  { id: 'laugh', label: 'Laugh', icon: '😂', text: '*laughs cheerfully*' },
  { id: 'clap', label: 'Clap', icon: '👏', text: '*applauds*' },
  { id: 'heart', label: 'Heart', icon: '❤️', text: '*sends love*' },
  { id: 'celebrate', label: 'Celebrate', icon: '🎉', text: '*celebrates!*' },
  { id: 'idea', label: 'Idea', icon: '💡', text: '*got an idea!*' },
  { id: 'photo', label: 'Snapshot', icon: '📸', text: '*takes a photo!*' }
];

export class SocialSystem {
  constructor(initialData = {}) {
    // Friends list: array of { id, name, level, title, club, isOnline, lastSeen }
    this.friends = initialData.friends || [
      { id: 'student_rahul', name: 'Rahul V.', level: 14, title: 'Campus Explorer', club: 'Photo & Nature', isOnline: true, section: 'main' },
      { id: 'student_priya', name: 'Priya S.', level: 16, title: 'Active Scholar', club: 'Turing Coding', isOnline: true, section: 'east' },
      { id: 'student_aman', name: 'Aman K.', level: 8, title: 'Freshman', club: 'Athletics & Sports', isOnline: false, section: 'south' }
    ];

    // Party state: { inParty, leaderId, members: [{ id, name, level, isLeader }] }
    this.party = initialData.party || {
      inParty: false,
      leaderId: null,
      partyName: '',
      members: []
    };

    // Blocked/Muted players for moderation
    this.blockedIds = initialData.blockedIds || [];

    // Active floating emote for local player
    this.activeEmote = null;
    this.emoteTimer = 0;

    // Event listeners
    this.onPartyChanged = null;
    this.onFriendListChanged = null;
    this.onEmoteTriggered = null;
  }

  // --- FRIENDS ---
  addFriend(student) {
    if (!student || !student.id) return false;
    if (this.friends.some(f => f.id === student.id)) return false;

    this.friends.push({
      id: student.id,
      name: student.name,
      level: student.level || 1,
      title: student.title || 'Student',
      club: student.club || 'Independent',
      isOnline: true,
      section: student.section || 'main'
    });

    if (this.onFriendListChanged) {
      this.onFriendListChanged(this.friends);
    }
    return true;
  }

  removeFriend(studentId) {
    this.friends = this.friends.filter(f => f.id !== studentId);
    if (this.onFriendListChanged) {
      this.onFriendListChanged(this.friends);
    }
  }

  isFriend(studentId) {
    return this.friends.some(f => f.id === studentId);
  }

  getFriends() {
    return this.friends;
  }

  // --- PARTY SYSTEM ---
  createParty(localStudent) {
    this.party = {
      inParty: true,
      leaderId: localStudent.id,
      partyName: `${localStudent.name}'s Squad`,
      members: [
        {
          id: localStudent.id,
          name: localStudent.name,
          level: localStudent.level || 1,
          title: localStudent.title || 'Student',
          isLeader: true
        }
      ]
    };

    if (this.onPartyChanged) {
      this.onPartyChanged(this.party);
    }
    return this.party;
  }

  inviteToParty(student) {
    if (!this.party.inParty) return false;
    if (this.party.members.length >= 4) return false; // Max 4 students
    if (this.party.members.some(m => m.id === student.id)) return false;

    this.party.members.push({
      id: student.id,
      name: student.name,
      level: student.level || 1,
      title: student.title || 'Student',
      isLeader: false
    });

    if (this.onPartyChanged) {
      this.onPartyChanged(this.party);
    }
    return true;
  }

  leaveParty(localStudentId) {
    if (!this.party.inParty) return;

    if (this.party.leaderId === localStudentId || this.party.members.length <= 1) {
      this.party = { inParty: false, leaderId: null, partyName: '', members: [] };
    } else {
      this.party.members = this.party.members.filter(m => m.id !== localStudentId);
    }

    if (this.onPartyChanged) {
      this.onPartyChanged(this.party);
    }
  }

  getParty() {
    return this.party;
  }

  // --- EMOTES ---
  triggerEmote(emoteId) {
    const emote = EMOTES.find(e => e.id === emoteId);
    if (!emote) return null;

    this.activeEmote = emote;
    this.emoteTimer = 2.4; // Show for 2.4 seconds

    if (this.onEmoteTriggered) {
      this.onEmoteTriggered(emote);
    }
    return emote;
  }

  update(delta) {
    if (this.emoteTimer > 0) {
      this.emoteTimer -= delta;
      if (this.emoteTimer <= 0) {
        this.activeEmote = null;
      }
    }
  }

  // --- MODERATION ---
  blockStudent(studentId) {
    if (!this.blockedIds.includes(studentId)) {
      this.blockedIds.push(studentId);
    }
  }

  unblockStudent(studentId) {
    this.blockedIds = this.blockedIds.filter(id => id !== studentId);
  }

  isBlocked(studentId) {
    return this.blockedIds.includes(studentId);
  }

  serialize() {
    return {
      friends: this.friends,
      party: this.party,
      blockedIds: this.blockedIds
    };
  }

  deserialize(data) {
    if (!data) return;
    if (data.friends) this.friends = data.friends;
    if (data.party) this.party = data.party;
    if (data.blockedIds) this.blockedIds = data.blockedIds;
  }
}
