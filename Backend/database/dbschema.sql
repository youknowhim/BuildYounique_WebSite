
CREATE TABLE career_applications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,


    applying_role VARCHAR(255) NOT NULL,
    years_of_experience DECIMAL(4,1) DEFAULT 0,


    skills JSON NOT NULL,


    resume_url VARCHAR(500) NOT NULL,
    resume_file_name VARCHAR(255),
    resume_file_size BIGINT,


    linkedin_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    github_url VARCHAR(500),

  
    current_location VARCHAR(255),
    college_name VARCHAR(255),
    current_company VARCHAR(255),


    current_ctc DECIMAL(12,2),
    expected_ctc DECIMAL(12,2),

    notice_period_days INT,

  
    cover_letter TEXT,

    
    application_status ENUM(
        'pending',
        'reviewing',
        'shortlisted',
        'interview_scheduled',
        'selected',
        'rejected'
    ) DEFAULT 'pending',


    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE contact_enquiries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,

    service_required VARCHAR(255),

    project_description TEXT NOT NULL,

    status ENUM(
        'new',
        'contacted',
        'in_discussion',
        'converted',
        'closed'
    ) DEFAULT 'new',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
);

CREATE TABLE colleges (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    college_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    total_registered_teams INT DEFAULT 0,
    total_registered_members INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

create table hackathon_events(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(255) NOT NULL;
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
)

CREATE TABLE teams (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    hackathon_event_id BIGINT NOT NULL,
    college_id BIGINT NOT NULL,
    team_name VARCHAR(255) NOT NULL,
    team_leader_name VARCHAR(255),
    team_leader_email VARCHAR(255),
    phone VARCHAR(20),
    leader_email_verified TINYINT(1) DEFAULT 0,
    registration_fee_per_member DECIMAL(10,2) DEFAULT 600,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_status ENUM('pending','paid') DEFAULT 'pending',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_team_hackathon FOREIGN KEY (hackathon_event_id) REFERENCES hackathon_events(id) ON DELETE CASCADE,
    CONSTRAINT fk_team_college FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

CREATE TABLE team_members (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    team_id BIGINT NOT NULL,
    email VARCHAR(255),
    member_email_verified TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_member_team
        FOREIGN KEY (team_id)
        REFERENCES teams(id)
        ON DELETE CASCADE
);

CREATE TABLE email_otps (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    email VARCHAR(255) NOT NULL,

    otp VARCHAR(10) NOT NULL,

    purpose ENUM(
        'TEAM_LEADER_VERIFICATION',
        'TEAM_MEMBER_VERIFICATION',
        'TEAM_LOGIN'
    ) NOT NULL,

    reference_id BIGINT NOT NULL,

    expires_at DATETIME NOT NULL,

    verified TINYINT(1) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE promo_codes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    college_id BIGINT NOT NULL,
    promo_code VARCHAR(50) UNIQUE NOT NULL,
    discount_amount DECIMAL(10,2) NOT NULL, 
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_promo_college
        FOREIGN KEY (college_id)
        REFERENCES colleges(id)
        ON DELETE CASCADE
);

CREATE TABLE payments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    college_id BIGINT NOT NULL,
    promo_code_id BIGINT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending','paid','failed') DEFAULT 'pending',
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (college_id) REFERENCES colleges(id),
    FOREIGN KEY (promo_code_id) REFERENCES promo_codes(id)
);

CREATE TABLE payment_teams (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    payment_id BIGINT NOT NULL,
    team_id BIGINT NOT NULL,

    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);


create table courses(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,  
 name VARCHAR(255) NOT NULL,
 description TEXT NOT NULL,
 duration VARCHAR(50) NOT NULL,
 course_type varchar(255) not null,
 price DECIMAL(10,2) NOT NULL,
 discounted_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
)

create table training(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(255) NOT NULL,
 email VARCHAR(255) NOT NULL,
 phone VARCHAR(20) NOT NULL,
    college_name VARCHAR(255) NOT NULL,
    year_of_study VARCHAR(50) NOT NULL,
    address VARCHAR(500) NOT NULL,
    course_id BIGINT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(id)
)




-- Make landing page For Registration only.
-- 1. Organise Workshop Registration form
-- 2. Seminar Registration Form
-- 3. College Collaboration Forms.
-- 4. Lead Magnet Forms