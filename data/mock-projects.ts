import type { Project } from "@/components/project-showcase"

// Mock projects data
export const mockProjects: Record<string, Project[]> = {
  rahulsingh: [
    {
      id: "1",
      title: "AI-Powered Code Assistant",
      description:
        "A machine learning model that helps developers write better code by suggesting improvements and detecting potential bugs in real-time.",
      thumbnail: "/placeholder.svg?height=300&width=500",
      demoUrl: "https://example.com/demo",
      githubUrl: "https://github.com/example/code-assistant",
      technologies: ["Python", "TensorFlow", "React", "Node.js"],
      featured: true,
    },
    {
      id: "2",
      title: "Distributed Learning Platform",
      description:
        "An educational platform that connects students with teachers around the world, featuring real-time collaboration tools and AI-driven personalized learning paths.",
      thumbnail: "/placeholder.svg?height=300&width=500",
      demoUrl: "https://example.com/learning-platform",
      githubUrl: "https://github.com/example/learning-platform",
      technologies: ["Next.js", "MongoDB", "WebRTC", "Docker"],
      featured: true,
    },
    {
      id: "3",
      title: "Blockchain Voting System",
      description:
        "A secure and transparent voting system built on blockchain technology, ensuring tamper-proof elections and real-time result verification.",
      thumbnail: "/placeholder.svg?height=300&width=500",
      githubUrl: "https://github.com/example/blockchain-voting",
      technologies: ["Solidity", "Ethereum", "React", "Web3.js"],
      featured: false,
    },
    {
      id: "4",
      title: "Smart Home Automation",
      description:
        "An IoT system that integrates various smart home devices and provides a unified control interface with voice commands and automated routines.",
      thumbnail: "/placeholder.svg?height=300&width=500",
      demoUrl: "https://example.com/smart-home",
      technologies: ["IoT", "Raspberry Pi", "MQTT", "React Native"],
      featured: false,
    },
  ],
  ananyapatel: [
    {
      id: "1",
      title: "Data Visualization Dashboard",
      description:
        "An interactive dashboard for visualizing complex datasets with customizable charts, filters, and real-time updates.",
      thumbnail: "/placeholder.svg?height=300&width=500",
      demoUrl: "https://example.com/data-viz",
      githubUrl: "https://github.com/example/data-viz",
      technologies: ["D3.js", "React", "Python", "Flask"],
      featured: true,
    },
    {
      id: "2",
      title: "Predictive Analytics Tool",
      description:
        "A machine learning application that analyzes historical data to predict future trends and outcomes for business decision-making.",
      thumbnail: "/placeholder.svg?height=300&width=500",
      githubUrl: "https://github.com/example/predictive-analytics",
      technologies: ["Python", "Scikit-learn", "Pandas", "Plotly"],
      featured: true,
    },
    {
      id: "3",
      title: "Natural Language Processing API",
      description:
        "An API service that processes and analyzes text data for sentiment analysis, entity recognition, and language translation.",
      thumbnail: "/placeholder.svg?height=300&width=500",
      demoUrl: "https://example.com/nlp-api",
      githubUrl: "https://github.com/example/nlp-api",
      technologies: ["Python", "NLTK", "FastAPI", "Docker"],
      featured: false,
    },
  ],
  nabinchapagain: [
    {
      id: "1",
      title: "E-commerce Platform",
      description:
        "A full-featured e-commerce solution with product management, shopping cart, payment processing, and order tracking.",
      thumbnail: "/placeholder.svg?height=300&width=500",
      demoUrl: "https://example.com/ecommerce",
      githubUrl: "https://github.com/example/ecommerce",
      technologies: ["Next.js", "Stripe", "MongoDB", "Tailwind CSS"],
      featured: true,
    },
    {
      id: "2",
      title: "Real-time Collaboration Tool",
      description:
        "A web application that enables multiple users to collaborate on documents, code, and designs in real-time.",
      thumbnail: "/placeholder.svg?height=300&width=500",
      demoUrl: "https://example.com/collab-tool",
      githubUrl: "https://github.com/example/collab-tool",
      technologies: ["WebSockets", "React", "Node.js", "Redis"],
      featured: true,
    },
    {
      id: "3",
      title: "Progressive Web App Template",
      description:
        "A starter template for building fast, responsive, and offline-capable progressive web applications.",
      thumbnail: "/placeholder.svg?height=300&width=500",
      githubUrl: "https://github.com/example/pwa-template",
      technologies: ["PWA", "Service Workers", "IndexedDB", "Workbox"],
      featured: false,
    },
  ],
  drpriyasharma: [
    {
      id: "1",
      title: "Algorithm Visualization Tool",
      description:
        "An educational tool that visualizes various algorithms to help students understand their operation and complexity.",
      thumbnail: "/placeholder.svg?height=300&width=500",
      demoUrl: "https://example.com/algo-viz",
      githubUrl: "https://github.com/example/algo-viz",
      technologies: ["JavaScript", "Canvas API", "React", "Algorithm Design"],
      featured: true,
    },
    {
      id: "2",
      title: "Research Paper Analyzer",
      description:
        "A tool that uses NLP to analyze research papers, extract key findings, and generate summaries and citations.",
      thumbnail: "/placeholder.svg?height=300&width=500",
      demoUrl: "https://example.com/paper-analyzer",
      technologies: ["Python", "NLP", "PyTorch", "Flask"],
      featured: true,
    },
    {
      id: "3",
      title: "Distributed Computing Framework",
      description:
        "A framework for distributing computational tasks across multiple nodes for parallel processing and improved performance.",
      thumbnail: "/placeholder.svg?height=300&width=500",
      githubUrl: "https://github.com/example/distributed-computing",
      technologies: ["Java", "Distributed Systems", "Apache Kafka", "Docker"],
      featured: false,
    },
  ],
}
