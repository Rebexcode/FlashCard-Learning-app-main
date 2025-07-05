// Comprehensive flashcard data for computer science topics
const categoryData = {
  algorithms: {
    name: "Algorithms",
    icon: "⚡",
    description: "Study fundamental algorithms and their complexities",
    difficulty: "medium",
    topics: ["sorting", "searching", "graph-algorithms", "dynamic-programming"]
  },
  "data-structures": {
    name: "Data Structures",
    icon: "🗃️",
    description: "Learn about different ways to organize and store data",
    difficulty: "medium",
    topics: ["arrays", "linked-lists", "trees", "graphs", "hash-tables"]
  },
  programming: {
    name: "Programming",
    icon: "💻",
    description: "Master programming concepts and best practices",
    difficulty: "easy",
    topics: ["oop", "design-patterns", "concurrency", "error-handling"]
  },
  systems: {
    name: "Systems",
    icon: "🖥️",
    description: "Understand computer systems and architecture",
    difficulty: "hard",
    topics: ["operating-systems", "networking", "memory-management", "processes"]
  },
  "web-development": {
    name: "Web Development",
    icon: "🌐",
    description: "Learn modern web development technologies and practices",
    difficulty: "medium",
    topics: ["frontend", "backend", "apis", "responsive-design"]
  },
  "database-systems": {
    name: "Database Systems",
    icon: "🗄️",
    description: "Master database design, implementation, and optimization",
    difficulty: "hard",
    topics: ["sql", "nosql", "normalization", "indexing", "transactions"]
  },
  "security-crypto": {
    name: "Security & Cryptography",
    icon: "🔒",
    description: "Understand security principles and cryptographic techniques",
    difficulty: "hard",
    topics: ["encryption", "authentication", "authorization", "network-security"]
  }
}

// Make data available globally
window.categoryData = categoryData

