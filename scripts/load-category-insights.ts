import { db } from "../db";
import { categoryInsights } from "../db/schema";

const insights = [
  {
    "standardized_category": "API Integration",
    "insight": "Users need help with API integration tasks including data retrieval, logging, middleware implementation, and documentation. Focus areas include FastAPI development, voice message delivery, and AI integration in LMS systems."
  },
  {
    "standardized_category": "Code Development",
    "insight": "Users seek guidance on Angular and C# development, focusing on data binding, API integration, unit testing, and code optimization. Key areas include asynchronous operations and database interactions."
  },
  {
    "standardized_category": "Data Processing",
    "insight": "Users require assistance with filtering datasets, data export, transcript analysis, and NLP-based classification. Focus on improving data accessibility and generating actionable insights."
  },
  {
    "standardized_category": "Database Management",
    "insight": "Users seek guidance on SQL and MongoDB operations, including querying, optimization, connection configuration, and data validation. Emphasis on both theoretical knowledge and practical implementation."
  },
  {
    "standardized_category": "DevOps & Automation",
    "insight": "Users focus on process automation, environment configuration, and workflow management. Key areas include CI/CD pipelines, Docker/Kubernetes management, and documentation of operational processes."
  },
  {
    "standardized_category": "Error Handling",
    "insight": "Users need help with debugging across various technologies, including JSON/YAML parsing, dependency injection issues, and application performance problems. Focus on implementing error handling strategies."
  },
  {
    "standardized_category": "Performance Optimization",
    "insight": "Users seek to enhance efficiency in software development, procurement, and trading. Focus on workflow optimization, code refinement, and KPI establishment."
  },
  {
    "standardized_category": "Security & Authentication",
    "insight": "Users focus on managing access permissions, implementing secure authentication methods, and maintaining proper access control. Includes role assignment and account management."
  },
  {
    "standardized_category": "Technical Support",
    "insight": "Users seek help with translation tasks, system diagnostics, and technical concept clarification. Includes troubleshooting system errors and generating structured documentation."
  },
  {
    "standardized_category": "Testing & QA",
    "insight": "Users focus on improving code quality through testing practices, including unit testing, debugging, and code reviews. Emphasis on automation and validation across multiple programming languages."
  }
];

async function loadInsights() {
  try {
    for (const insight of insights) {
      await db.insert(categoryInsights).values({
        standardizedCategory: insight.standardized_category,
        insight: insight.insight
      });
    }
    console.log('Successfully loaded category insights');
  } catch (error) {
    console.error('Error loading category insights:', error);
  }
}

loadInsights();
