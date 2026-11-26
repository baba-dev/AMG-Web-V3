// Owner-approved service scope. The examples describe capabilities, not unverified client deployments.
export const developmentServices = [
 {id:"web",name:"Web & app development",accent:"#8ea5ff",lead:"Make every interaction count.",copy:"Responsive websites, e-commerce, web applications and mobile experiences built around the way your customers use them.",deliverables:["Corporate websites","E-commerce storefronts","Web & mobile applications"],project:"gwi"},
 {id:"software",name:"SaaS & business software",accent:"#f2ad67",lead:"Make work flow.",copy:"Connect teams, information and everyday tasks with custom applications, ERP, POS, dashboards and integrations.",deliverables:["Custom SaaS","ERP & POS","Dashboards & integrations"],project:"bababuilds-erp"},
 {id:"cloud",name:"Cloud & DevOps",accent:"#71b9d3",lead:"Build on solid ground.",copy:"Cloud architecture, hosting, deployment automation, security configuration and ongoing operations for digital products.",deliverables:["Cloud hosting","Deployment automation","Infrastructure support"],project:null},
 {id:"email",name:"Professional & dedicated email hosting",accent:"#f59abb",lead:"Own your business identity.",copy:"Professional domain-based business email and dedicated email hosting for organisations that need their own environment. We help you choose the right setup and plan a migration around your team.",deliverables:["Business mailboxes","Dedicated email environments","Migration & configuration"],project:null},
 {id:"ai",name:"AI & business automation",accent:"#b9a2f9",lead:"Make intelligence useful.",copy:"AI-enabled products, creative workflows, business messaging and integrations that reduce repetitive work and connect your existing tools.",deliverables:["Generative AI","Workflow integration","WhatsApp business automation"],project:"aiwa-creators"},
 {id:"iot",name:"IoT & connected hardware",accent:"#c3eb6a",lead:"Connect the physical and digital.",copy:"Purpose-built connected hardware, embedded firmware and web-powered control systems for industrial and commercial environments. Connect sensors, equipment and monitoring systems to useful digital interfaces.",deliverables:["Flow sensors","AI surveillance command centres","Lighting automation","Power monitoring"],project:null},
] as const;
export const iotSolutions=[
 {id:"flow",hook:"See every litre.",name:"Flow intelligence",copy:"Connected flow sensors, live measurements and consumption tracking.",metric:"MEASURE / MONITOR"},
 {id:"vision",hook:"One screen. Every site.",name:"AI surveillance command centres",copy:"Centralised, AI-enabled video monitoring designed for large-scale, multi-site operations. Bring feeds, event detection and operator workflows together in one command centre.",metric:"CONNECT / DETECT / RESPOND"},
 {id:"light",hook:"Light that responds.",name:"Automated lighting",copy:"Sensor-led lighting control, schedules and environmental automation.",metric:"SENSE / CONTROL"},
 {id:"power",hook:"Know where the power goes.",name:"Power tracking",copy:"Connected energy measurements, consumption tracking and web-based reporting.",metric:"TRACK / UNDERSTAND"},
] as const;
export const developmentFaqs=[
 ["Do you build custom software or only websites?","Both. We develop responsive websites, web applications, SaaS products, business systems and connected hardware. Scope depends on your business needs."],
 ["Can you work with our existing systems?","Yes. We assess existing applications, data and infrastructure before recommending integration, migration or replacement. Compatibility is evaluated during discovery."],
 ["Do you provide ongoing hosting and technical support?","We offer cloud and DevOps services, professional and dedicated email hosting, and technical support. The responsibilities and service terms are agreed for each engagement."],
 ["Can you build industrial IoT and surveillance systems?","We develop connected hardware and web-powered monitoring solutions, including flow sensing, lighting automation, power tracking and AI-enabled central surveillance command centres. Deployment requirements and integration feasibility are assessed per site."],
 ["Can you help us choose a cloud provider?","Yes. Our team includes professionals certified across AWS, Google Cloud and Oracle Cloud. We assess workload, budget, security and operating requirements before recommending a platform."],
 ["How do we start a project?","Tell us the problem you need to solve, your existing setup and any constraints. We can then discuss the right scope and next steps."],
] as const;
