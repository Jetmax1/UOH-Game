import { pixelEngine } from './PixelArtEngine.js';

/**
 * Enhanced UoH Enterprise Building & Interior System
 * 
 * Provides authentic Pokémon FireRed GBA-style indoor architecture with:
 * - Rich custom floor tiles (parquet, checkerboard, high-tech lab tiles, sports hardwood)
 * - Atmospheric architectural walls, windows with natural daylight, and exit mats
 * - Comprehensive furniture (desks, computers, bookshelves, samovars, beds, medical units, server racks)
 * - Dynamic time-of-day interior lighting
 * - Interactive objects (Notice boards, readable books, cafeteria menus, pop quizzes, sleep & save)
 * - Logical NPC placement with idle animations and dialogue
 */
export class Interiors {
  constructor() {
    this.interiorScenes = {
      // 1. Indira Gandhi Memorial Library (#51)
      library: {
        id: 'library',
        locationId: 51,
        name: 'Indira Gandhi Memorial Library',
        floorLabel: '1F · Main Reading Commons',
        width: 760,
        height: 560,
        spawnX: 380,
        spawnY: 500,
        exitX: 530,
        exitY: 920,
        section: 'east',
        ambientAudio: 'library',
        floorType: 'parquet',
        wallColor: '#1e293b',
        wallTrimColor: '#f59e0b',
        objects: [
          // Reception Counter
          { type: 'desk', x: 300, y: 410, w: 160, h: 36, label: 'Librarian Desk', color: '#885830' },
          
          // Notice Board
          {
            type: 'notice_board',
            x: 200,
            y: 20,
            w: 90,
            h: 30,
            color: '#b45309',
            label: '📋 Library Notice Board',
            noticeTitle: 'Indira Gandhi Memorial Library Notice',
            noticeSubtitle: 'Digital Archives & Study Timings',
            noticeText: [
              '• 24/7 Air-conditioned reading halls remain open for all registered university scholars.',
              '• Borrowing limit: 6 books for Master students, 10 books for PhD research scholars.',
              '• IEEE, Springer, and JSTOR digital portals accessible via campus intranet terminals on the north wall.',
              '• Maintain pin-drop silence in the reading carrels and study alcoves.'
            ]
          },

          // Digital Archive Terminal (Quiz Trigger)
          {
            type: 'terminal',
            x: 480,
            y: 20,
            w: 80,
            h: 32,
            color: '#1d4ed8',
            label: '💻 Heritage Archive PC',
            isQuizTrigger: true,
            quizKey: 'campus_heritage'
          },

          // Bookshelves Left Wing (Science & Tech)
          {
            type: 'shelf',
            x: 60,
            y: 110,
            w: 140,
            h: 32,
            color: '#583818',
            label: '📚 Computer Science & AI',
            isBook: true,
            bookTitle: 'Artificial Intelligence: A Modern Approach (UoH Edition)',
            bookText: 'This landmark treatise covers autonomous heuristic search, Markov decision processes, neural transformers, and reinforcement learning. Multiple UoH faculty and alumni have contributed foundational research to international AI conferences.'
          },
          {
            type: 'shelf',
            x: 60,
            y: 180,
            w: 140,
            h: 32,
            color: '#583818',
            label: '📚 Physics & Quantum Math',
            isBook: true,
            bookTitle: 'Deccan Geological History & Quantum Dynamics',
            bookText: 'Detailed analytical exploration of the 2.5-billion-year-old Archean granite outcrops across the Hyderabad plateau. Features field surveys of The Masoom’s Rock and the campus check dam aquifers.'
          },
          {
            type: 'shelf',
            x: 60,
            y: 250,
            w: 140,
            h: 32,
            color: '#583818',
            label: '📚 Life Sciences & BioNEST',
            isBook: true,
            bookTitle: 'Flora, Fauna & Ecological Sanctuary of UoH',
            bookText: 'Over 734 plant species, 220 bird varieties including vibrant Indian Peafowl, and diverse aquatic life thrive inside the protected university ecosystem surrounding Peacock Lake and Amphi Lake.'
          },

          // Bookshelves Right Wing (Humanities & Social Sciences)
          {
            type: 'shelf',
            x: 560,
            y: 110,
            w: 140,
            h: 32,
            color: '#583818',
            label: '📚 Economics & Public Policy',
            isBook: true,
            bookTitle: 'Indian Development Policy & Political Economy',
            bookText: 'Seminal analytical monographs by School of Social Sciences scholars examining rural livelihoods, industrial globalization, and institutional sustainability.'
          },
          {
            type: 'shelf',
            x: 560,
            y: 180,
            w: 140,
            h: 32,
            color: '#583818',
            label: '📚 Literature & Philosophy',
            isBook: true,
            bookTitle: 'Comparative Indian Literatures & Poetics',
            bookText: 'Anthology of Telugu, Hindi, Urdu, Sanskrit, and English poetry celebrating cross-cultural synthesis across the Deccan region.'
          },
          {
            type: 'shelf',
            x: 560,
            y: 250,
            w: 140,
            h: 32,
            color: '#583818',
            label: '📚 Management & Strategy',
            isBook: true,
            bookTitle: 'Strategic Technology Leadership & Entrepreneurship',
            bookText: 'Case studies of successful biotechnology and software startups nurtured within ASPIRE BioNEST and TIE-UoH incubation centers.'
          },

          // Central Study Tables
          { type: 'table', x: 260, y: 130, w: 240, h: 54, color: '#a87848', label: 'Study Table Alpha (Quiet Area)' },
          { type: 'table', x: 260, y: 230, w: 240, h: 54, color: '#a87848', label: 'Study Table Beta (Research Carrel)' },
          
          // Indoor Ornamental Plants
          { type: 'plant', x: 40, y: 40, w: 24, h: 24, color: '#16a34a', label: 'Indoor Palm' },
          { type: 'plant', x: 696, y: 40, w: 24, h: 24, color: '#16a34a', label: 'Indoor Palm' },
          { type: 'plant', x: 40, y: 500, w: 24, h: 24, color: '#16a34a', label: 'Ficus Plant' },
          { type: 'plant', x: 696, y: 500, w: 24, h: 24, color: '#16a34a', label: 'Ficus Plant' }
        ],
        npcs: [
          {
            x: 375,
            y: 370,
            name: 'Librarian Radhika',
            type: 'senior',
            role: 'Chief Reference Librarian',
            avatar: '📚',
            dialogue: [
              'Welcome to the Indira Gandhi Memorial Library, student!',
              'We house over 400,000 volumes across three spacious reading floors.',
              'You can read any of the curated book volumes on the shelves, or step up to the north Heritage Terminal to test your campus knowledge!'
            ]
          },
          {
            x: 230,
            y: 140,
            name: 'Scholar Sneha',
            type: 'student',
            role: 'PhD Researcher',
            avatar: '🎓',
            dialogue: [
              'Shh... I am cross-referencing genomic sequencing papers for my doctoral thesis!',
              'The library reading commons is the most peaceful place on campus during sunny afternoons.'
            ]
          }
        ]
      },

      // 2. Central Administration Building (#36)
      admin_building: {
        id: 'admin_building',
        locationId: 36,
        name: 'Central Administration Building',
        floorLabel: '1F · Registrar & Secretariat Quad',
        width: 740,
        height: 520,
        spawnX: 370,
        spawnY: 460,
        exitX: 940,
        exitY: 140,
        section: 'east',
        ambientAudio: 'office',
        floorType: 'tiles',
        wallColor: '#1e3a5f',
        wallTrimColor: '#38bdf8',
        objects: [
          // Grand Reception & Information Desk
          { type: 'desk', x: 290, y: 370, w: 160, h: 36, label: 'Administration Desk', color: '#64748b' },

          // Official Notice Board
          {
            type: 'notice_board',
            x: 310,
            y: 20,
            w: 120,
            h: 30,
            color: '#0284c7',
            label: '📋 Official Circulars Board',
            noticeTitle: 'University Administration Circulars',
            noticeSubtitle: 'Academic Year 2026-27',
            noticeText: [
              '• Convocation Registration: Final degree candidates must register with the Academic Section by Friday.',
              '• National Fellowship & Scholarship: Verification desks open daily 10:00 AM - 04:00 PM.',
              '• Campus E-Shuttle Pass: Collect RFID smart cards from the Transport Desk in West Wing.',
              '• Green Campus Initiative: Single-use plastics are strictly prohibited across all campus zones.'
            ]
          },

          // Office Cubicles & Workstations Left
          { type: 'workstation', x: 70, y: 100, w: 160, h: 48, color: '#334155', label: 'Finance & Accounts Cell' },
          { type: 'workstation', x: 70, y: 190, w: 160, h: 48, color: '#334155', label: 'Examinations & Records' },
          { type: 'workstation', x: 70, y: 280, w: 160, h: 48, color: '#334155', label: 'Scholarship & Fellowship Desk' },

          // Office Cubicles & Workstations Right
          { type: 'workstation', x: 510, y: 100, w: 160, h: 48, color: '#334155', label: 'Registrar Secretariat' },
          { type: 'workstation', x: 510, y: 190, w: 160, h: 48, color: '#334155', label: 'Dean of Students Welfare' },
          { type: 'workstation', x: 510, y: 280, w: 160, h: 48, color: '#334155', label: 'Public Relations & Media' },

          // Waiting Lounge Sofas
          { type: 'sofa', x: 260, y: 160, w: 220, h: 36, color: '#475569', label: 'Visitor Waiting Lounge' },
          { type: 'table', x: 330, y: 230, w: 80, h: 40, color: '#94a3b8', label: 'Official Registers Table' },

          // Plants
          { type: 'plant', x: 40, y: 30, w: 24, h: 24, color: '#16a34a', label: 'Indoor Palm' },
          { type: 'plant', x: 676, y: 30, w: 24, h: 24, color: '#16a34a', label: 'Indoor Palm' }
        ],
        npcs: [
          {
            x: 365,
            y: 330,
            name: 'Officer Jagmohan',
            type: 'prof',
            role: 'Administrative Officer',
            avatar: '🏛️',
            dialogue: [
              'Greetings! Welcome to the Central Administration Building.',
              'This building houses the Vice Chancellor Secretariat, Registrar, and Finance branches.',
              'Be sure to check the official circulars board on the north wall for the latest convocation and fellowship announcements.'
            ]
          },
          {
            x: 550,
            y: 200,
            name: 'Staff Meenakshi',
            type: 'senior',
            role: 'Academic Section Coordinator',
            avatar: '📋',
            dialogue: [
              'Hello student! If you need your migration certificate, grade sheets, or hostel allotment order, our counters are open throughout the week.'
            ]
          }
        ]
      },

      // 3. Admission Office (#37)
      admission_office: {
        id: 'admission_office',
        locationId: 37,
        name: 'Admission Office',
        floorLabel: '1F · Scholar Verification Center',
        width: 680,
        height: 500,
        spawnX: 340,
        spawnY: 440,
        exitX: 880,
        exitY: 250,
        section: 'main',
        ambientAudio: 'office',
        floorType: 'tiles',
        wallColor: '#243c5a',
        wallTrimColor: '#38bdf8',
        objects: [
          { type: 'desk', x: 260, y: 360, w: 160, h: 36, label: 'Document Verification Counter', color: '#475569' },
          
          {
            type: 'notice_board',
            x: 270,
            y: 20,
            w: 140,
            h: 30,
            color: '#0284c7',
            label: '📋 Admission Guidelines Board',
            noticeTitle: 'Central Admissions Office',
            noticeSubtitle: 'Enrollment & ID Smart Card Guidelines',
            noticeText: [
              '• Step 1: Submit national entrance scorecard and verification token at Counter 1.',
              '• Step 2: Biometric photo capture for University RFID Smart Identity Card.',
              '• Step 3: Collect hostel allotment slip for MHK, LH, or Mega Hostels.',
              '• Welcome to the UoH family — your academic adventure begins today!'
            ]
          },

          { type: 'workstation', x: 70, y: 120, w: 150, h: 44, color: '#334155', label: 'Counter 1: Token Issue' },
          { type: 'workstation', x: 70, y: 220, w: 150, h: 44, color: '#334155', label: 'Counter 2: Certificate Check' },
          { type: 'workstation', x: 460, y: 120, w: 150, h: 44, color: '#334155', label: 'Counter 3: Fee Receipt' },
          { type: 'workstation', x: 460, y: 220, w: 150, h: 44, color: '#334155', label: 'Counter 4: Smart Card Hub' },

          { type: 'table', x: 260, y: 160, w: 160, h: 50, color: '#94a3b8', label: 'Student Form Filling Desk' }
        ],
        npcs: [
          {
            x: 335,
            y: 320,
            name: 'Counselor Arvind',
            type: 'prof',
            role: 'Admissions Officer',
            avatar: '🎓',
            dialogue: [
              'Welcome, newcomer! Have you checked in your documents and entrance token?',
              'Once your admission is confirmed here, head south to MHK Hostel (Pin 13) to claim your dorm room!'
            ]
          }
        ]
      },

      // 4. School of Computer & Information Sciences (SCIS) (#45)
      cs_dept: {
        id: 'cs_dept',
        locationId: 45,
        name: 'School of Computer & Information Sciences (SCIS)',
        floorLabel: '1F · AI & Quantum Computing Labs',
        width: 760,
        height: 540,
        spawnX: 380,
        spawnY: 480,
        exitX: 740,
        exitY: 670,
        section: 'east',
        ambientAudio: 'lab',
        floorType: 'cool_tiles',
        wallColor: '#0f172a',
        wallTrimColor: '#3b82f6',
        objects: [
          // Lecture Podium (CS Quiz Trigger)
          {
            type: 'podium',
            x: 340,
            y: 80,
            w: 80,
            h: 36,
            color: '#2563eb',
            label: '🎓 Lecture Podium (CS Quiz)',
            isQuizTrigger: true,
            quizKey: 'computer_science'
          },

          // CS Whiteboard
          {
            type: 'whiteboard',
            x: 250,
            y: 16,
            w: 260,
            h: 26,
            color: '#e2e8f0',
            label: '📐 CS & AI Lecture Whiteboard',
            isWhiteboard: true,
            boardTitle: 'Today’s Lecture: Transformer Architectures & Multi-Agent Systems',
            boardText: 'Self-attention mechanism: Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V. High-Performance Cluster connected via 100Gbps InfiniBand. Next assignment due Friday 23:59.'
          },

          // High Performance Compute Clusters (HPC)
          {
            type: 'rack',
            x: 50,
            y: 70,
            w: 60,
            h: 110,
            color: '#020617',
            label: '⚡ Param-Ganga HPC Rack',
            isExamine: true,
            examineTitle: 'Param-Ganga High-Performance Cluster',
            examineText: '128-node compute cluster with 4,096 CPU cores delivering 1.2 PetaFLOPS for climate modeling, molecular dynamics, and quantum circuit simulations.'
          },
          {
            type: 'rack',
            x: 650,
            y: 70,
            w: 60,
            h: 110,
            color: '#020617',
            label: '⚡ DGX-A100 AI Server',
            isExamine: true,
            examineTitle: 'NVIDIA DGX-A100 Deep Learning Server',
            examineText: '8x NVIDIA A100 Tensor Core GPUs with 640GB GPU memory, powering speech processing, computer vision, and LLM fine-tuning.'
          },

          // CS Notice Board
          {
            type: 'notice_board',
            x: 530,
            y: 16,
            w: 100,
            h: 26,
            color: '#1d4ed8',
            label: '📋 SCIS Notice Board',
            noticeTitle: 'SCIS Department Notices',
            noticeSubtitle: 'Hackathon & Research Seminars',
            noticeText: [
              '• 24-Hour AI Hackathon: Registrations open for all BTech, MTech, and MCA students.',
              '• Lab GPUs usage policy: Background training jobs must yield to interactive classroom sessions.',
              '• Seminar on Quantum Computing Algorithms by visiting scientist on Wednesday 03:00 PM.'
            ]
          },

          // Workstation Rows (4 Rows)
          { type: 'workstation', x: 140, y: 190, w: 200, h: 44, color: '#334155', label: '🖥️ Lab Row Alpha (AI & ML)' },
          { type: 'workstation', x: 420, y: 190, w: 200, h: 44, color: '#334155', label: '🖥️ Lab Row Beta (Networks)' },
          { type: 'workstation', x: 140, y: 290, w: 200, h: 44, color: '#334155', label: '🖥️ Lab Row Gamma (Systems)' },
          { type: 'workstation', x: 420, y: 290, w: 200, h: 44, color: '#334155', label: '🖥️ Lab Row Delta (Security)' }
        ],
        npcs: [
          {
            x: 380,
            y: 130,
            name: 'Prof. Sharma',
            type: 'prof',
            role: 'Dean, SCIS',
            avatar: '👨‍🏫',
            dialogue: [
              'Welcome to the School of Computer and Information Sciences (SCIS)!',
              'We conduct world-class research in Artificial Intelligence, NLP, distributed operating systems, and cybersecurity.',
              'Step up to the central lecture podium to test your knowledge in the 5-question CS pop quiz!'
            ]
          },
          {
            x: 200,
            y: 200,
            name: 'Researcher Tanmay',
            type: 'student',
            role: 'MTech AI Scholar',
            avatar: '💻',
            dialogue: [
              'Hey! I just benchmarked our new neural graph model on the DGX cluster.',
              'The compile speed is incredible! SCIS labs are truly 24/7.'
            ]
          }
        ]
      },

      // 5. School of Life Sciences (SLS) (#3)
      sls_dept: {
        id: 'sls_dept',
        locationId: 3,
        name: 'School of Life Sciences (SLS)',
        floorLabel: '1F · Genomics & Biotech Complex',
        width: 740,
        height: 540,
        spawnX: 370,
        spawnY: 480,
        exitX: 280,
        exitY: 1040,
        section: 'south',
        ambientAudio: 'lab',
        floorType: 'cool_tiles',
        wallColor: '#064e3b',
        wallTrimColor: '#10b981',
        objects: [
          // Biology Podium (Quiz Trigger)
          {
            type: 'podium',
            x: 330,
            y: 80,
            w: 80,
            h: 36,
            color: '#059669',
            label: '🔬 Biology Podium (Start Quiz)',
            isQuizTrigger: true,
            quizKey: 'life_sciences'
          },

          // SLS Whiteboard
          {
            type: 'whiteboard',
            x: 240,
            y: 16,
            w: 260,
            h: 26,
            color: '#e2e8f0',
            label: '🧬 Molecular Biology Whiteboard',
            isWhiteboard: true,
            boardTitle: 'Molecular Genetics & CRISPR Gene Editing Lecture',
            boardText: 'Recombinant DNA technology: Cas9 endonuclease targeting specific 20nt guide RNA sequences. Next lab session: Western Blotting and Gel Electrophoresis on Thursday.'
          },

          // High-End Biotech Instruments
          {
            type: 'rack',
            x: 50,
            y: 80,
            w: 65,
            h: 100,
            color: '#065f46',
            label: '🧬 Illumina DNA Sequencer',
            isExamine: true,
            examineTitle: 'Next-Generation High-Throughput DNA Sequencer',
            examineText: 'Next-generation genomic sequencer capable of mapping entire microbial and plant genomes in under 24 hours.'
          },
          {
            type: 'rack',
            x: 625,
            y: 80,
            w: 65,
            h: 100,
            color: '#065f46',
            label: '❄️ Ultracentrifuge & Cryo-Unit',
            isExamine: true,
            examineTitle: '100,000 RPM Ultracentrifuge & Cryogenic Freezer',
            examineText: 'Precision fractionation suite with -80°C bio-sample storage preserving cellular proteins and rare botanical specimens.'
          },

          // SLS Notice Board
          {
            type: 'notice_board',
            x: 520,
            y: 16,
            w: 95,
            h: 26,
            color: '#047857',
            label: '📋 SLS Notice Board',
            noticeTitle: 'School of Life Sciences Notice',
            noticeSubtitle: 'ASPIRE BioNEST & Research Grants',
            noticeText: [
              '• ASPIRE BioNEST Incubator: Grants of up to ₹25 Lakhs available for biotechnology and medical device student startups.',
              '• Botanical Nursery Field Tour: Scheduled this Saturday starting at Greenhouse (Pin 4).',
              '• Biosafety Level-3 protocol compliance is mandatory across all tissue culture labs.'
            ]
          },

          // Lab Workstation Benches
          { type: 'workstation', x: 130, y: 190, w: 200, h: 44, color: '#047857', label: '🔬 Biochemistry Lab Bench 1' },
          { type: 'workstation', x: 410, y: 190, w: 200, h: 44, color: '#047857', label: '🔬 Plant Genetics Bench 2' },
          { type: 'workstation', x: 130, y: 290, w: 200, h: 44, color: '#047857', label: '🔬 Animal Biology Bench 3' },
          { type: 'workstation', x: 410, y: 290, w: 200, h: 44, color: '#047857', label: '🔬 Bio-Incubation Bench 4' }
        ],
        npcs: [
          {
            x: 370,
            y: 130,
            name: 'Prof. Manjula Sridharan',
            type: 'prof',
            role: 'Dean, School of Life Sciences',
            avatar: '👩‍🔬',
            dialogue: [
              'Welcome to the School of Life Sciences (SLS)!',
              'Our department unites Biochemistry, Plant Sciences, Animal Biology, and Biotechnology.',
              'Interact with our central podium to take the Life Sciences quiz, or inspect our high-throughput DNA sequencer!'
            ]
          }
        ]
      },

      // 6. School of Management Studies (SMS) (#72)
      sms_dept: {
        id: 'sms_dept',
        locationId: 72,
        name: 'School of Management Studies (SMS)',
        floorLabel: '1F · Executive Strategy & Business Center',
        width: 700,
        height: 520,
        spawnX: 350,
        spawnY: 460,
        exitX: 720,
        exitY: 380,
        section: 'main',
        ambientAudio: 'office',
        floorType: 'parquet',
        wallColor: '#4c0519',
        wallTrimColor: '#fb7185',
        objects: [
          // Case Study Podium
          {
            type: 'podium',
            x: 310,
            y: 80,
            w: 80,
            h: 36,
            color: '#be123c',
            label: '📈 Case Study Podium (MBA Quiz)',
            isQuizTrigger: true,
            quizKey: 'management'
          },

          // Multimedia Presentation Screen
          {
            type: 'screen',
            x: 230,
            y: 16,
            w: 240,
            h: 26,
            color: '#f8fafc',
            label: '📊 Strategy & Analytics Screen',
            isExamine: true,
            examineTitle: 'Executive MBA Case Study Display',
            examineText: 'Global Supply Chain & Financial Engineering presentation: Strategic expansion in emerging Asian markets and digital FinTech innovations.'
          },

          // Notice Board
          {
            type: 'notice_board',
            x: 490,
            y: 16,
            w: 90,
            h: 26,
            color: '#9f1239',
            label: '📋 SMS Placement Board',
            noticeTitle: 'SMS Placement & Conclave Notice',
            noticeSubtitle: 'Corporate Leadership Forum',
            noticeText: [
              '• Annual Placement Season: Tier-1 investment banks and tech consultancies visiting next week.',
              '• Business Analytics Case Challenge: Cash prizes worth ₹50,000.',
              '• Guest lecture on Venture Capital by visiting alumni entrepreneur.'
            ]
          },

          // Executive Boardroom Tables
          { type: 'table', x: 100, y: 190, w: 220, h: 44, color: '#881337', label: 'Executive Row A (Consulting)' },
          { type: 'table', x: 380, y: 190, w: 220, h: 44, color: '#881337', label: 'Executive Row B (Analytics)' },
          { type: 'table', x: 100, y: 290, w: 220, h: 44, color: '#881337', label: 'Executive Row C (Marketing)' },
          { type: 'table', x: 380, y: 290, w: 220, h: 44, color: '#881337', label: 'Executive Row D (Finance)' }
        ],
        npcs: [
          {
            x: 350,
            y: 130,
            name: 'Prof. Rao',
            type: 'prof',
            role: 'Dean, Management Studies',
            avatar: '📈',
            dialogue: [
              'Welcome to the School of Management Studies (SMS)!',
              'We groom strategic leaders and entrepreneurs in technology management and business analytics.',
              'Step up to the case study podium to attempt the 5-question Management pop quiz!'
            ]
          }
        ]
      },

      // 7. Sukoon Canteen (#59)
      sukoon_canteen: {
        id: 'sukoon_canteen',
        locationId: 59,
        name: 'Sukoon Canteen & Student Commons',
        floorLabel: '1F · Open-Air Food Court & Chai Stall',
        width: 740,
        height: 520,
        spawnX: 370,
        spawnY: 460,
        exitX: 1020,
        exitY: 820,
        section: 'east',
        ambientAudio: 'canteen',
        floorType: 'checker',
        wallColor: '#78350f',
        wallTrimColor: '#f59e0b',
        objects: [
          // Food & Chai Service Counter
          { type: 'counter', x: 80, y: 80, w: 180, h: 40, color: '#d97706', label: '☕ Irani Chai Samovar & Snacks' },
          { type: 'counter', x: 280, y: 80, w: 180, h: 40, color: '#16a34a', label: '🥤 Fresh Juice & Shakes' },
          { type: 'counter', x: 480, y: 80, w: 180, h: 40, color: '#dc2626', label: '🍛 Samosa & Hot Maggi Bar' },

          // Interactive Menu Board
          {
            type: 'menu',
            x: 320,
            y: 16,
            w: 100,
            h: 26,
            color: '#b45309',
            label: '📜 View Canteen Menu',
            menuTitle: 'Sukoon Canteen Menu & Specials',
            menuSubtitle: 'Freshly Prepared Daily',
            menuItems: [
              { name: 'Special Cardamom Irani Chai', price: '₹12', desc: 'Slow-brewed rich tea with cardamom, the true fuel of UoH scholars.' },
              { name: 'Osmania Biscuits (Pair)', price: '₹10', desc: 'Classic Hyderabadi salted butter tea biscuits.' },
              { name: 'Crispy Onion Samosa', price: '₹15', desc: 'Golden-fried with mint chutney and fried green chilies.' },
              { name: 'Butter Maggi Noodles (Double)', price: '₹35', desc: 'Steaming midnight snack cooked with diced veggies and butter.' },
              { name: 'Egg / Paneer Puff', price: '₹20', desc: 'Flaky baked pastry filled with spicy masala.' },
              { name: 'Chilled Filter Cold Coffee', price: '₹30', desc: 'Thick, creamy blend perfect for hot campus afternoons.' }
            ]
          },

          // Cultural & Jam Notice Board
          {
            type: 'notice_board',
            x: 520,
            y: 16,
            w: 100,
            h: 26,
            color: '#d97706',
            label: '📋 Cultural Notice Board',
            noticeTitle: 'Sukoon Cultural Jam Corner',
            noticeSubtitle: 'Open Mic & Music Sessions',
            noticeText: [
              '• Acoustic Jam Session: Friday 07:30 PM under the banyan tree lights.',
              '• Poetry Slam & Stand-up Comedy: Registration open for all hostel students.',
              '• Night Canteen: Open after 10:00 PM every night serving hot snacks.'
            ]
          },

          // Dining Tables
          { type: 'table', x: 100, y: 190, w: 110, h: 54, color: '#92400e', label: 'Dining Table 1' },
          { type: 'table', x: 270, y: 190, w: 110, h: 54, color: '#92400e', label: 'Dining Table 2' },
          { type: 'table', x: 440, y: 190, w: 110, h: 54, color: '#92400e', label: 'Dining Table 3' },
          { type: 'table', x: 610, y: 190, w: 90, h: 54, color: '#92400e', label: 'High Table' },

          { type: 'table', x: 180, y: 300, w: 140, h: 50, color: '#92400e', label: 'Discussion Table Alpha' },
          { type: 'table', x: 380, y: 300, w: 140, h: 50, color: '#92400e', label: 'Discussion Table Beta' }
        ],
        npcs: [
          {
            x: 170,
            y: 60,
            name: 'Raju Bhai',
            type: 'vendor',
            role: 'Sukoon Canteen Master',
            avatar: '☕',
            dialogue: [
              'Bhaiya, namaste! Welcome to Sukoon Canteen!',
              'Freshly brewed cardamom Irani chai and hot samosas are ready.',
              'Check out our menu board on the wall or sit with friends at the discussion tables!'
            ]
          },
          {
            x: 310,
            y: 200,
            name: 'Senior Aarav',
            type: 'student',
            role: 'MA Communication Scholar',
            avatar: '🎸',
            dialogue: [
              'Zakir Complex and Sukoon are the best spots in all of Hyderabad.',
              'Every great film idea and coding breakthrough here starts over a cup of chai!'
            ]
          }
        ]
      },

      // 8. South Shopping Complex & Food Court (#9)
      zakir_complex: {
        id: 'zakir_complex',
        locationId: 9,
        name: 'South Shopping Complex & Food Court',
        floorLabel: '1F · South Food Hub & Grocery',
        width: 740,
        height: 520,
        spawnX: 370,
        spawnY: 460,
        exitX: 800,
        exitY: 1360,
        section: 'south',
        ambientAudio: 'canteen',
        floorType: 'checker',
        wallColor: '#854d0e',
        wallTrimColor: '#eab308',
        objects: [
          { type: 'counter', x: 80, y: 80, w: 180, h: 40, color: '#d97706', label: '☕ Saleem Bhai Chai & Bakery' },
          { type: 'counter', x: 280, y: 80, w: 180, h: 40, color: '#059669', label: '🥤 Fruit Juice & Lassi Hub' },
          { type: 'counter', x: 480, y: 80, w: 180, h: 40, color: '#dc2626', label: '🍛 Dosa, Idli & Paratha Stall' },

          {
            type: 'menu',
            x: 320,
            y: 16,
            w: 100,
            h: 26,
            color: '#b45309',
            label: '📜 South Complex Menu',
            menuTitle: 'South Complex Night Canteen Menu',
            menuSubtitle: 'Open Daily 07:00 AM - 11:00 PM',
            menuItems: [
              { name: 'Special Filter Coffee', price: '₹15', desc: 'Aromatic South Indian filter coffee in traditional steel tumbler.' },
              { name: 'Ghee Podi Masala Dosa', price: '₹45', desc: 'Crisp golden dosa filled with potato masala and spicy podi.' },
              { name: 'Steamed Idli Sambar (2 Pcs)', price: '₹30', desc: 'Soft idlis served with hot vegetable lentil stew and coconut chutney.' },
              { name: 'Paneer / Egg Kathi Roll', price: '₹55', desc: 'Flaky paratha wrap with grilled paneer cubes and sliced onions.' },
              { name: 'Fresh Sweet Lime Juice', price: '₹30', desc: 'Freshly squeezed mosambi juice with crushed ice.' }
            ]
          },

          { type: 'table', x: 100, y: 190, w: 120, h: 54, color: '#92400e', label: 'Dining Table 1' },
          { type: 'table', x: 280, y: 190, w: 120, h: 54, color: '#92400e', label: 'Dining Table 2' },
          { type: 'table', x: 460, y: 190, w: 120, h: 54, color: '#92400e', label: 'Dining Table 3' },

          { type: 'table', x: 180, y: 300, w: 160, h: 50, color: '#92400e', label: 'Hostelers Lounge Alpha' },
          { type: 'table', x: 400, y: 300, w: 160, h: 50, color: '#92400e', label: 'Hostelers Lounge Beta' }
        ],
        npcs: [
          {
            x: 170,
            y: 60,
            name: 'Chai Master Saleem',
            type: 'vendor',
            role: 'South Complex Master',
            avatar: '☕',
            dialogue: [
              'Salam bhai! Special cardamom tea and hot Mysore bondas are ready!',
              'Students from MHK, Tagore, and Life Sciences come here every evening.'
            ]
          }
        ]
      },

      // 9. MHK Hostel Dorm & Common Hall (#13)
      mhk_hostel: {
        id: 'mhk_hostel',
        locationId: 13,
        name: 'MHK Hostel — Player Dormitory Room',
        floorLabel: '1F · Dorm Room 104 & Common Hall',
        width: 720,
        height: 520,
        spawnX: 360,
        spawnY: 460,
        exitX: 1540,
        exitY: 1060,
        section: 'south',
        ambientAudio: 'hostel',
        floorType: 'parquet',
        wallColor: '#3b0764',
        wallTrimColor: '#c084fc',
        objects: [
          // Player Bed (Sleep & Restore Stamina)
          {
            type: 'bed',
            x: 70,
            y: 90,
            w: 100,
            h: 140,
            color: '#2563eb',
            label: '🛏️ Your Dorm Bed (Sleep & Save)',
            isBed: true
          },

          // Student Study Desk & Laptop
          {
            type: 'table',
            x: 210,
            y: 90,
            w: 130,
            h: 60,
            color: '#9333ea',
            label: '💻 Study Desk & Laptop',
            isExamine: true,
            examineTitle: 'Your Student Study Station',
            examineText: 'Laptop running code editors and lecture notes. A stack of campus library books sits neatly beside your desk lamp.'
          },

          // Bookshelf
          {
            type: 'shelf',
            x: 370,
            y: 90,
            w: 90,
            h: 36,
            color: '#581c87',
            label: '📚 Textbooks Shelf',
            isBook: true,
            bookTitle: 'Hosteler’s Survival Handbook',
            bookText: 'Tips for living on South Campus: 1. Keep your cycle locked. 2. Sunday special biryani starts at 12:30 PM. 3. Watch for peacocks on your morning walk!'
          },

          // Wardrobe
          { type: 'wardrobe', x: 490, y: 90, w: 70, h: 90, color: '#7e22ce', label: 'Wardrobe' },

          // Window
          { type: 'window', x: 110, y: 16, w: 60, h: 12, color: '#90d8f8', label: 'Garden Window' },

          // Hostel Notice Board
          {
            type: 'notice_board',
            x: 270,
            y: 16,
            w: 120,
            h: 26,
            color: '#7c3aed',
            label: '📋 Hostel Notice Board',
            noticeTitle: 'MHK Hostel Official Circular',
            noticeSubtitle: 'Mess Timings & Common Room Rules',
            noticeText: [
              '• Breakfast: 07:30 AM - 09:15 AM | Lunch: 12:30 PM - 02:15 PM | Dinner: 07:30 PM - 09:30 PM.',
              '• Common Room: Table tennis racquets and daily national newspapers available at Warden desk.',
              '• Night silence hours start at 11:00 PM for all residential corridors.'
            ]
          },

          // Common Lounge Area
          { type: 'sofa', x: 230, y: 220, w: 220, h: 40, color: '#6b21a8', label: 'Common Lounge Sofa' },
          { type: 'table', x: 270, y: 300, w: 140, h: 44, color: '#a855f7', label: 'Hostel Discussion Table' }
        ],
        npcs: [
          {
            x: 480,
            y: 350,
            name: 'Warden Murali',
            type: 'guard',
            role: 'Hostel Warden, MHK',
            avatar: '🔑',
            dialogue: [
              'Welcome home to MHK Hostel, student!',
              'You can walk up to your bed on the west wall and press E anytime to sleep until morning and restore your full stamina.',
              'Your progress is automatically saved every time you rest.'
            ]
          }
        ]
      },

      // 10. University Health Centre (#38)
      health_centre: {
        id: 'health_centre',
        locationId: 38,
        name: 'University Health Centre',
        floorLabel: '1F · Primary Clinic & Emergency Hub',
        width: 700,
        height: 500,
        spawnX: 350,
        spawnY: 440,
        exitX: 970,
        exitY: 340,
        section: 'east',
        ambientAudio: 'office',
        floorType: 'cool_tiles',
        wallColor: '#0f766e',
        wallTrimColor: '#2dd4bf',
        objects: [
          // Medical Consultation Desk
          { type: 'desk', x: 270, y: 360, w: 160, h: 36, label: 'Doctor Consultation Desk', color: '#115e59' },

          // Health Notice Board
          {
            type: 'notice_board',
            x: 280,
            y: 20,
            w: 140,
            h: 30,
            color: '#0d9488',
            label: '📋 Health Advisory Board',
            noticeTitle: 'Health Centre Notice & Helpline',
            noticeSubtitle: '24x7 Round-the-Clock Care',
            noticeText: [
              '• 24/7 Ambulance Emergency Line: Dial 108 or Campus Ext: 222.',
              '• Daily Outpatient Timings: 08:00 AM - 08:00 PM (Emergency 24x7).',
              '• Free dispensary medicines available with valid student smart card.',
              '• Stay hydrated and protect yourself from seasonal heat during summer months.'
            ]
          },

          // Medicine Dispensary
          {
            type: 'rack',
            x: 60,
            y: 90,
            w: 80,
            h: 80,
            color: '#134e4a',
            label: '💊 Pharmacy Dispensary',
            isExamine: true,
            examineTitle: 'Central Pharmacy Dispensary',
            examineText: 'Stocked with essential medicines, first-aid kits, fever remedies, and emergency injectables for all campus residents.'
          },

          // Recovery Beds
          { type: 'bed', x: 480, y: 90, w: 70, h: 110, color: '#0284c7', label: 'Recovery Bed Alpha' },
          { type: 'bed', x: 570, y: 90, w: 70, h: 110, color: '#0284c7', label: 'Recovery Bed Beta' },

          // Waiting Chairs
          { type: 'sofa', x: 180, y: 150, w: 160, h: 34, color: '#14b8a6', label: 'Patient Waiting Chairs' }
        ],
        npcs: [
          {
            x: 345,
            y: 320,
            name: 'Dr. Ananya',
            type: 'prof',
            role: 'Chief Medical Officer',
            avatar: '🩺',
            dialogue: [
              'Hello! Welcome to the University Health Centre.',
              'We are on duty 24/7 to support the physical and mental wellness of all students and staff.',
              'Stay healthy, drink plenty of water, and never hesitate to visit if you feel unwell!'
            ]
          }
        ]
      },

      // 11. Indoor Stadium & Gymnasium (#30)
      sports_complex: {
        id: 'sports_complex',
        locationId: 30,
        name: 'Indoor Stadium & Gymnasium',
        floorLabel: '1F · Arena & Fitness Center',
        width: 760,
        height: 540,
        spawnX: 380,
        spawnY: 480,
        exitX: 550,
        exitY: 260,
        section: 'west',
        ambientAudio: 'gym',
        floorType: 'sports_wood',
        wallColor: '#1e293b',
        wallTrimColor: '#f59e0b',
        objects: [
          // Sports Schedule Board
          {
            type: 'notice_board',
            x: 310,
            y: 20,
            w: 140,
            h: 30,
            color: '#b45309',
            label: '📋 Sports Schedule Board',
            noticeTitle: 'UoH Sports Council Notice',
            noticeSubtitle: 'Inter-University Tournament Schedule',
            noticeText: [
              '• Badminton & Table Tennis Courts: Open 06:00 AM - 09:00 PM daily.',
              '• Fitness Gym: Free weights and cardio training with certified coaches.',
              '• Annual Inter-Department Athletics Meet scheduled for next month.',
              '• Non-marking indoor court shoes are mandatory inside the wooden arena.'
            ]
          },

          // Weight Training & Dumbbell Racks
          {
            type: 'rack',
            x: 60,
            y: 80,
            w: 90,
            h: 60,
            color: '#475569',
            label: '🏋️ Dumbbell Racks',
            isExamine: true,
            examineTitle: 'Heavy-Duty Olympic Dumbbell & Barbell Rack',
            examineText: 'High-grade Olympic steel barbells, rubber hex dumbbells (5kg - 40kg), and powerlifting platforms.'
          },
          {
            type: 'rack',
            x: 60,
            y: 180,
            w: 90,
            h: 60,
            color: '#475569',
            label: '🏃 Treadmills & Cardio',
            isExamine: true,
            examineTitle: 'Cardio Endurance Training Suite',
            examineText: 'Commercial treadmills, rowing ergometers, and stationary spin bikes for stamina building.'
          },

          // Trophy Cabinet
          {
            type: 'shelf',
            x: 610,
            y: 80,
            w: 90,
            h: 60,
            color: '#d97706',
            label: '🏆 Championship Trophies',
            isExamine: true,
            examineTitle: 'All-India Inter-University Championship Trophies',
            examineText: 'Gleaming gold and silver cups won by UoH teams across volleyball, badminton, chess, and track & field.'
          },

          // Locker Benches
          { type: 'table', x: 230, y: 180, w: 300, h: 40, color: '#b45309', label: 'Badminton Court Line 1' },
          { type: 'table', x: 230, y: 280, w: 300, h: 40, color: '#b45309', label: 'Badminton Court Line 2' }
        ],
        npcs: [
          {
            x: 375,
            y: 120,
            name: 'Coach Vikram',
            type: 'senior',
            role: 'Director of Physical Education',
            avatar: '🏃',
            dialogue: [
              'Welcome to the Indoor Stadium and Gym!',
              'Regular athletics and fitness sharpen your mind for research and coding.',
              'Feel free to use the fitness machines or challenge your friends on the badminton courts!'
            ]
          }
        ]
      }
    };
  }

