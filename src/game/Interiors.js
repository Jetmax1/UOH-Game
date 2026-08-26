import { pixelEngine } from './PixelArtEngine.js';

/**
 * Pokémon FireRed GBA-Style Indoor Rooms
 * Features classic checkerboard/parquet tiles, entryway carpet mats, PCs, bookshelves, and lab benches.
 */
export class Interiors {
  constructor() {
    this.interiorScenes = {
      library: {
        id: 'library',
        name: 'Indira Gandhi Memorial Library',
        width: 700,
        height: 520,
        spawnX: 350,
        spawnY: 460,
        exitX: 580,
        exitY: 960,
        floorType: 'parquet',
        wallColor: '#283858',
        objects: [
          // Reception Desk
          { type: 'desk', x: 280, y: 380, w: 140, h: 35, label: 'Librarian Desk', color: '#885830' },
          // Bookshelves Left Wing
          { type: 'shelf', x: 80, y: 120, w: 120, h: 30, color: '#583818', label: 'Computer & AI Books' },
          { type: 'shelf', x: 80, y: 180, w: 120, h: 30, color: '#583818', label: 'Science & Physics Books' },
          { type: 'shelf', x: 80, y: 240, w: 120, h: 30, color: '#583818', label: 'Life Sciences & Chem' },
          // Bookshelves Right Wing
          { type: 'shelf', x: 500, y: 120, w: 120, h: 30, color: '#583818', label: 'Economics & History' },
          { type: 'shelf', x: 500, y: 180, w: 120, h: 30, color: '#583818', label: 'Literature & Philosophy' },
          { type: 'shelf', x: 500, y: 240, w: 120, h: 30, color: '#583818', label: 'Management & Arts' },
          // Central Study Tables
          { type: 'table', x: 260, y: 150, w: 180, h: 50, color: '#a87848', label: 'Reading Table' },
          { type: 'table', x: 260, y: 240, w: 180, h: 50, color: '#a87848', label: 'Reading Table' },
          // Interactive Heritage Archive Terminal
          {
            type: 'terminal',
            x: 320,
            y: 80,
            w: 60,
            h: 40,
            color: '#2858a8',
            label: 'Campus Heritage PC Terminal',
            isQuizTrigger: true,
            quizKey: 'campus_heritage'
          }
        ],
        npcs: [
          { x: 350, y: 350, name: 'Librarian Radhika', type: 'senior', dialogue: 'Welcome to the Central Library! Step up to the archive terminal on the north wall to test your campus heritage knowledge!' }
        ]
      },

      zakir_complex: {
        id: 'zakir_complex',
        name: 'Zakir Complex & Food Court',
        width: 680,
        height: 500,
        spawnX: 340,
        spawnY: 440,
        exitX: 1040,
        exitY: 820,
        floorType: 'checker',
        wallColor: '#884818',
        objects: [
          // Food Counters
          { type: 'counter', x: 70, y: 100, w: 160, h: 40, color: '#d85828', label: '☕ Irani Chai Stall' },
          { type: 'counter', x: 260, y: 100, w: 160, h: 40, color: '#38a848', label: '🥤 Fresh Juice Bar' },
          { type: 'counter', x: 450, y: 100, w: 160, h: 40, color: '#d83838', label: '🍛 Dosa & Snacks' },
          // Dining Tables
          { type: 'table', x: 120, y: 220, w: 100, h: 60, color: '#a86830', label: 'Dining Table' },
          { type: 'table', x: 300, y: 220, w: 100, h: 60, color: '#a86830', label: 'Dining Table' },
          { type: 'table', x: 480, y: 220, w: 100, h: 60, color: '#a86830', label: 'Dining Table' },
          { type: 'table', x: 200, y: 330, w: 120, h: 50, color: '#a86830', label: 'Discussion Table' },
          { type: 'table', x: 380, y: 330, w: 120, h: 50, color: '#a86830', label: 'Student Lounge' }
        ],
        npcs: [
          { x: 150, y: 80, name: 'Chai Master Saleem', type: 'vendor', dialogue: 'Special cardamom Irani chai is ready! A cup of this will fuel your coding and study sessions!' },
          { x: 350, y: 220, name: 'Senior Scholar Rahul', type: 'senior', dialogue: 'Zakir complex is the beating heart of UoH. Best discussions happen right over these chai cups.' }
        ]
      },

      cs_dept: {
        id: 'cs_dept',
        name: 'School of Computer Science & Information Sciences',
        width: 660,
        height: 500,
        spawnX: 330,
        spawnY: 440,
        exitX: 740,
        exitY: 720,
        floorType: 'tiles',
        wallColor: '#183858',
        objects: [
          // Professor Podium & Interactive CS Quiz
          {
            type: 'podium',
            x: 290,
            y: 80,
            w: 80,
            h: 40,
            color: '#2868c8',
            label: 'Lecture Podium (Start CS Quiz)',
            isQuizTrigger: true,
            quizKey: 'computer_science'
          },
          { type: 'whiteboard', x: 220, y: 20, w: 220, h: 25, color: '#e8f0f8', label: 'CS & AI Board' },
          { type: 'rack', x: 60, y: 80, w: 50, h: 90, color: '#181828', label: 'HPC Cluster' },
          { type: 'rack', x: 550, y: 80, w: 50, h: 90, color: '#181828', label: 'AI GPU Rack' },
          { type: 'workstation', x: 120, y: 180, w: 180, h: 45, color: '#485868', label: 'PC Lab Row 1' },
          { type: 'workstation', x: 360, y: 180, w: 180, h: 45, color: '#485868', label: 'PC Lab Row 2' },
          { type: 'workstation', x: 120, y: 280, w: 180, h: 45, color: '#485868', label: 'PC Lab Row 3' },
          { type: 'workstation', x: 360, y: 280, w: 180, h: 45, color: '#485868', label: 'PC Lab Row 4' }
        ],
        npcs: [
          { x: 330, y: 130, name: 'Prof. Sharma', type: 'prof', dialogue: 'Welcome to the CS Lab! Step up to the lecture podium to take the 5-question Computer Science & AI quiz!' }
        ]
      },

      mba_dept: {
        id: 'mba_dept',
        name: 'School of Management Studies (SMS)',
        width: 660,
        height: 500,
        spawnX: 330,
        spawnY: 440,
        exitX: 1140,
        exitY: 600,
        floorType: 'parquet',
        wallColor: '#581818',
        objects: [
          {
            type: 'podium',
            x: 290,
            y: 80,
            w: 80,
            h: 40,
            color: '#b83828',
            label: 'Case Study Podium (Start MBA Quiz)',
            isQuizTrigger: true,
            quizKey: 'management'
          },
          { type: 'screen', x: 230, y: 20, w: 200, h: 25, color: '#f0f0f8', label: 'Strategy Display' },
          { type: 'table', x: 100, y: 180, w: 200, h: 40, color: '#787888', label: 'Executive Row A' },
          { type: 'table', x: 360, y: 180, w: 200, h: 40, color: '#787888', label: 'Executive Row B' },
          { type: 'table', x: 100, y: 270, w: 200, h: 40, color: '#787888', label: 'Executive Row C' },
          { type: 'table', x: 360, y: 270, w: 200, h: 40, color: '#787888', label: 'Executive Row D' }
        ],
        npcs: [
          { x: 330, y: 130, name: 'Prof. Rao', type: 'prof', dialogue: 'Welcome to Management Studies! Interact with the podium to attempt the 5-question Strategy & Marketing quiz!' }
        ]
      },

      mhk_hostel: {
        id: 'mhk_hostel',
        name: 'MHK Hostel — Player Dorm Room',
        width: 600,
        height: 480,
        spawnX: 300,
        spawnY: 420,
        exitX: 1520,
        exitY: 1060,
        floorType: 'parquet',
        wallColor: '#482068',
        objects: [
          // Player Bed (Sleep & Save Action)
          {
            type: 'bed',
            x: 80,
            y: 100,
            w: 90,
            h: 130,
            color: '#2868b8',
            label: 'Your Bed (Sleep & Save)',
            isBed: true
          },
          { type: 'table', x: 220, y: 100, w: 110, h: 60, color: '#8858a8', label: 'Study Desk & Laptop' },
          { type: 'shelf', x: 360, y: 100, w: 80, h: 35, color: '#482058', label: 'Textbooks' },
          { type: 'wardrobe', x: 470, y: 100, w: 60, h: 90, color: '#683078', label: 'Wardrobe' },
          { type: 'window', x: 100, y: 15, w: 50, h: 10, color: '#90d8f8', label: 'Garden Window' },
          { type: 'board', x: 250, y: 20, w: 100, h: 25, color: '#d86828', label: 'Hostel Notice Board' }
        ],
        npcs: [
          { x: 450, y: 350, name: 'Warden Murali', type: 'guard', dialogue: 'Welcome home to MHK Hostel! Walk up to your bed and press E to sleep until morning and save your game.' }
        ]
      }
    };
  }

