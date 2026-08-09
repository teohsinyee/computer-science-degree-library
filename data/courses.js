export const CATEGORIES = [
  "Programming and Algorithms",
  "Software Engineering",
  "Data and Databases",
  "AI and Intelligent Computing",
  "Systems, Networks and Security",
  "Mathematics and Theory",
  "Business and Management",
  "Language and General"
];

export const REQUIRED_COURSE_IDS = [
  "CPT113", "CPT212", "CPT316",
  "CAT201", "CAT304", "CPT341", "CSE241", "CSE441",
  "CMT221", "CMT321", "CMT427", "CPC351", "CPC451",
  "CPC151", "CPC251", "CPC353", "CPC453",
  "CST232", "CST235",
  "CPT115", "CPT411",
  "ACCOUNTING", "AKP201", "AKP202", "AKP302", "AKW103", "CAT402",
  "HFF225", "LHP456", "LSP404", "WCC110", "WSU101", "WUS101"
];

const course = (id, title, category, summary, topics, chapterTitles, references = []) => ({
  id,
  title,
  category,
  summary,
  topics,
  chapters: chapterTitles.map((title, index) => ({ id: String(index + 1).padStart(2, "0"), title })),
  references,
  materialsUrl: null
});

export const COURSES = Object.freeze([
  course("CPT113", "Programming Methodology and Data Structures", "Programming and Algorithms", "Builds foundational programming and data-structure problem-solving skills.", ["Recursion", "Trees", "Data Structures"], ["Recursive Problem Solving", "Binary Trees"]),
  course("CPT212", "Design and Analysis of Algorithms", "Programming and Algorithms", "Develops techniques for designing efficient algorithms and reasoning about complexity.", ["Algorithm Design", "Complexity", "Data Structures"], ["Algorithm Analysis", "Design Strategies", "Graph Algorithms"], [
    { id: "R01", authors: ["Michael T. Goodrich", "Roberto Tamassia"], title: "Algorithm Design and Applications", edition: "1st ed.", year: 2015, bookUrl: "https://www.wiley.com/en-us/Algorithm+Design+and+Applications%2C+1st+Edition-p-9781118335918" },
    { id: "R02", authors: ["Michael T. Goodrich", "Roberto Tamassia"], title: "Data Structures and Algorithms in Java", edition: "4th ed.", year: 2006, bookUrl: "https://bcs.wiley.com/he-bcs/Books?action=index&bcsId=2788&itemId=0471738840" },
    { id: "R03", authors: ["Thomas H. Cormen", "Charles E. Leiserson", "Ronald L. Rivest", "Clifford Stein"], title: "Introduction to Algorithms", edition: "2nd ed.", year: 2001, bookUrl: "https://www.amazon.com/dp/0262032937" },
    { id: "R04", authors: ["Robert Sedgewick", "Kevin Wayne"], title: "Algorithms", edition: "4th ed.", year: 2011, bookUrl: "https://sedgewick.io/books/algorithms/" },
    { id: "R05", authors: ["Sanjeev Arora", "Boaz Barak"], title: "Computational Complexity: A Modern Approach", year: 2009, bookUrl: "https://www.amazon.com/dp/0521424267" },
    { id: "R06", authors: ["Michael T. Goodrich", "Roberto Tamassia", "Michael H. Goldwasser"], title: "Data Structures and Algorithms in Java", edition: "6th ed.", year: 2014, bookUrl: "https://www.wiley.com/en-us/Data+Structures+and+Algorithms+in+Java%2C+6th+Edition-p-9781118771334" }
  ]),
  course("CPT316", "Programming Language Implementation and Paradigms", "Programming and Algorithms", "Explores programming-language concepts, implementation, and parallel programming.", ["Language Design", "Compilers", "Parallel Programming"], ["Programming Language Concepts", "Syntax and Semantics", "Parallel Programming"], [
    { id: "R01", authors: ["Robert W. Sebesta"], title: "Concepts of Programming Languages", edition: "12th ed.", year: 2018, bookUrl: "https://www.pearson.com/en-us/subject-catalog/p/concepts-of-programming-languages/P200000003361/9780135102268" },
    { id: "R02", authors: ["Torben Ægidius Mogensen"], title: "Introduction to Compiler Design", edition: "2nd ed.", year: 2017, bookUrl: "https://link.springer.com/book/10.1007/978-3-319-66966-3" },
    { id: "R03", authors: ["Peter S. Pacheco", "Matthew Malensek"], title: "An Introduction to Parallel Programming", edition: "2nd ed.", year: 2022, bookUrl: "https://www.sciencedirect.com/book/9780128046050/an-introduction-to-parallel-programming" }
  ]),

  course("CAT201", "Integrated Software Development Workshop", "Software Engineering", "Applies collaborative software-development practices in an integrated workshop.", ["Team Development", "Delivery", "Collaboration"], ["Project Planning", "Incremental Delivery", "Project Review"]),
  course("CAT304", "Group Innovation Project and Study for Sustainability", "Software Engineering", "Uses group project work to explore innovation and sustainability.", ["Innovation", "Sustainability", "Project Work"], ["Problem Framing", "Solution Development", "Sustainability Review"]),
  course("CPT341", "Software Architecture and Design", "Software Engineering", "Introduces architectural thinking, design notations, and software evolution.", ["Software Architecture", "Design Notations", "Usability"], ["Architecture Fundamentals", "Design Notations", "Architecture Evolution"]),
  course("CSE241", "Foundations of Software Engineering", "Software Engineering", "Introduces core software-engineering practices from process through evolution.", ["Software Processes", "Requirements", "Architecture"], ["Software Processes", "Requirements Engineering", "Software Evolution"], [
    { id: "R12", authors: ["Ian Sommerville"], title: "Software Engineering", edition: "10th ed.", year: 2016, bookUrl: "https://www.pearson.com/en-gb/subject-catalog/p/software-engineering-global-edition/P200000005464" },
    { id: "R13", authors: ["Capers Jones"], title: "Software Engineering Best Practices", edition: "1st ed.", year: 2010, bookUrl: "https://www.mheducation.com/highered/mhp/product/software-engineering-best-practices.html" },
    { id: "R14", authors: ["John W. Satzinger", "Robert B. Jackson", "Stephen D. Burd"], title: "Systems Analysis and Design in a Changing World", edition: "6th ed.", year: 2011, bookUrl: "https://www.campusbooks.com/books/9781133713371-systems-analysis-and-design-in-a-changing-world" },
    { id: "R17", authors: ["Thomas M. Pigoski"], title: "Practical Software Maintenance: Best Practices for Managing Your Software Investment", year: 1997, bookUrl: "https://www.amazon.com/dp/0471170011" }
  ]),
  course("CSE441", "Software Process and Quality Assurance", "Software Engineering", "Examines software processes and practices for assuring product quality.", ["Process Improvement", "Quality Assurance", "Testing"], ["Software Processes", "Quality Planning", "Quality Assurance"]),

  course("CMT221", "Database Organisation and Design", "Data and Databases", "Covers database modelling, design, SQL, and administration.", ["Data Modelling", "SQL", "Database Security"], ["Database Systems", "Relational Design", "Database Administration"]),
  course("CMT321", "Management and Engineering of Databases", "Data and Databases", "Examines database engineering and management in organisational settings.", ["Database Engineering", "Administration", "Data Management"], ["Database Planning", "Database Operations", "Database Governance"]),
  course("CMT427", "Information Storage and Retrieval", "Data and Databases", "Introduces the organisation, indexing, search, and evaluation of information systems.", ["Indexing", "Search", "Information Retrieval"], ["Information Retrieval Foundations", "Indexing and Querying", "Search Evaluation"], [
    { id: "R01", authors: ["W. Bruce Croft", "Donald Metzler", "Trevor Strohman"], title: "Search Engines: Information Retrieval in Practice", year: 2015, bookUrl: "https://books.google.com/books?id=ba4rAAAAQBAJ" },
    { id: "R03", authors: ["Christopher D. Manning", "Prabhakar Raghavan", "Hinrich Schütze"], title: "Introduction to Information Retrieval", year: 2008, bookUrl: "https://www.cambridge.org/highereducation/books/introduction-to-information-retrieval/669D108D20F556C5C30957D63B5AB65C" }
  ]),
  course("CPC351", "Principles of Data Analytics", "Data and Databases", "Builds foundations for analytical methods, modelling, and evaluation.", ["Data Analytics", "Statistics", "Model Evaluation"], ["Analytics Foundations", "Statistical Evaluation", "Analytical Methods"]),
  course("CPC451", "Big Data Technologies and Management", "Data and Databases", "Surveys scalable data technologies, NoSQL systems, and continuity planning.", ["NoSQL", "Distributed Data", "Big Data"], ["NoSQL Data Models", "Distributed Storage", "Business Continuity"]),

  course("CPC151", "Fundamentals of Logic and Artificial Intelligence", "AI and Intelligent Computing", "Introduces logic, intelligent agents, search, and machine learning.", ["Logic", "Intelligent Agents", "Search"], ["Logical Reasoning", "Intelligent Agents", "Search Strategies"]),
  course("CPC251", "Machine Learning and Computational Intelligence", "AI and Intelligent Computing", "Introduces supervised and unsupervised learning with computational-intelligence methods.", ["Machine Learning", "Neural Networks", "Fuzzy Systems"], ["Machine Learning Foundations", "Supervised Learning", "Unsupervised Learning"], [
    { id: "R04", authors: ["James M. Keller", "Derong Liu", "David B. Fogel"], title: "Fundamentals of Computational Intelligence: Neural Networks, Fuzzy Systems, and Evolutionary Computation", edition: "1st ed.", year: 2016, bookUrl: "https://www.wiley-vch.de/en/areas-interest/engineering/fundamentals-of-computational-intelligence-978-1-119-21434-2" },
    { id: "R06", authors: ["Peter Harrington"], title: "Machine Learning in Action", year: 2012, bookUrl: "https://www.manning.com/books/machine-learning-in-action" }
  ]),
  course("CPC353", "Natural Language Processing", "AI and Intelligent Computing", "Explores computational methods for processing and retrieving human language.", ["Corpora", "Language Models", "Information Retrieval"], ["Language Processing Overview", "Words and Morphology", "Information Retrieval"]),
  course("CPC453", "Computer Vision and Robotics", "AI and Intelligent Computing", "Introduces image processing, computer vision, and robotics fundamentals.", ["Image Processing", "Computer Vision", "Robotics"], ["Computer Vision Foundations", "Digital Image Fundamentals", "Image Segmentation"], [{ id: "R17", authors: ["Rafael C. Gonzalez", "Richard E. Woods"], title: "Digital Image Processing", edition: "4th ed.", year: 2018, bookUrl: "https://www.pearson.com/en-us/subject-catalog/p/digital-image-processing/P200000003224?view=educator" }]),

  course("CST232", "Operating Systems", "Systems, Networks and Security", "Introduces operating-system responsibilities for processes, memory, devices, and files.", ["Processes", "Memory", "File Systems"], ["Process Management", "Memory Management", "File Management"]),
  course("CST235", "Principles of Computer Networks and Information Security", "Systems, Networks and Security", "Covers network-security concepts, controls, and digital forensics.", ["Information Security", "Risk Management", "Digital Forensics"], ["Security Foundations", "Security Technology", "Digital Forensics"]),

  course("CPT115", "Mathematical Methods for Computer Science", "Mathematics and Theory", "Applies mathematical methods, including statistics, to computing problems.", ["Mathematics", "Statistics", "Problem Solving"], ["Mathematical Foundations", "Discrete Methods", "Statistics"]),
  course("CPT411", "Automata Theory and Formal Languages", "Mathematics and Theory", "Studies formal languages, automata, and models of computation.", ["Formal Languages", "Automata", "Turing Machines"], ["Why Automata", "Theory of Computation", "Turing Machines"]),

  course("ACCOUNTING", "Accounting", "Business and Management", "Introduces accounting concepts used to interpret and communicate financial information.", ["Financial Information", "Accounting Records", "Reporting"], ["Accounting Foundations", "Recording Transactions", "Financial Reporting"]),
  course("AKP201", "Marketing", "Business and Management", "Explores customer value, promotion, distribution, and marketing planning.", ["Customer Value", "Promotion", "Marketing Strategy"], ["Marketing Foundations", "Distribution Strategy", "Marketing Planning"]),
  course("AKP202", "Organizational Behavior", "Business and Management", "Examines behaviour, relationships, and effectiveness in organisations.", ["Individuals", "Teams", "Organisations"], ["Individual Behaviour", "Group Dynamics", "Organisational Change"]),
  course("AKP302", "Operations Management", "Business and Management", "Introduces the management of processes that create and deliver products and services.", ["Operations", "Process Design", "Quality"], ["Operations Strategy", "Process Management", "Operations Improvement"], [{ id: "R01", authors: ["William J. Stevenson"], title: "Operations Management", edition: "14th ed.", year: 2021, bookUrl: "https://www.amazon.com/dp/126023889X" }]),
  course("AKW103", "Introduction to Management", "Business and Management", "Introduces planning, organising, leading, and controlling in organisations.", ["Planning", "Leadership", "Management Control"], ["Managing in a Global World", "Planning and Decision Making", "Leadership"]),
  course("CAT402", "Professional and Technopreneurship Development", "Business and Management", "Develops professional practice and entrepreneurial awareness for technology careers.", ["Professional Development", "Entrepreneurship", "Career Planning"], ["Professional Identity", "Technopreneurship", "Career Development"]),

  course("HFF225", "Philosophy and Current Issues", "Language and General", "Uses philosophical inquiry to examine contemporary issues.", ["Philosophy", "Ethics", "Current Issues"], ["Philosophical Inquiry", "Ethical Reasoning", "Contemporary Issues"]),
  course("LHP456", "Spoken English", "Language and General", "Develops spoken communication for interviews, pitches, and employability.", ["Speaking", "Persuasive Communication", "Employability"], ["Interview Preparation", "Persuasive Speaking", "Professional Pitching"]),
  course("LSP404", "Spoken English", "Language and General", "Develops spoken English through structured oral communication and response writing.", ["Oral Communication", "Response Writing", "Presentation"], ["Oral Communication Planning", "Response Writing", "Individual Oral Presentation"]),
  course("WCC110", "Handicraft", "Language and General", "Introduces practical craft work and creative making.", ["Craft Practice", "Making", "Creative Work"], ["Craft Foundations", "Materials and Techniques", "Creative Production"]),
  course("WSU101", "Sustainability Issues, Challenges and Prospects", "Language and General", "Explores sustainable development, energy, water, and ecosystems.", ["Sustainable Development", "Energy", "Water Sustainability"], ["Sustainability Foundations", "Sustainable Development Goals", "Water Sustainability"]),
  course("WUS101", "General Studies", "Language and General", "Provides a broad foundation for interdisciplinary study and academic development.", ["Interdisciplinary Study", "Academic Skills", "General Knowledge"], ["Foundations of General Studies", "Interdisciplinary Perspectives", "Academic Development"])
]);