  getInterior(interiorId) {
    return this.interiorScenes[interiorId] || null;
  }

  drawInterior(ctx, interior, player, camera, timeSystem = null) {
    ctx.imageSmoothingEnabled = false;

    // 1. Dark Outer Letterbox Screen
    ctx.fillStyle = '#050811';
    ctx.fillRect(0, 0, camera.width, camera.height);

    const offsetX = Math.max(0, (camera.width - interior.width) / 2);
    const offsetY = Math.max(0, (camera.height - interior.height) / 2);

    ctx.save();
    ctx.translate(offsetX, offsetY);

    // 2. High-Quality Flooring System
    const tileSize = 32;
    for (let x = 0; x < interior.width; x += tileSize) {
      for (let y = 0; y < interior.height; y += tileSize) {
        const isAlt = ((x / tileSize) + (y / tileSize)) % 2 === 0;

        if (interior.floorType === 'parquet') {
          // Warm Parquet Hardwood
          ctx.fillStyle = isAlt ? '#d0a068' : '#c09058';
          ctx.fillRect(x, y, tileSize, tileSize);
          ctx.strokeStyle = '#b08048';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, tileSize, tileSize);
          // Wood grain streaks
          ctx.fillStyle = 'rgba(0,0,0,0.04)';
          ctx.fillRect(x + 4, y + 6, tileSize - 8, 2);
          ctx.fillRect(x + 8, y + 18, tileSize - 12, 2);
        } else if (interior.floorType === 'checker') {
          // Retro Cafe Checkerboard
          ctx.fillStyle = isAlt ? '#fef08a' : '#92400e';
          ctx.fillRect(x, y, tileSize, tileSize);
          ctx.strokeStyle = 'rgba(0,0,0,0.15)';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, tileSize, tileSize);
        } else if (interior.floorType === 'sports_wood') {
          // Gym Polished Hardwood
          ctx.fillStyle = isAlt ? '#e2a855' : '#d49740';
          ctx.fillRect(x, y, tileSize, tileSize);
          ctx.strokeStyle = '#c48730';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, tileSize, tileSize);
        } else {
          // Modern High-Tech Lab Ceramic Tiles
          ctx.fillStyle = isAlt ? '#f1f5f9' : '#e2e8f0';
          ctx.fillRect(x, y, tileSize, tileSize);
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, tileSize, tileSize);
        }
      }
    }

    // 3. Architectural Walls & Trims
    const wallHeight = 36;
    const wallTrim = 20;

    // Top Wall Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(0, wallHeight, interior.width, 10);

    // North Wall
    ctx.fillStyle = interior.wallColor;
    ctx.fillRect(0, 0, interior.width, wallHeight);

    // West & East Border Walls
    ctx.fillRect(0, 0, wallTrim, interior.height);
    ctx.fillRect(interior.width - wallTrim, 0, wallTrim, interior.height);

    // Wall Golden/Cyan Baseboard Trim
    ctx.fillStyle = interior.wallTrimColor || '#f59e0b';
    ctx.fillRect(0, wallHeight - 3, interior.width, 3);
    ctx.fillRect(wallTrim - 2, 0, 2, interior.height);
    ctx.fillRect(interior.width - wallTrim, 0, 2, interior.height);

    // Wall Top Windows with Sunlight
    const numWindows = 4;
    for (let i = 1; i <= numWindows; i++) {
      const wx = (interior.width / (numWindows + 1)) * i - 20;
      // Window Frame
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(wx - 2, 6, 44, 20);
      // Window Glass
      ctx.fillStyle = '#7dd3fc';
      ctx.fillRect(wx, 8, 40, 16);
      // Window cross divider
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(wx + 19, 8, 2, 16);
      ctx.fillRect(wx, 15, 40, 2);
    }

    // Bottom Wall & Door Threshold
    const doorW = 80;
    const doorX = (interior.width - doorW) / 2;
    ctx.fillStyle = interior.wallColor;
    ctx.fillRect(0, interior.height - 20, doorX, 20);
    ctx.fillRect(doorX + doorW, interior.height - 20, interior.width - (doorX + doorW), 20);

    // Entryway Red Carpet Mat
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(doorX, interior.height - 20, doorW, 18);
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1;
    ctx.strokeRect(doorX, interior.height - 20, doorW, 18);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('EXIT TO CAMPUS ▼', doorX + doorW / 2, interior.height - 8);

    // 4. Room Header Banner (Building Name & Floor)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(interior.width / 2 - 200, 4, 400, 24);
    ctx.strokeStyle = interior.wallTrimColor || '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(interior.width / 2 - 200, 4, 400, 24);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    ctx.fillText(interior.name.toUpperCase(), interior.width / 2, 16);
    
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 7px sans-serif';
    ctx.fillText(interior.floorLabel || '1F', interior.width / 2, 25);
    ctx.shadowBlur = 0;

    // 5. Draw Furniture & Objects
    for (const obj of interior.objects) {
      // Drop Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(obj.x + 3, obj.y + 4, obj.w, obj.h);

      // Base Body
      ctx.fillStyle = obj.color || '#64748b';
      ctx.fillRect(obj.x, obj.y, obj.w, obj.h);

      // Object-Specific Detailing
      if (obj.isBed) {
        // Bed Pillows & Blankets
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(obj.x + 8, obj.y + 8, obj.w - 16, 26);
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(obj.x + 6, obj.y + 42, obj.w - 12, obj.h - 48);
        ctx.fillStyle = '#1d4ed8';
        ctx.fillRect(obj.x + 6, obj.y + 42, obj.w - 12, 6);
      } else if (obj.type === 'shelf') {
        // Multi-Color Book Spines
        const spineColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
        for (let bx = obj.x + 4; bx < obj.x + obj.w - 6; bx += 8) {
          ctx.fillStyle = spineColors[(bx % spineColors.length)];
          ctx.fillRect(bx, obj.y + 4, 6, obj.h - 8);
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(bx + 1, obj.y + 8, 4, 1);
        }
      } else if (obj.type === 'rack') {
        // Server Racks with Blinking Status LEDs
        for (let ry = obj.y + 6; ry < obj.y + obj.h - 8; ry += 12) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(obj.x + 4, ry, obj.w - 8, 9);
          // Blinking LED dots
          const blink = Math.sin(Date.now() / 200 + ry) > 0;
          ctx.fillStyle = blink ? '#22c55e' : '#3b82f6';
          ctx.beginPath();
          ctx.arc(obj.x + 8, ry + 4, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (obj.type === 'notice_board') {
        // Wooden Cork Texture with Pinned Paper Notes
        ctx.fillStyle = '#d97706';
        ctx.fillRect(obj.x + 2, obj.y + 2, obj.w - 4, obj.h - 4);
        // Paper Pins
        const pinColors = ['#ffffff', '#fef08a', '#93c5fd', '#fca5a5'];
        let pidx = 0;
        for (let px = obj.x + 6; px < obj.x + obj.w - 12; px += 16) {
          ctx.fillStyle = pinColors[pidx % pinColors.length];
          ctx.fillRect(px, obj.y + 5, 12, obj.h - 10);
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(px + 5, obj.y + 6, 2, 2);
          pidx++;
        }
      } else if (obj.type === 'plant') {
        // Potted Indoor Greenery
        ctx.fillStyle = '#b45309';
        ctx.fillRect(obj.x + 4, obj.y + 12, obj.w - 8, obj.h - 12);
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(obj.x + obj.w / 2, obj.y + 8, obj.w / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Border Outline
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

      // Label Text (If not plant)
      if (obj.type !== 'plant') {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 2;
        ctx.fillText(obj.label, obj.x + obj.w / 2, obj.y + obj.h / 2 + 3);
        ctx.shadowBlur = 0;
      }
    }

    // 6. Draw NPCs inside the Room
    if (interior.npcs) {
      for (const npc of interior.npcs) {
        // NPC Drop Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(npc.x + 8, npc.y + 18, 7, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Sprite
        const sprite = pixelEngine.getNPCSprite(npc.type || 'senior');
        ctx.drawImage(sprite, 0, 0, 16, 20, npc.x, npc.y, 16, 20);

        // Name Badge
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 3;
        ctx.fillText(npc.name, npc.x + 8, npc.y - 4);
        ctx.shadowBlur = 0;
      }
    }

    // 7. Draw Remote Students inside this building
    const fakeCamera = { x: -offsetX, y: -offsetY };
    if (remotePlayers && remotePlayers.length > 0) {
      for (const rp of remotePlayers) {
        if (rp.interiorId === interior.id) {
          rp.draw(ctx, fakeCamera);
        }
      }
    }

    // 8. Draw Player
    player.draw(ctx, fakeCamera);

    // 9. Dynamic Time-of-Day Indoor Lighting Tint
    if (timeSystem) {
      const mode = timeSystem.ambientMode;
      if (mode === 'evening') {
        // Warm golden indoor lamp glow
        ctx.fillStyle = 'rgba(245, 158, 11, 0.12)';
        ctx.fillRect(0, 0, interior.width, interior.height);
      } else if (mode === 'night') {
        // Cozy night lighting with dimmed room tone
        ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
        ctx.fillRect(0, 0, interior.width, interior.height);
      }
    }

    ctx.restore();
  }

  checkInteriorCollision(interior, bounds) {
    const wallTrim = 20;
    const wallHeight = 36;

    // Outer Boundary Collisions
    if (bounds.x < wallTrim || bounds.x + bounds.width > interior.width - wallTrim) return true;
    if (bounds.y < wallHeight) return true;

    // Bottom Wall with Doorway
    const doorW = 80;
    const doorX = (interior.width - doorW) / 2;
    if (bounds.y + bounds.height > interior.height - 20) {
      // Exit Doorway Passable Range
      if (bounds.x >= doorX - 4 && bounds.x + bounds.width <= doorX + doorW + 4) {
        return false;
      }
      return true;
    }

    // Furniture Collisions
    for (const obj of interior.objects) {
      // Walkable non-blocking items
      if (obj.type === 'plant' || obj.type === 'window' || obj.type === 'screen') continue;

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
    // 1. Check NPCs (55px radius)
    if (interior.npcs) {
      for (const npc of interior.npcs) {
        const dx = playerX - (npc.x + 8);
        const dy = playerY - (npc.y + 10);
        if (Math.hypot(dx, dy) <= 55) {
          return { type: 'interior_npc', data: npc };
        }
      }
    }

    // 2. Check Objects (Dynamic interaction proximity)
    for (const obj of interior.objects) {
      const cx = obj.x + obj.w / 2;
      const cy = obj.y + obj.h / 2;
      const dist = Math.hypot(playerX - cx, playerY - cy);
      const reachRadius = Math.max(obj.w, obj.h) / 2 + 35;

      if (dist <= reachRadius) {
        if (obj.isBed) return { type: 'bed', data: obj };
        if (obj.isQuizTrigger) return { type: 'quiz', quizKey: obj.quizKey, data: obj };
        if (obj.type === 'notice_board') return { type: 'notice_board', data: obj };
        if (obj.isBook) return { type: 'book', data: obj };
        if (obj.type === 'menu') return { type: 'menu', data: obj };
        if (obj.isWhiteboard || obj.isExamine) return { type: 'examine', data: obj };
        return { type: 'interior_object', data: obj };
      }
    }

    // 3. Check Exit Doorway Threshold
    const doorW = 80;
    const doorX = (interior.width - doorW) / 2;
    if (playerY > interior.height - 45 && playerX >= doorX - 15 && playerX <= doorX + doorW + 15) {
      return {
        type: 'exit_door',
        exitX: interior.exitX,
        exitY: interior.exitY,
        section: interior.section || 'main'
      };
    }

    return null;
  }
}
