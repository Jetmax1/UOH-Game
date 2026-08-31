/**
 * AcademicSystem: University Courses, CGPA, Physical Class Attendance & Exams
 */
export const UOH_DEPARTMENTS = [
  {
    id: 'scis',
    name: 'School of Computer & Info Sciences',
    shortName: 'SCIS',
    locationId: 45,
    icon: '💻',
    buildingName: 'SCIS Building (#45)',
    courses: [
      { id: 'cs101', name: 'Data Structures & Algorithms', code: 'CS101', credits: 4, prof: 'Dr. Ramesh Rao' },
      { id: 'cs202', name: 'Operating Systems & Networks', code: 'CS202', credits: 4, prof: 'Prof. S. K. Mitra' },
      { id: 'cs303', name: 'Artificial Intelligence & Neural Nets', code: 'CS303', credits: 3, prof: 'Dr. Priya Sharma' }
    ]
  },
  {
    id: 'sls',
    name: 'School of Life Sciences & Biotechnology',
    shortName: 'Life Sciences',
    locationId: 3,
    icon: '🔬',
    buildingName: 'School of Life Sciences (#3)',
    courses: [
      { id: 'bio101', name: 'Genomics & Plant Biochemistry', code: 'BIO101', credits: 4, prof: 'Prof. Manjula Sridharan' },
      { id: 'bio202', name: 'Microbiology & Wetland Ecology', code: 'BIO202', credits: 3, prof: 'Dr. Ramesh Babu' }
    ]
  },
  {
    id: 'sms',
    name: 'School of Management Studies',
    shortName: 'Management',
    locationId: 72,
    icon: '📈',
    buildingName: 'School of Management (#72)',
    courses: [
      { id: 'mgt101', name: 'Corporate Strategy & Innovation', code: 'MGT101', credits: 3, prof: 'Prof. K. V. Sharma' },
      { id: 'mgt202', name: 'Financial Markets & Analytics', code: 'MGT202', credits: 3, prof: 'Dr. Ananya Sen' }
    ]
  },
  {
    id: 'physics_math',
    name: 'School of Physics & Mathematics',
    shortName: 'Physics & Math',
    locationId: 36,
    icon: '⚛️',
    buildingName: 'Science Complex (#36)',
    courses: [
      { id: 'phy101', name: 'Quantum Physics & Relativity', code: 'PHY101', credits: 4, prof: 'Dr. V. Ramanathan' },
      { id: 'mat201', name: 'Linear Algebra & Calculus', code: 'MAT201', credits: 4, prof: 'Prof. G. Swaminathan' }
    ]
  }
];

export class AcademicSystem {
  constructor(initialData = {}) {
    this.departmentId = initialData.departmentId || 'scis';
    this.cgpa = initialData.cgpa !== undefined ? initialData.cgpa : 8.7;
    this.totalClasses = initialData.totalClasses || 24;
    this.attendedClasses = initialData.attendedClasses || 21;

    // Course grades & assignments
    this.courseProgress = initialData.courseProgress || {
      'CS101': { grade: 'A', score: 88, assignmentsDone: 3 },
      'CS202': { grade: 'A+', score: 94, assignmentsDone: 4 },
      'CS303': { grade: 'B+', score: 82, assignmentsDone: 2 }
    };

    // Callbacks
    this.onClassAttended = null;
    this.onCgpaUpdated = null;
  }

  getDepartment() {
    return UOH_DEPARTMENTS.find(d => d.id === this.departmentId) || UOH_DEPARTMENTS[0];
  }

  getAttendancePercentage() {
    if (this.totalClasses === 0) return 100;
    return Math.round((this.attendedClasses / this.totalClasses) * 100);
  }

  attendClass(courseCode = 'CS101', game = null) {
    this.totalClasses += 1;
    this.attendedClasses += 1;

    // Small CGPA boost for consistency
    const boost = 0.05;
    this.cgpa = Math.min(10.0, parseFloat((this.cgpa + boost).toFixed(2)));

    // Update course record
    if (!this.courseProgress[courseCode]) {
      this.courseProgress[courseCode] = { grade: 'A', score: 85, assignmentsDone: 1 };
    } else {
      this.courseProgress[courseCode].score = Math.min(100, this.courseProgress[courseCode].score + 2);
      this.courseProgress[courseCode].assignmentsDone += 1;
    }

    if (this.onClassAttended) {
      this.onClassAttended(courseCode, this.cgpa, this.getAttendancePercentage());
    }

    return {
      courseCode,
      cgpa: this.cgpa,
      attendancePct: this.getAttendancePercentage()
    };
  }

  missClass() {
    this.totalClasses += 1;
    this.cgpa = Math.max(0.0, parseFloat((this.cgpa - 0.08).toFixed(2)));
    return { cgpa: this.cgpa, attendancePct: this.getAttendancePercentage() };
  }

  getAcademicSummary() {
    const dept = this.getDepartment();
    return {
      departmentName: dept.name,
      departmentCode: dept.shortName,
      buildingName: dept.buildingName,
      cgpa: this.cgpa.toFixed(2),
      attendancePct: this.getAttendancePercentage(),
      attendedCount: this.attendedClasses,
      totalCount: this.totalClasses,
      courses: dept.courses.map(c => ({
        ...c,
        progress: this.courseProgress[c.code] || { grade: 'A', score: 85, assignmentsDone: 2 }
      }))
    };
  }

  serialize() {
    return {
      departmentId: this.departmentId,
      cgpa: this.cgpa,
      totalClasses: this.totalClasses,
      attendedClasses: this.attendedClasses,
      courseProgress: this.courseProgress
    };
  }

  deserialize(data) {
    if (!data) return;
    if (data.departmentId) this.departmentId = data.departmentId;
    if (data.cgpa !== undefined) this.cgpa = data.cgpa;
    if (data.totalClasses !== undefined) this.totalClasses = data.totalClasses;
    if (data.attendedClasses !== undefined) this.attendedClasses = data.attendedClasses;
    if (data.courseProgress) this.courseProgress = data.courseProgress;
  }
}
