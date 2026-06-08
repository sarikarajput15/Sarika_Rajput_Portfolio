export type Project = {
  title: string;
  category: string;
  tools: string;
  link?: string;
  image: string;
};

export const projects: Project[] = [
  {
    title: "Smart Expense Tracker",
    category: "Full-Stack · AI",
    tools: "Next.js, Node.js, MongoDB Atlas, JWT, Tailwind, Groq AI",
    image: "/images/placeholder.webp",
  },
  {
    title: "Smart Aquaculture System",
    category: "IoT · ML · GIS",
    tools: "ESP32, MQTT, Firebase, Random Forest, Flutter, React",
    link: "https://aqua-web-five.vercel.app",
    image: "/images/placeholder.webp",
  },
  {
    title: "Axis Bank Premium Calculator",
    category: "Test Automation",
    tools: "Playwright, Java, Maven, POM",
    image: "/images/placeholder.webp",
  },
  {
    title: "E-Cell PCCE Platform",
    category: "Freelance · Full-Stack",
    tools: "React, Next.js, Firebase",
    link: "https://ecell-pcce.vercel.app/",
    image: "/images/placeholder.webp",
  },
  {
    title: "FPGA Image Processing",
    category: "VLSI · Hardware",
    tools: "Verilog, VHDL, FPGA, ModelSim",
    image: "/images/placeholder.webp",
  },
  {
    title: "Siemens ENMS Dashboard",
    category: "IIoT · Edge Analytics",
    tools: "Node-RED, MQTT, Grafana, ISO 50001",
    image: "/images/placeholder.webp",
  },
];