  getInterior(interiorId) {
    return this.interiorScenes[interiorId] || null;
  }

  drawInterior(ctx, interior, player, camera) {
    ctx.imageSmoothingEnabled = false;

    // Dark Outer Screen
    ctx.fillStyle = '#080c14';
    ctx.fillRect(0, 0, camera.width, camera.height);

    const offsetX = Math.max(0, (camera.width - interior.width) / 2);
    const offsetY = Math.max(0, (camera.height - interior.height) / 2);

    ctx.save();
    ctx.translate(offsetX, offsetY);

    // 1. GBA Floor Patterns
    const tileSize = 32;
    for (let x = 0; x < interior.width; x += tileSize) {
      for (let y = 0; y < interior.height; y += tileSize) {
        const isAlt = ((x / tileSize) + (y / tileSize)) % 2 === 0;

        if (interior.floorType === 'parquet') {
          // Warm wood parquet
          ctx.fillStyle = isAlt ? '#d0a068' : '#c09058';
          ctx.fillRect(x, y, tileSize, tileSize);
          ctx.strokeStyle = '#b08048';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, tileSize, tileSize);
        } else if (interior.floorType === 'checker') {
          // Checkerboard tile
          ctx.fillStyle = isAlt ? '#f8e8d0' : '#d8b898';
          ctx.fillRect(x, y, tileSize, tileSize);
        } else {
          // Cool Lab Tiles
          ctx.fillStyle = isAlt ? '#e0e8e8' : '#d0d8d8';
          ctx.fillRect(x, y, tileSize, tileSize);
          ctx.strokeStyle = '#b8c0c0';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, tileSize, tileSize);
        }
      }
    }

    // 2. Walls
    ctx.fillStyle = interior.wallColor;
    ctx.fillRect(0, 0, interior.width, 30);
    ctx.fillRect(0, 0, 20, interior.height);
    ctx.fillRect(interior.width - 20, 0, 20, interior.height);

    // Wall Trim
    ctx.fillStyle = '#181820';
    ctx.fillRect(0, 28, interior.width, 2);

    // Bottom Wall with Door Exit
    const doorW = 60;
    const doorX = (interior.width - doorW) / 2;
    ctx.fillRect(0, interior.height - 20, doorX, 20);
    ctx.fillRect(doorX + doorW, interior.height - 20, interior.width - (doorX + doorW), 20);

    // FireRed Red Entry Carpet Mat
    ctx.fillStyle = '#d82828';
    ctx.fillRect(doorX, interior.height - 18, doorW, 16);
    ctx.fillStyle = '#f8f8f8';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('EXIT ▼', doorX + doorW / 2, interior.height - 7);

    // Room Header Banner
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(interior.width / 2 - 160, 4, 320, 22);
    ctx.strokeStyle = '#f8d030';
    ctx.lineWidth = 1;
    ctx.strokeRect(interior.width / 2 - 160, 4, 320, 22);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(interior.name, interior.width / 2, 19);

    // 3. Draw Interior Furniture
    for (const obj of interior.objects) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(obj.x + 3, obj.y + 3, obj.w, obj.h);

      ctx.fillStyle = obj.color;
      ctx.fillRect(obj.x, obj.y, obj.w, obj.h);

      // Bed Details (Pillow & Quilt)
      if (obj.isBed) {
        ctx.fillStyle = '#f8f8f8'; // Pillow
        ctx.fillRect(obj.x + 8, obj.y + 8, obj.w - 16, 24);
        ctx.fillStyle = '#3878c8'; // Blue Blanket
        ctx.fillRect(obj.x + 4, obj.y + 36, obj.w - 8, obj.h - 40);
      }

      // Bookshelf Details (Multi-color Book Spines)
      if (obj.type === 'shelf') {
        const colors = ['#d82828', '#2868c8', '#28a848', '#f8a820'];
        for (let bx = obj.x + 4; bx < obj.x + obj.w - 4; bx += 8) {
          ctx.fillStyle = colors[(bx % colors.length)];
          ctx.fillRect(bx, obj.y + 4, 6, obj.h - 8);
        }
      }

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 2;
      ctx.fillText(obj.label, obj.x + obj.w / 2, obj.y + obj.h / 2 + 3);
      ctx.shadowBlur = 0;
    }

    // 4. Draw NPCs
    if (interior.npcs) {
      for (const npc of interior.npcs) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(npc.x + 8, npc.y + 18, 7, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        const sprite = pixelEngine.getNPCSprite(npc.type || 'senior');
        ctx.drawImage(sprite, 0, 0, 16, 20, npc.x, npc.y, 16, 20);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 3;
        ctx.fillText(npc.name, npc.x + 8, npc.y - 4);
        ctx.shadowBlur = 0;
      }
    }

    // 5. Draw Player
    const fakeCamera = { x: -offsetX, y: -offsetY };
    player.draw(ctx, fakeCamera);

    ctx.restore();
  }

  checkInteriorCollision(interior, bounds) {
    if (bounds.x < 20 || bounds.x + bounds.width > interior.width - 20) return true;
    if (bounds.y < 30) return true;

    const doorW = 60;
    const doorX = (interior.width - doorW) / 2;
    if (bounds.y + bounds.height > interior.height - 20) {
      if (bounds.x > doorX && bounds.x + bounds.width < doorX + doorW) {
        return false;
      }
      return true;
    }

    for (const obj of interior.objects) {
      if (
        bounds.x < obj.x + obj.w &&
        bounds.x + bounds.width > obj.x &&
        bounds.y < obj.y + obj.h &&
        bounds.y + bounds.height > obj.y
      ) {
        return true;
      }
    }
    return false;
  }

  getInteriorInteractableAt(interior, playerX, playerY) {
    if (interior.npcs) {
      for (const npc of interior.npcs) {
        const dx = playerX - (npc.x + 8);
        const dy = playerY - (npc.y + 10);
        if (Math.sqrt(dx * dx + dy * dy) <= 50) {
          return { type: 'interior_npc', data: npc };
        }
      }
    }

    for (const obj of interior.objects) {
      const cx = obj.x + obj.w / 2;
      const cy = obj.y + obj.h / 2;
      const dx = playerX - cx;
      const dy = playerY - cy;
      if (Math.sqrt(dx * dx + dy * dy) <= Math.max(obj.w, obj.h) / 2 + 40) {
        if (obj.isBed) return { type: 'bed', data: obj };
        if (obj.isQuizTrigger) return { type: 'quiz', quizKey: obj.quizKey, data: obj };
        return { type: 'interior_object', data: obj };
      }
    }

    const doorW = 60;
    const doorX = (interior.width - doorW) / 2;
    if (playerY > interior.height - 40 && playerX >= doorX - 10 && playerX <= doorX + doorW + 10) {
      return { type: 'exit_door', exitX: interior.exitX, exitY: interior.exitY };
    }

    return null;
  }
}
