// Jain University School of Engineering - Departments and Sections

export const JAIN_ENGINEERING_DEPARTMENTS = [
  {
    id: "cse",
    name: "Computer Science & Engineering",
    code: "CSE",
    sections: ["A", "B", "C", "D"],
    years: [1, 2, 3, 4],
    specializations: [
      "Artificial Intelligence & Machine Learning",
      "Data Science",
      "Cybersecurity",
      "Software Engineering",
      "Web Development",
      "Mobile App Development"
    ]
  },
  {
    id: "ece",
    name: "Electronics & Communication Engineering",
    code: "ECE",
    sections: ["A", "B", "C"],
    years: [1, 2, 3, 4],
    specializations: [
      "VLSI Design",
      "Embedded Systems",
      "Signal Processing",
      "Communication Systems",
      "IoT & Wireless Communication"
    ]
  },
  {
    id: "eee",
    name: "Electrical & Electronics Engineering",
    code: "EEE",
    sections: ["A", "B"],
    years: [1, 2, 3, 4],
    specializations: [
      "Power Systems",
      "Control Systems",
      "Renewable Energy",
      "Industrial Automation"
    ]
  },
  {
    id: "mech",
    name: "Mechanical Engineering",
    code: "MECH",
    sections: ["A", "B", "C"],
    years: [1, 2, 3, 4],
    specializations: [
      "Automotive Engineering",
      "Robotics & Automation",
      "Thermal Engineering",
      "Manufacturing Technology",
      "Design Engineering"
    ]
  },
  {
    id: "civil",
    name: "Civil Engineering",
    code: "CIVIL",
    sections: ["A", "B"],
    years: [1, 2, 3, 4],
    specializations: [
      "Structural Engineering",
      "Environmental Engineering",
      "Transportation Engineering",
      "Geotechnical Engineering",
      "Construction Management"
    ]
  },
  {
    id: "it",
    name: "Information Technology",
    code: "IT",
    sections: ["A", "B", "C"],
    years: [1, 2, 3, 4],
    specializations: [
      "Cloud Computing",
      "Network Security",
      "Database Management",
      "System Administration",
      "DevOps"
    ]
  },
  {
    id: "aiml",
    name: "Artificial Intelligence & Machine Learning",
    code: "AIML",
    sections: ["A", "B"],
    years: [1, 2, 3, 4],
    specializations: [
      "Deep Learning",
      "Natural Language Processing",
      "Computer Vision",
      "Robotics AI",
      "Data Analytics"
    ]
  },
  {
    id: "ds",
    name: "Data Science",
    code: "DS",
    sections: ["A"],
    years: [1, 2, 3, 4],
    specializations: [
      "Big Data Analytics",
      "Business Intelligence",
      "Statistical Modeling",
      "Data Visualization",
      "Predictive Analytics"
    ]
  }
];

export const ACADEMIC_YEARS = [
  { value: 1, label: "1st Year" },
  { value: 2, label: "2nd Year" },
  { value: 3, label: "3rd Year" },
  { value: 4, label: "4th Year" }
];

export const SEMESTERS = [
  { value: 1, label: "1st Semester" },
  { value: 2, label: "2nd Semester" },
  { value: 3, label: "3rd Semester" },
  { value: 4, label: "4th Semester" },
  { value: 5, label: "5th Semester" },
  { value: 6, label: "6th Semester" },
  { value: 7, label: "7th Semester" },
  { value: 8, label: "8th Semester" }
];

export const USER_ROLES = [
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher/Faculty" },
  { value: "admin", label: "Administrator" }
];

// Sample courses for each department
export const DEPARTMENT_COURSES = {
  cse: [
    "Programming Fundamentals",
    "Data Structures & Algorithms",
    "Database Management Systems",
    "Computer Networks",
    "Software Engineering",
    "Machine Learning",
    "Web Development",
    "Mobile App Development",
    "Cybersecurity",
    "Cloud Computing"
  ],
  ece: [
    "Circuit Analysis",
    "Digital Electronics",
    "Microprocessors",
    "Signal Processing",
    "Communication Systems",
    "VLSI Design",
    "Embedded Systems",
    "Antenna Theory",
    "Control Systems",
    "IoT Systems"
  ],
  eee: [
    "Electrical Circuits",
    "Power Systems",
    "Control Systems",
    "Electrical Machines",
    "Power Electronics",
    "Renewable Energy",
    "Industrial Automation",
    "Smart Grid Technology",
    "Electric Drives",
    "Power Quality"
  ],
  mech: [
    "Engineering Mechanics",
    "Thermodynamics",
    "Fluid Mechanics",
    "Machine Design",
    "Manufacturing Processes",
    "CAD/CAM",
    "Robotics",
    "Automotive Engineering",
    "Heat Transfer",
    "Materials Science"
  ],
  civil: [
    "Engineering Mechanics",
    "Structural Analysis",
    "Concrete Technology",
    "Geotechnical Engineering",
    "Transportation Engineering",
    "Environmental Engineering",
    "Construction Management",
    "Surveying",
    "Hydraulics",
    "Building Planning"
  ],
  it: [
    "Programming Concepts",
    "Database Systems",
    "Computer Networks",
    "Web Technologies",
    "System Administration",
    "Network Security",
    "Cloud Computing",
    "DevOps",
    "Information Systems",
    "IT Project Management"
  ],
  aiml: [
    "Machine Learning Fundamentals",
    "Deep Learning",
    "Natural Language Processing",
    "Computer Vision",
    "Neural Networks",
    "Reinforcement Learning",
    "Data Mining",
    "Pattern Recognition",
    "AI Ethics",
    "Robotics AI"
  ],
  ds: [
    "Statistics for Data Science",
    "Data Visualization",
    "Big Data Analytics",
    "Business Intelligence",
    "Predictive Modeling",
    "Data Mining",
    "Statistical Learning",
    "Data Warehousing",
    "Time Series Analysis",
    "Research Methodology"
  ]
};