const flashcardsData = [
    // Algorithms
    {
      id: 1,
      category: "algorithms",
      difficulty: "medium",
      question: "What is the time complexity of binary search?",
      answer:
        "O(log n) - Binary search eliminates half of the remaining elements in each step, making it very efficient for sorted arrays.",
      topics: ["time-complexity", "searching", "divide-conquer"],
    },
    {
      id: 2,
      category: "algorithms",
      difficulty: "easy",
      question: "What is Big O notation?",
      answer:
        "Big O notation describes the upper bound of an algorithm's time or space complexity, helping analyze how performance scales with input size.",
      topics: ["complexity-analysis", "big-o"],
    },
    {
      id: 3,
      category: "algorithms",
      difficulty: "hard",
      question: "Explain the concept of dynamic programming.",
      answer:
        "Dynamic programming is an optimization technique that solves complex problems by breaking them into simpler subproblems and storing the results to avoid redundant calculations.",
      topics: ["optimization", "memoization", "recursion"],
    },
    {
      id: 4,
      category: "algorithms",
      difficulty: "medium",
      question: "What is the difference between BFS and DFS?",
      answer:
        "BFS (Breadth-First Search) explores nodes level by level using a queue. DFS (Depth-First Search) explores as far as possible along each branch using a stack.",
      topics: ["graph-traversal", "bfs", "dfs"],
    },
    {
      id: 5,
      category: "algorithms",
      difficulty: "easy",
      question: "What is a sorting algorithm?",
      answer:
        "A sorting algorithm arranges elements in a specific order (ascending or descending). Common examples include bubble sort, merge sort, and quicksort.",
      topics: ["sorting", "algorithms"],
    },
    {
      id: 6,
      category: "algorithms",
      difficulty: "hard",
      question: "What is the traveling salesman problem?",
      answer:
        "The TSP is an NP-hard optimization problem that asks for the shortest route visiting each city exactly once and returning to the starting city.",
      topics: ["np-hard", "optimization", "graph-theory"],
    },
  
    // Data Structures
    {
      id: 7,
      category: "data-structures",
      difficulty: "easy",
      question: "What is a stack data structure?",
      answer:
        "A stack is a Last-In-First-Out (LIFO) data structure where elements are added and removed from the same end, called the top.",
      topics: ["stack", "lifo", "linear-structures"],
    },
    {
      id: 8,
      category: "data-structures",
      difficulty: "medium",
      question: "What is the difference between an array and a linked list?",
      answer:
        "Arrays store elements in contiguous memory with O(1) access time but fixed size. Linked lists use pointers with O(n) access time but dynamic size allocation.",
      topics: ["arrays", "linked-lists", "memory-management"],
    },
    {
      id: 9,
      category: "data-structures",
      difficulty: "hard",
      question: "Explain how a hash table works.",
      answer:
        "A hash table uses a hash function to map keys to array indices, providing O(1) average-case access time. Collisions are handled through chaining or open addressing.",
      topics: ["hashing", "hash-tables", "collision-resolution"],
    },
    {
      id: 10,
      category: "data-structures",
      difficulty: "easy",
      question: "What is a binary tree?",
      answer:
        "A binary tree is a hierarchical data structure where each node has at most two children, referred to as left and right child nodes.",
      topics: ["trees", "binary-trees", "hierarchical-structures"],
    },
    {
      id: 11,
      category: "data-structures",
      difficulty: "medium",
      question: "What is a queue data structure?",
      answer:
        "A queue is a First-In-First-Out (FIFO) data structure where elements are added at the rear and removed from the front, like a line of people waiting.",
      topics: ["queue", "fifo", "linear-structures"],
    },
    {
      id: 12,
      category: "data-structures",
      difficulty: "hard",
      question: "What is a B-tree and when is it used?",
      answer:
        "A B-tree is a self-balancing tree data structure that maintains sorted data and allows searches, insertions, and deletions in logarithmic time. It's commonly used in databases and file systems.",
      topics: ["b-trees", "databases", "file-systems"],
    },
  
    // Programming
    {
      id: 13,
      category: "programming",
      difficulty: "easy",
      question: "What is object-oriented programming (OOP)?",
      answer:
        "OOP is a programming paradigm based on objects that contain data (attributes) and code (methods). Key principles include encapsulation, inheritance, and polymorphism.",
      topics: ["oop", "encapsulation", "inheritance", "polymorphism"],
    },
    {
      id: 14,
      category: "programming",
      difficulty: "hard",
      question: "What is the difference between synchronous and asynchronous programming?",
      answer:
        "Synchronous programming executes code sequentially, blocking until each operation completes. Asynchronous programming allows multiple operations to run concurrently without blocking.",
      topics: ["async", "sync", "concurrency"],
    },
    {
      id: 15,
      category: "programming",
      difficulty: "medium",
      question: "What is recursion?",
      answer:
        "Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem, requiring a base case to prevent infinite loops.",
      topics: ["recursion", "base-case", "self-reference"],
    },
    {
      id: 16,
      category: "programming",
      difficulty: "hard",
      question: "What are design patterns in software engineering?",
      answer:
        "Design patterns are reusable solutions to common programming problems. Examples include Singleton, Observer, Factory, and Strategy patterns.",
      topics: ["design-patterns", "software-engineering", "best-practices"],
    },
    {
      id: 17,
      category: "programming",
      difficulty: "easy",
      question: "What is a variable in programming?",
      answer:
        "A variable is a named storage location that holds data which can be modified during program execution. It has a name, type, and value.",
      topics: ["variables", "data-types", "memory"],
    },
    {
      id: 18,
      category: "programming",
      difficulty: "medium",
      question: "What is the difference between compilation and interpretation?",
      answer:
        "Compilation translates source code into machine code before execution, while interpretation executes code line by line at runtime. Compiled languages are generally faster, interpreted languages are more flexible.",
      topics: ["compilation", "interpretation", "language-types"],
    },
  
    // Systems
    {
      id: 19,
      category: "systems",
      difficulty: "medium",
      question: "What is the purpose of an operating system?",
      answer:
        "An operating system manages computer hardware and software resources, provides services for programs, and acts as an interface between users and hardware.",
      topics: ["operating-systems", "resource-management", "system-calls"],
    },
    {
      id: 20,
      category: "systems",
      difficulty: "hard",
      question: "What is the difference between a process and a thread?",
      answer:
        "A process is an independent program execution with its own memory space. A thread is a lightweight unit within a process that shares memory and resources.",
      topics: ["processes", "threads", "concurrency", "memory-management"],
    },
    {
      id: 21,
      category: "systems",
      difficulty: "easy",
      question: "What is the difference between RAM and ROM?",
      answer:
        "RAM (Random Access Memory) is volatile memory for temporary data storage. ROM (Read-Only Memory) is non-volatile memory that stores permanent instructions.",
      topics: ["memory", "ram", "rom", "storage"],
    },
    {
      id: 22,
      category: "systems",
      difficulty: "medium",
      question: "What is virtual memory?",
      answer:
        "Virtual memory is a memory management technique that creates an illusion of having more RAM by using disk space to extend available memory.",
      topics: ["virtual-memory", "memory-management", "paging"],
    },
    {
      id: 23,
      category: "systems",
      difficulty: "hard",
      question: "What is a deadlock and how can it be prevented?",
      answer:
        "A deadlock occurs when two or more processes are blocked forever, waiting for each other. It can be prevented by avoiding circular wait, ensuring resource ordering, or using timeouts.",
      topics: ["deadlock", "synchronization", "resource-allocation"],
    },
    {
      id: 24,
      category: "systems",
      difficulty: "medium",
      question: "What is the difference between TCP and UDP?",
      answer:
        "TCP is a reliable, connection-oriented protocol that ensures data delivery and order. UDP is a faster, connectionless protocol without delivery guarantees.",
      topics: ["networking", "tcp", "udp", "protocols"],
    },
    // Additional Algorithms
    {
      id: 25,
      category: "algorithms",
      difficulty: "medium",
      question: "What is the time complexity of merge sort?",
      answer:
        "O(n log n) - Merge sort divides the array into halves recursively and then merges them back together in sorted order.",
      topics: ["sorting", "divide-conquer", "time-complexity"],
    },
    {
      id: 26,
      category: "algorithms",
      difficulty: "hard",
      question: "What is the difference between Dijkstra's and Bellman-Ford algorithms?",
      answer:
        "Dijkstra's algorithm works for graphs with non-negative weights and is more efficient. Bellman-Ford can handle negative weights but is slower and can detect negative cycles.",
      topics: ["graph-algorithms", "shortest-path", "optimization"],
    },
    // Additional Data Structures
    {
      id: 27,
      category: "data-structures",
      difficulty: "medium",
      question: "What is a heap data structure?",
      answer:
        "A heap is a specialized tree-based data structure that satisfies the heap property. In a max heap, parent nodes are always greater than or equal to their children.",
      topics: ["trees", "priority-queues", "heap"],
    },
    {
      id: 28,
      category: "data-structures",
      difficulty: "hard",
      question: "What is a trie data structure?",
      answer:
        "A trie is a tree-like data structure used to store strings. Each node represents a character, and the path from root to any node represents a word or prefix.",
      topics: ["trees", "string-processing", "prefix-trees"],
    },
    // Additional Programming
    {
      id: 29,
      category: "programming",
      difficulty: "medium",
      question: "What is garbage collection?",
      answer:
        "Garbage collection is the automatic memory management process that identifies and frees memory that is no longer in use by the program.",
      topics: ["memory-management", "programming-languages", "optimization"],
    },
    {
      id: 30,
      category: "programming",
      difficulty: "hard",
      question: "What is the difference between static and dynamic typing?",
      answer:
        "Static typing checks types at compile time, while dynamic typing checks types at runtime. Static typing catches errors earlier but requires more explicit type declarations.",
      topics: ["type-systems", "programming-languages", "compilation"],
    },
    // Additional Systems
    {
      id: 31,
      category: "systems",
      difficulty: "medium",
      question: "What is RAID in storage systems?",
      answer:
        "RAID (Redundant Array of Independent Disks) is a data storage technology that combines multiple physical disk drives into a single logical unit for redundancy and performance.",
      topics: ["storage", "redundancy", "performance"],
    },
    {
      id: 32,
      category: "systems",
      difficulty: "hard",
      question: "What is the difference between symmetric and asymmetric encryption?",
      answer:
        "Symmetric encryption uses the same key for encryption and decryption, while asymmetric encryption uses a public key for encryption and a private key for decryption.",
      topics: ["security", "encryption", "cryptography"],
    },
    // More Algorithms
    {
      id: 33,
      category: "algorithms",
      difficulty: "hard",
      question: "What is the A* search algorithm?",
      answer:
        "A* is a pathfinding algorithm that uses a heuristic function to estimate the cost to reach the goal. It combines the advantages of Dijkstra's algorithm and greedy best-first search.",
      topics: ["pathfinding", "heuristics", "graph-algorithms"],
    },
    {
      id: 34,
      category: "algorithms",
      difficulty: "medium",
      question: "What is the difference between greedy and dynamic programming approaches?",
      answer:
        "Greedy algorithms make locally optimal choices at each step, while dynamic programming breaks problems into subproblems and stores solutions to avoid redundant calculations.",
      topics: ["optimization", "algorithm-design", "problem-solving"],
    },
    // More Data Structures
    {
      id: 35,
      category: "data-structures",
      difficulty: "hard",
      question: "What is a skip list and what are its advantages?",
      answer:
        "A skip list is a probabilistic data structure that allows O(log n) search complexity. It uses multiple layers of linked lists with express lanes to skip over elements.",
      topics: ["linked-lists", "probabilistic-structures", "searching"],
    },
    {
      id: 36,
      category: "data-structures",
      difficulty: "medium",
      question: "What is a circular buffer and when is it used?",
      answer:
        "A circular buffer is a fixed-size buffer that wraps around when it reaches its end. It's commonly used for streaming data, audio processing, and producer-consumer scenarios.",
      topics: ["buffers", "memory-management", "queues"],
    },
    // More Programming
    {
      id: 37,
      category: "programming",
      difficulty: "hard",
      question: "What is the difference between shallow and deep copying?",
      answer:
        "Shallow copy creates a new object but references the same nested objects. Deep copy creates a completely independent copy of the object and all nested objects.",
      topics: ["memory-management", "object-oriented", "copying"],
    },
    {
      id: 38,
      category: "programming",
      difficulty: "medium",
      question: "What is the difference between composition and inheritance?",
      answer:
        "Inheritance creates an 'is-a' relationship where a class inherits properties from a parent class. Composition creates a 'has-a' relationship where a class contains instances of other classes.",
      topics: ["oop", "design-patterns", "relationships"],
    },
    // More Systems
    {
      id: 39,
      category: "systems",
      difficulty: "hard",
      question: "What is the difference between microservices and monolithic architecture?",
      answer:
        "Monolithic architecture combines all components into a single application, while microservices break the application into small, independent services that communicate via APIs.",
      topics: ["architecture", "distributed-systems", "scalability"],
    },
    {
      id: 40,
      category: "systems",
      difficulty: "medium",
      question: "What is the purpose of a load balancer?",
      answer:
        "A load balancer distributes incoming network traffic across multiple servers to ensure reliability, high availability, and optimal resource utilization.",
      topics: ["networking", "scalability", "high-availability"]
    },
    // Web Development
    {
      id: 41,
      category: "web-development",
      difficulty: "medium",
      question: "What is the difference between REST and GraphQL?",
      answer: "REST is a resource-based architecture where each endpoint represents a resource. GraphQL is a query language that allows clients to request exactly the data they need in a single request.",
      topics: ["apis", "web-services", "data-fetching"]
    },
    {
      id: 42,
      category: "web-development",
      difficulty: "easy",
      question: "What is the purpose of CSS Grid and Flexbox?",
      answer: "CSS Grid is for two-dimensional layouts (rows and columns), while Flexbox is for one-dimensional layouts (either rows or columns). They work together to create complex, responsive layouts.",
      topics: ["css", "layout", "responsive-design"]
    },
    {
      id: 43,
      category: "web-development",
      difficulty: "hard",
      question: "Explain the concept of Progressive Web Apps (PWAs).",
      answer: "PWAs are web applications that use modern web capabilities to deliver an app-like experience. They can work offline, be installed on devices, and provide push notifications.",
      topics: ["pwa", "offline-first", "web-apps"]
    },

    // Database Systems
    {
      id: 44,
      category: "database-systems",
      difficulty: "medium",
      question: "What is database normalization and why is it important?",
      answer: "Normalization is the process of organizing data to minimize redundancy and dependency. It helps maintain data integrity and reduces anomalies in database operations.",
      topics: ["normalization", "database-design", "data-integrity"]
    },
    {
      id: 45,
      category: "database-systems",
      difficulty: "hard",
      question: "What is the difference between SQL and NoSQL databases?",
      answer: "SQL databases are relational, use structured schemas, and support ACID properties. NoSQL databases are non-relational, have flexible schemas, and prioritize scalability and performance.",
      topics: ["sql", "nosql", "database-types"]
    },
    {
      id: 46,
      category: "database-systems",
      difficulty: "medium",
      question: "What are database indexes and when should they be used?",
      answer: "Indexes are data structures that improve the speed of data retrieval operations. They should be used on frequently queried columns but avoided on columns with frequent updates.",
      topics: ["indexing", "performance", "query-optimization"]
    },

    // Security & Cryptography
    {
      id: 47,
      category: "security-crypto",
      difficulty: "hard",
      question: "What is the difference between symmetric and asymmetric encryption?",
      answer: "Symmetric encryption uses the same key for encryption and decryption, while asymmetric encryption uses a public key for encryption and a private key for decryption.",
      topics: ["encryption", "cryptography", "keys"]
    },
    {
      id: 48,
      category: "security-crypto",
      difficulty: "medium",
      question: "What is the purpose of HTTPS and how does it work?",
      answer: "HTTPS provides secure communication over HTTP using SSL/TLS encryption. It ensures data confidentiality, integrity, and authentication between the client and server.",
      topics: ["https", "ssl", "tls", "web-security"]
    },
    {
      id: 49,
      category: "security-crypto",
      difficulty: "hard",
      question: "What are common web security vulnerabilities and how to prevent them?",
      answer: "Common vulnerabilities include XSS, CSRF, SQL injection, and insecure authentication. Prevention involves input validation, proper authentication, and following security best practices.",
      topics: ["security", "vulnerabilities", "web-security"]
    },
    // Additional Web Development Cards
    {
      id: 50,
      category: "web-development",
      difficulty: "medium",
      question: "What is the Virtual DOM in React and how does it work?",
      answer: "The Virtual DOM is a lightweight copy of the actual DOM. React uses it to improve performance by comparing it with the real DOM and only updating what's necessary, minimizing expensive DOM operations.",
      topics: ["react", "performance", "frontend"]
    },
    {
      id: 51,
      category: "web-development",
      difficulty: "hard",
      question: "Explain the concept of Server-Side Rendering (SSR) and its benefits.",
      answer: "SSR generates HTML on the server before sending it to the client. Benefits include better SEO, faster initial page load, and improved performance on low-end devices.",
      topics: ["ssr", "performance", "seo"]
    },
    {
      id: 52,
      category: "web-development",
      difficulty: "medium",
      question: "What is the difference between cookies, localStorage, and sessionStorage?",
      answer: "Cookies are sent with every HTTP request and have size limits. localStorage persists until cleared and has no expiration. sessionStorage is cleared when the page session ends.",
      topics: ["storage", "browser-api", "state-management"]
    },
    {
      id: 53,
      category: "web-development",
      difficulty: "easy",
      question: "What is the purpose of CSS preprocessors like SASS?",
      answer: "CSS preprocessors add features like variables, nesting, mixins, and functions to CSS, making it more maintainable and reducing repetition in stylesheets.",
      topics: ["css", "sass", "styling"]
    },
    {
      id: 54,
      category: "web-development",
      difficulty: "hard",
      question: "What is the difference between WebSocket and HTTP?",
      answer: "WebSocket provides full-duplex communication over a single TCP connection, while HTTP is request-response based. WebSocket is better for real-time applications like chat or gaming.",
      topics: ["websockets", "networking", "real-time"]
    },
    {
      id: 55,
      category: "web-development",
      difficulty: "medium",
      question: "What is the purpose of Web Workers in JavaScript?",
      answer: "Web Workers allow JavaScript to run in background threads, preventing the main thread from being blocked by CPU-intensive tasks, thus improving application responsiveness.",
      topics: ["javascript", "performance", "multithreading"]
    },
    {
      id: 56,
      category: "web-development",
      difficulty: "easy",
      question: "What is the difference between let, const, and var in JavaScript?",
      answer: "var is function-scoped and can be redeclared. let is block-scoped and can be reassigned. const is block-scoped and cannot be reassigned after initialization.",
      topics: ["javascript", "variables", "scope"]
    },

    // Additional Database Systems Cards
    {
      id: 57,
      category: "database-systems",
      difficulty: "hard",
      question: "What is the CAP theorem and how does it affect database design?",
      answer: "The CAP theorem states that a distributed system can only guarantee two of: Consistency, Availability, and Partition tolerance. This influences the choice between SQL and NoSQL databases.",
      topics: ["distributed-systems", "cap-theorem", "database-design"]
    },
    {
      id: 58,
      category: "database-systems",
      difficulty: "medium",
      question: "What is database sharding and when should it be used?",
      answer: "Sharding splits a database into smaller, more manageable pieces called shards. It's used to improve performance and scalability by distributing data across multiple servers.",
      topics: ["scalability", "performance", "distributed-databases"]
    },
    {
      id: 59,
      category: "database-systems",
      difficulty: "hard",
      question: "What is the difference between OLTP and OLAP databases?",
      answer: "OLTP (Online Transaction Processing) handles day-to-day transactions, while OLAP (Online Analytical Processing) is optimized for complex queries and data analysis.",
      topics: ["database-types", "analytics", "transactions"]
    },
    {
      id: 60,
      category: "database-systems",
      difficulty: "medium",
      question: "What is database replication and what are its benefits?",
      answer: "Replication creates copies of a database across multiple servers. Benefits include improved availability, better read performance, and disaster recovery capabilities.",
      topics: ["replication", "high-availability", "performance"]
    },
    {
      id: 61,
      category: "database-systems",
      difficulty: "easy",
      question: "What is a database transaction and what are its properties (ACID)?",
      answer: "A transaction is a sequence of operations that must be completed as a unit. ACID properties are: Atomicity, Consistency, Isolation, and Durability.",
      topics: ["transactions", "acid", "data-integrity"]
    },
    {
      id: 62,
      category: "database-systems",
      difficulty: "hard",
      question: "What is database denormalization and when should it be used?",
      answer: "Denormalization adds redundant data to improve read performance. It should be used when read operations significantly outnumber write operations and when query performance is critical.",
      topics: ["performance", "database-design", "optimization"]
    },
    {
      id: 63,
      category: "database-systems",
      difficulty: "medium",
      question: "What is the difference between a clustered and non-clustered index?",
      answer: "A clustered index determines the physical order of data in a table, while a non-clustered index is a separate structure that points to the data. A table can have only one clustered index but multiple non-clustered indexes.",
      topics: ["indexing", "performance", "database-design"]
    },

    // Additional Security & Cryptography Cards
    {
      id: 64,
      category: "security-crypto",
      difficulty: "hard",
      question: "What is the difference between hashing and encryption?",
      answer: "Hashing is a one-way function that converts data into a fixed-size string, while encryption is a two-way function that can be reversed with the correct key. Hashing is used for data integrity, encryption for confidentiality.",
      topics: ["hashing", "encryption", "cryptography"]
    },
    {
      id: 65,
      category: "security-crypto",
      difficulty: "medium",
      question: "What is OAuth 2.0 and how does it work?",
      answer: "OAuth 2.0 is an authorization framework that enables applications to obtain limited access to user accounts. It uses tokens instead of credentials and supports different grant types for various scenarios.",
      topics: ["oauth", "authentication", "authorization"]
    },
    {
      id: 66,
      category: "security-crypto",
      difficulty: "hard",
      question: "What is a Man-in-the-Middle (MITM) attack and how can it be prevented?",
      answer: "A MITM attack intercepts communication between two parties. Prevention methods include using HTTPS, certificate pinning, and implementing proper key exchange protocols.",
      topics: ["security", "attacks", "prevention"]
    },
    {
      id: 67,
      category: "security-crypto",
      difficulty: "medium",
      question: "What is the difference between authentication and authorization?",
      answer: "Authentication verifies who a user is, while authorization determines what they can access. Authentication comes before authorization in the security process.",
      topics: ["security", "authentication", "authorization"]
    },
    {
      id: 68,
      category: "security-crypto",
      difficulty: "hard",
      question: "What is a zero-day vulnerability and how should organizations handle it?",
      answer: "A zero-day vulnerability is a security flaw unknown to the vendor. Organizations should have incident response plans, regular security audits, and keep systems updated to minimize risks.",
      topics: ["vulnerabilities", "security", "incident-response"]
    },
    {
      id: 69,
      category: "security-crypto",
      difficulty: "medium",
      question: "What is the purpose of a firewall and what types exist?",
      answer: "A firewall monitors and controls network traffic. Types include packet-filtering, stateful inspection, and application-layer firewalls, each providing different levels of security.",
      topics: ["networking", "security", "firewalls"]
    },
    {
      id: 70,
      category: "security-crypto",
      difficulty: "hard",
      question: "What is the difference between symmetric and asymmetric key exchange?",
      answer: "Symmetric key exchange uses the same key for encryption and decryption, while asymmetric key exchange uses a public-private key pair. Asymmetric is more secure but slower, often used to establish symmetric keys.",
      topics: ["cryptography", "key-exchange", "security"]
    }
  ]
  
  // Achievements data
  const achievementsData = [
    {
      id: "first_study",
      title: "First Steps",
      description: "Complete your first study session",
      icon: "🎯",
      condition: (stats) => stats.studied >= 1,
    },
    {
      id: "streak_5",
      title: "Getting Warmed Up",
      description: "Achieve a 5-card streak",
      icon: "🔥",
      condition: (stats) => stats.maxStreak >= 5,
    },
    {
      id: "streak_10",
      title: "On Fire",
      description: "Achieve a 10-card streak",
      icon: "🚀",
      condition: (stats) => stats.maxStreak >= 10,
    },
    {
      id: "study_50",
      title: "Dedicated Learner",
      description: "Study 50 flashcards",
      icon: "📚",
      condition: (stats) => stats.studied >= 50,
    },
    {
      id: "study_100",
      title: "Century Club",
      description: "Study 100 flashcards",
      icon: "💯",
      condition: (stats) => stats.studied >= 100,
    },
    {
      id: "perfect_session",
      title: "Perfectionist",
      description: "Complete a session with 100% accuracy",
      icon: "⭐",
      condition: (stats) => stats.perfectSessions >= 1,
    },
    {
      id: "all_categories",
      title: "Well Rounded",
      description: "Study cards from all categories",
      icon: "🌟",
      condition: (stats) => Object.keys(stats.categories || {}).length >= 4,
    },
    {
      id: "speed_demon",
      title: "Speed Demon",
      description: "Answer 20 cards in under 5 minutes",
      icon: "⚡",
      condition: (stats) => stats.fastSessions >= 1,
    },
  ]
  
  // Make data available globally
  window.flashcardsData = flashcardsData
  window.categoryData = categoryData
  window.achievementsData = achievementsData