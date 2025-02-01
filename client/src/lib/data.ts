import { useQuery } from "@tanstack/react-query";

// Mock data based on the CSV structure
const rawData = [
  // ... CSV data would be imported here
];

export async function getMetrics() {
  // In a real app, this would be an API call
  return {
    totalReviews: 470,
    uniqueCategories: 25,
    uniqueWorkAreas: 35,
    totalTrainingCourses: 150
  };
}

export async function getCategoryAnalysis() {
  return {
    distribution: [
      { 
        name: "Code Review", 
        value: 120, 
        trend: 15,
        description: "Code quality and structure reviews"
      },
      { 
        name: "Problem Solving", 
        value: 85, 
        trend: 8,
        description: "Technical problem resolution"
      },
      { 
        name: "Data Processing", 
        value: 65, 
        trend: -5,
        description: "Data handling and transformation"
      },
      { 
        name: "API Integration", 
        value: 55, 
        trend: 10,
        description: "External service integration"
      }
    ],
    insights: [
      "Code reviews make up 25% of all analysis",
      "Problem solving shows increasing trend",
      "Data processing needs more attention"
    ],
    topCategories: [
      { name: "Code Review", count: 120 },
      { name: "Problem Solving", count: 85 },
      { name: "Data Processing", count: 65 }
    ]
  };
}

export async function getIntentAnalysis() {
  return {
    distribution: [
      { name: "Code Improvement", percentage: 35 },
      { name: "Bug Fixing", percentage: 25 },
      { name: "Feature Implementation", percentage: 20 },
      { name: "Performance Optimization", percentage: 15 },
      { name: "Documentation", percentage: 5 }
    ],
    patterns: [
      {
        name: "Code Quality",
        frequency: "High",
        description: "Focus on improving code structure and readability"
      },
      {
        name: "Bug Resolution",
        frequency: "Medium",
        description: "Identifying and fixing software defects"
      }
    ],
    trends: [
      { name: "Code Quality", change: 15, currentCount: 150 },
      { name: "Performance", change: -5, currentCount: 75 }
    ]
  };
}

export async function getWorkAreaAnalysis() {
  return {
    distribution: [
      {
        name: "Frontend Development",
        percentage: 40,
        relatedCategories: ["React", "TypeScript", "UI/UX"]
      },
      {
        name: "Backend Development",
        percentage: 35,
        relatedCategories: ["Node.js", "APIs", "Database"]
      }
    ],
    skillsAnalysis: [
      {
        name: "React",
        level: "Advanced",
        proficiency: 85,
        description: "Component architecture and state management"
      },
      {
        name: "Node.js",
        level: "Intermediate",
        proficiency: 65,
        description: "Server-side development and API integration"
      }
    ],
    crossFunctional: [
      {
        name: "Full Stack",
        connections: 5,
        connectedAreas: ["Frontend", "Backend", "DevOps"]
      }
    ]
  };
}

export async function getUserQueriesAnalysis() {
  return {
    distribution: [
      { category: "Code Structure", value: 80 },
      { category: "Performance", value: 65 },
      { category: "Security", value: 45 },
      { category: "Testing", value: 55 },
      { category: "Documentation", value: 35 }
    ],
    categories: [
      {
        name: "Code Structure",
        count: 80,
        description: "Questions about code organization and patterns"
      },
      {
        name: "Performance",
        count: 65,
        description: "Optimization and efficiency queries"
      }
    ],
    insights: [
      {
        title: "Common Patterns",
        description: "Code structure is the most frequent query category"
      },
      {
        title: "Emerging Trends",
        description: "Increasing focus on performance optimization"
      }
    ]
  };
}

export async function getTrainingRecommendations() {
  return {
    recommendations: [
      {
        course: "Advanced React Patterns",
        priority: "High",
        category: "Frontend",
        description: "Master advanced React concepts and patterns",
        impactScore: 85
      },
      {
        course: "API Design Best Practices",
        priority: "Medium",
        category: "Backend",
        description: "Learn RESTful API design principles",
        impactScore: 75
      }
    ],
    skillGaps: [
      {
        skill: "React",
        level: "Advanced",
        currentProficiency: 65,
        requiredProficiency: 85
      },
      {
        skill: "API Design",
        level: "Intermediate",
        currentProficiency: 55,
        requiredProficiency: 75
      }
    ],
    learningPaths: [
      {
        name: "Frontend Master",
        duration: "3 months",
        description: "Comprehensive frontend development path",
        skills: ["React", "TypeScript", "Testing"]
      },
      {
        name: "Backend Expert",
        duration: "4 months",
        description: "Advanced backend development curriculum",
        skills: ["Node.js", "Database", "Security"]
      }
    ]
  };
}