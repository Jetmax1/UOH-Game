/**
 * ChatSystem: University Chat Channels (Local Proximity, Party, Club, Event & System)
 */
export class ChatSystem {
  constructor() {
    this.messages = [];
    this.activeChannel = 'local'; // 'local', 'party', 'club', 'event'
    this.unreadCount = 0;
    this.maxMessages = 100;
    this.lastMessageTime = 0;

    this.onMessageReceived = null;
  }

  getChannels() {
    return [
      { id: 'local', label: 'Local', icon: '📍', desc: 'Nearby campus students' },
      { id: 'party', label: 'Party', icon: '🤝', desc: 'Party squad members' },
      { id: 'club', label: 'Club', icon: '🏛️', desc: 'Your university club' },
      { id: 'event', label: 'Event', icon: '🏆', desc: 'Active campus competition' }
    ];
  }

  setChannel(channelId) {
    this.activeChannel = channelId;
  }

  getMessages(channel = null) {
    if (!channel) return this.messages;
    return this.messages.filter(m => m.channel === channel || m.channel === 'system');
  }

  sendMessage(senderName, text, channel = this.activeChannel, extra = {}) {
    if (!text || text.trim() === '') return null;

    const trimmed = text.trim().slice(0, 180); // 180 chars max
    const now = Date.now();

    // Anti-spam cooldown (0.35s)
    if (now - this.lastMessageTime < 350) return null;
    this.lastMessageTime = now;

    const message = {
      id: `msg_${now}_${Math.random().toString(36).substr(2, 5)}`,
      sender: senderName,
      senderId: extra.senderId || 'local_student',
      title: extra.title || '',
      club: extra.club || '',
      channel: channel || 'local',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: extra.isSystem || false
    };

    this.addMessage(message);
    return message;
  }

  addMessage(message) {
    this.messages.push(message);
    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }

    if (this.onMessageReceived) {
      this.onMessageReceived(message);
    }
  }

  addSystemMessage(text, channel = 'local') {
    return this.sendMessage('CAMPUS BROADCAST', text, channel, { isSystem: true });
  }
}
