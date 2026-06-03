const swaggerJsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "BuildYounique API",
    version: "1.0.0",
    description: "API documentation for the BuildYounique backend.",
  },
  servers: [
    {
      url: process.env.SWAGGER_BASE_URL || "http://localhost:3000",
      description: "Local development server",
    },
  ],
  components: {
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "error" },
          message: { type: "string", example: "Resource not found" },
        },
      },
      HealthResponse: {
        type: "string",
        example: "API server up",
      },
      ChatRequest: {
        type: "object",
        properties: {
          message: { type: "string", example: "Hello BuildYounique" },
          history: {
            type: "array",
            items: {
              type: "object",
              properties: {
                from: { type: "string", example: "user" },
                text: { type: "string", example: "Hello" },
              },
            },
          },
        },
        required: ["message"],
      },
      ChatResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean", example: true },
          reply: {
            type: "string",
            example: "Hello! How can I help you today?",
          },
        },
      },
      College: {
        type: "object",
        properties: {
          college_name: { type: "string", example: "BuildYounique College" },
          contact_person: { type: "string", example: "John Doe" },
          email: { type: "string", example: "contact@example.com" },
          phone: { type: "string", example: "+919876543210" },
          total_registered_teams: { type: "integer", example: 12 },
          total_registered_members: { type: "integer", example: 48 },
          created_at: {
            type: "string",
            format: "date-time",
            example: "2026-06-03T12:00:00Z",
          },
          updated_at: {
            type: "string",
            format: "date-time",
            example: "2026-06-03T12:00:00Z",
          },
        },
        required: ["college_name"],
      },
      Team: {
        type: "object",
        properties: {
          college_id: { type: "integer", example: 5 },
          hackathon_event_id: { type: "integer", example: 2 },
          team_name: { type: "string", example: "Team Alpha" },
          team_leader_name: { type: "string", example: "Jane Doe" },
          team_leader_email: { type: "string", example: "leader@example.com" },
          phone: { type: "string", example: "+919876543210" },
          leader_email_verified: { type: "boolean", example: false },
          registration_fee_per_member: {
            type: "number",
            format: "decimal",
            example: 600.0,
          },
          payment_status: {
            type: "string",
            example: "pending",
            enum: ["pending", "paid"],
          },
        },
        required: [
          "college_id",
          "hackathon_event_id",
          "team_name",
          "team_leader_email",
        ],
      },
      TeamMember: {
        type: "object",
        properties: {
          team_id: {
            type: "integer",
            example: 1,
          },
          email: {
            type: "string",
            example: "member@example.com",
          },
          member_email_verified: {
            type: "boolean",
            example: false,
          },
        },
        required: ["team_id"],
      },
      CareerApplication: {
        type: "object",
        properties: {
          full_name: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john@example.com" },
          phone: { type: "string", example: "+919876543210" },
          applying_role: { type: "string", example: "Software Engineer" },
          years_of_experience: {
            type: "number",
            format: "decimal",
            example: 3.5,
          },
          skills: {
            type: "array",
            items: { type: "string", example: "JavaScript" },
            example: ["JavaScript", "Node.js", "React"],
          },
          resume_url: {
            type: "string",
            example: "https://example.com/resume.pdf",
          },
          resume_file_name: { type: "string", example: "resume.pdf" },
          resume_file_size: { type: "integer", example: 123456 },
          linkedin_url: {
            type: "string",
            example: "https://linkedin.com/in/johndoe",
          },
          portfolio_url: {
            type: "string",
            example: "https://portfolio.example.com",
          },
          github_url: { type: "string", example: "https://github.com/johndoe" },
          current_location: { type: "string", example: "Bengaluru, India" },
          college_name: { type: "string", example: "BuildYounique University" },
          current_company: { type: "string", example: "Acme Corp" },
          current_ctc: { type: "number", format: "decimal", example: 8.5 },
          expected_ctc: { type: "number", format: "decimal", example: 12.0 },
          notice_period_days: { type: "integer", example: 30 },
          cover_letter: {
            type: "string",
            example: "I am excited to apply for this position because...",
          },
        },
        required: [
          "full_name",
          "email",
          "phone",
          "applying_role",
          "skills",
          "resume_url",
        ],
      },
      ContactEnquiry: {
        type: "object",
        properties: {
          name: { type: "string", example: "Jane Doe" },
          email: { type: "string", example: "jane@example.com" },
          phone: { type: "string", example: "+919876543210" },
          service_required: { type: "string", example: "Website Development" },
          project_description: {
            type: "string",
            example:
              "I need a website and branding support for my new business.",
          },
          status: {
            type: "string",
            example: "new",
            enum: ["new", "contacted", "in_discussion", "converted", "closed"],
          },
        },
        required: ["name", "email", "phone", "project_description"],
      },
      Course: {
        type: "object",
        properties: {
          name: { type: "string", example: "Full Stack Web Development" },
          description: {
            type: "string",
            example: "Comprehensive course covering frontend and backend.",
          },
          duration: { type: "string", example: "12 weeks" },
          course_type: { type: "string", example: "Online" },
          price: { type: "number", format: "decimal", example: 19999.99 },
          discounted_price: {
            type: "number",
            format: "decimal",
            example: 14999.99,
          },
        },
        required: ["name", "description", "duration", "course_type", "price"],
      },
      Training: {
        type: "object",
        properties: {
          course_id: { type: "integer", example: 2 },
          name: { type: "string", example: "John Doe" },
          email: { type: "string", example: "john@example.com" },
          phone: { type: "string", example: "+919876543210" },
          college_name: { type: "string", example: "BuildYounique University" },
          year_of_study: { type: "string", example: "3rd Year" },
          address: { type: "string", example: "123 Main Street, Bengaluru" },
          created_at: {
            type: "string",
            format: "date-time",
            example: "2026-06-03T12:00:00Z",
          },
        },
        required: [
          "course_id",
          "name",
          "email",
          "phone",
          "college_name",
          "year_of_study",
          "address",
        ],
      },
      HackathonEvent: {
        type: "object",
        properties: {
          event_name: { type: "string", example: "Hackathon 2026" },
          created_at: {
            type: "string",
            format: "date-time",
            example: "2026-06-03T12:00:00Z",
          },
        },
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          200: {
            description: "Server is running",
            content: {
              "text/plain": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
    "/api/chat": {
      post: {
        tags: ["Chat"],
        summary: "Send a chat message to the AI service",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ChatRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "AI response",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChatResponse" },
              },
            },
          },
          400: { description: "Bad request" },
          502: { description: "AI service unavailable" },
        },
      },
    },
    "/api/v1/colleges": {
      get: {
        tags: ["College"],
        summary: "Get all colleges",
        responses: { 200: { description: "A list of colleges" } },
      },
      post: {
        tags: ["College"],
        summary: "Create a new college",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/College" },
            },
          },
        },
        responses: { 201: { description: "College created" } },
      },
    },
    "/api/v1/colleges/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      get: {
        tags: ["College"],
        summary: "Get a college by ID",
        responses: {
          200: { description: "College details" },
          404: { description: "Not found" },
        },
      },
      put: {
        tags: ["College"],
        summary: "Update a college by ID",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/College" },
            },
          },
        },
        responses: { 200: { description: "College updated" } },
      },
      delete: {
        tags: ["College"],
        summary: "Delete a college by ID",
        responses: { 204: { description: "College deleted" } },
      },
    },
    "/api/v1/colleges/promo-codes/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      get: {
        tags: ["College"],
        summary: "Get promo codes for a college",
        responses: { 200: { description: "Promo codes list" } },
      },
    },
    "/api/v1/teams": {
      parameters: [
        {
          name: "college_id",
          in: "query",
          description: "Filter teams by college ID",
          required: false,
          schema: { type: "integer" },
        },
      ],
      get: {
        tags: ["Team"],
        summary: "Get all teams",
        responses: { 200: { description: "Teams list" } },
      },
      post: {
        tags: ["Team"],
        summary: "Create a new team",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Team" },
            },
          },
        },
        responses: { 201: { description: "Team created" } },
      },
    },
    "/api/v1/teams/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      get: {
        tags: ["Team"],
        summary: "Get a team by ID",
        responses: { 200: { description: "Team details" } },
      },
      put: {
        tags: ["Team"],
        summary: "Update a team by ID",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Team" },
            },
          },
        },
        responses: { 200: { description: "Team updated" } },
      },
      delete: {
        tags: ["Team"],
        summary: "Delete a team by ID",
        responses: { 204: { description: "Team deleted" } },
      },
    },
    "/api/v1/teams/members": {
      get: {
        tags: ["TeamMember"],
        summary: "Get all team members",
        responses: { 200: { description: "Members list" } },
      },
      post: {
        tags: ["TeamMember"],
        summary: "Create a team member",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TeamMember" },
            },
          },
        },
        responses: { 201: { description: "Member created" } },
      },
    },
    "/api/v1/teams/members/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      get: {
        tags: ["TeamMember"],
        summary: "Get a team member by ID",
        responses: { 200: { description: "Member details" } },
      },
      put: {
        tags: ["TeamMember"],
        summary: "Update a team member by ID",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TeamMember" },
            },
          },
        },
        responses: { 200: { description: "Member updated" } },
      },
      delete: {
        tags: ["TeamMember"],
        summary: "Delete a team member by ID",
        responses: { 204: { description: "Member deleted" } },
      },
    },
    "/api/v1/teams/members/verify-email": {
      post: {
        tags: ["TeamMember"],
        summary: "Verify a team member email",
        responses: { 200: { description: "Verification result" } },
      },
    },
    "/api/v1/teams/login": {
      post: {
        tags: ["Team"],
        summary: "Team login",
        responses: { 200: { description: "Login result" } },
      },
    },
    "/api/v1/teams/login/verify": {
      post: {
        tags: ["Team"],
        summary: "Verify team login",
        responses: { 200: { description: "Verification result" } },
      },
    },
    "/api/v1/teams/verify-email": {
      post: {
        tags: ["Team"],
        summary: "Verify team leader email",
        responses: { 200: { description: "Verification result" } },
      },
    },
    "/api/v1/career-applications": {
      post: {
        tags: ["Career"],
        summary: "Create a career application",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CareerApplication" },
            },
          },
        },
        responses: { 201: { description: "Application submitted" } },
      },
    },
    "/api/v1/contact-enquiries": {
      post: {
        tags: ["Contact"],
        summary: "Create a contact enquiry",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContactEnquiry" },
            },
          },
        },
        responses: { 201: { description: "Contact enquiry submitted" } },
      },
    },
    "/api/v1/courses": {
      get: {
        tags: ["Course"],
        summary: "Get all courses",
        responses: { 200: { description: "Courses list" } },
      },
      post: {
        tags: ["Course"],
        summary: "Create a new course",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Course" },
            },
          },
        },
        responses: { 201: { description: "Course created" } },
      },
    },
    "/api/v1/courses/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      get: {
        tags: ["Course"],
        summary: "Get a course by ID",
        responses: { 200: { description: "Course details" } },
      },
      put: {
        tags: ["Course"],
        summary: "Update a course by ID",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Course" },
            },
          },
        },
        responses: { 200: { description: "Course updated" } },
      },
      delete: {
        tags: ["Course"],
        summary: "Delete a course by ID",
        responses: { 204: { description: "Course deleted" } },
      },
    },
    "/api/v1/trainings": {
      get: {
        tags: ["Training"],
        summary: "Get all training registrations",
        responses: { 200: { description: "Training registrations list" } },
      },
      post: {
        tags: ["Training"],
        summary: "Create a training registration",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Training" },
            },
          },
        },
        responses: { 201: { description: "Training registration created" } },
      },
    },
    "/api/v1/trainings/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      get: {
        tags: ["Training"],
        summary: "Get a training registration by ID",
        responses: { 200: { description: "Training registration details" } },
      },
      put: {
        tags: ["Training"],
        summary: "Update a training registration by ID",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Training" },
            },
          },
        },
        responses: { 200: { description: "Training registration updated" } },
      },
      delete: {
        tags: ["Training"],
        summary: "Delete a training registration by ID",
        responses: { 204: { description: "Training registration deleted" } },
      },
    },
    "/api/v1/hackathon-events": {
      get: {
        tags: ["Hackathon"],
        summary: "Get hackathon events",
        responses: { 200: { description: "Events list" } },
      },
      post: {
        tags: ["Hackathon"],
        summary: "Create a hackathon event",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/HackathonEvent" },
            },
          },
        },
        responses: { 201: { description: "Event created" } },
      },
    },
    "/api/v1/hackathon-events/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      get: {
        tags: ["Hackathon"],
        summary: "Get a hackathon event by ID",
        responses: { 200: { description: "Event details" } },
      },
      put: {
        tags: ["Hackathon"],
        summary: "Update a hackathon event by ID",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/HackathonEvent" },
            },
          },
        },
        responses: { 200: { description: "Event updated" } },
      },
      delete: {
        tags: ["Hackathon"],
        summary: "Delete a hackathon event by ID",
        responses: { 204: { description: "Event deleted" } },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);
