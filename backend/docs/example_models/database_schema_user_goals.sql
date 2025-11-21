-- ═══════════════════════════════════════════════════════════════
-- Database Schema for AI Email Orchestrator - User Goals & Categories
-- ═══════════════════════════════════════════════════════════════

-- User Goals Table
-- Stores personalized goals and context for each user
CREATE TABLE user_goals (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    
    -- Main goals
    main_focus TEXT NOT NULL COMMENT 'Primary business focus',
    key_goal TEXT NOT NULL COMMENT 'Main objective for this period',
    secondary_project TEXT NULL COMMENT 'Secondary projects or initiatives',
    
    -- Strategy & context
    strategy TEXT NULL COMMENT 'Business strategy and positioning',
    situation TEXT NULL COMMENT 'Current business situation',
    target_clients TEXT NULL COMMENT 'Target client profile',
    expertise TEXT NULL COMMENT 'Areas of expertise',
    
    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_user_id (user_id),
    INDEX idx_active (is_active),
    
    -- Foreign key (assuming users table exists)
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Email Categories Table
-- Defines available email categories (both default and user-specific)
CREATE TABLE email_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'Category key (e.g., automation_opportunity)',
    display_name VARCHAR(255) NOT NULL COMMENT 'Human readable name',
    description TEXT NULL,
    priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    
    -- User customization
    user_id BIGINT UNSIGNED NULL COMMENT 'NULL = default category for all users',
    
    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    UNIQUE KEY unique_category_per_user (name, user_id),
    INDEX idx_user_id (user_id),
    INDEX idx_active (is_active),
    INDEX idx_priority (priority),
    
    -- Foreign key
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Email Subcategories Table
-- Defines subcategories for better classification
CREATE TABLE email_subcategories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL COMMENT 'Subcategory key',
    display_name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    
    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_category_id (category_id),
    INDEX idx_active (is_active),
    UNIQUE KEY unique_subcategory_per_category (category_id, name),
    
    -- Foreign key
    FOREIGN KEY (category_id) REFERENCES email_categories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Keyword Mapping Table
-- Maps keywords to categories with weights for better classification
CREATE TABLE keyword_mappings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    category_id BIGINT UNSIGNED NOT NULL,
    
    -- Priority & weight
    priority ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    weight DECIMAL(3,2) NOT NULL DEFAULT 1.00 COMMENT 'Weight multiplier (0.01 to 9.99)',
    
    -- User customization
    user_id BIGINT UNSIGNED NULL COMMENT 'NULL = default keyword for all users',
    
    -- Metadata
    language VARCHAR(10) DEFAULT 'en' COMMENT 'Keyword language (en, sr, etc.)',
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INT DEFAULT 0 COMMENT 'Track keyword usage for analytics',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_keyword (keyword),
    INDEX idx_category_id (category_id),
    INDEX idx_user_id (user_id),
    INDEX idx_priority (priority),
    INDEX idx_active (is_active),
    INDEX idx_language (language),
    UNIQUE KEY unique_keyword_per_user_category (keyword, user_id, category_id),
    
    -- Foreign keys
    FOREIGN KEY (category_id) REFERENCES email_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ═══════════════════════════════════════════════════════════════
-- Default Data Seeds
-- ═══════════════════════════════════════════════════════════════

-- Default Categories
INSERT INTO email_categories (name, display_name, description, priority, user_id) VALUES
('automation_opportunity', 'Automation Opportunity', 'B2B automation prilike, consulting zahtevi', 'high', NULL),
('business_inquiry', 'Business Inquiry', 'Direktni zahtevi, projekti, partnerships', 'high', NULL),
('networking', 'Networking', 'Events, community, collaboration', 'medium', NULL),
('financial', 'Financial', 'Računi, invoices, payments', 'medium', NULL),
('marketing', 'Marketing', 'Newsletters, promo, bulk emails', 'low', NULL);

-- Default Subcategories
INSERT INTO email_subcategories (category_id, name, display_name, description) VALUES
-- Automation Opportunity subcategories
((SELECT id FROM email_categories WHERE name = 'automation_opportunity' AND user_id IS NULL LIMIT 1), 
 'workflow_automation', 'Workflow Automation', 'Process automation and workflow optimization'),
((SELECT id FROM email_categories WHERE name = 'automation_opportunity' AND user_id IS NULL LIMIT 1), 
 'ai_ml_project', 'AI/ML Project', 'Artificial intelligence and machine learning projects'),
((SELECT id FROM email_categories WHERE name = 'automation_opportunity' AND user_id IS NULL LIMIT 1), 
 'digital_transformation', 'Digital Transformation', 'Enterprise digital transformation initiatives'),

-- Business Inquiry subcategories
((SELECT id FROM email_categories WHERE name = 'business_inquiry' AND user_id IS NULL LIMIT 1), 
 'project_proposal', 'Project Proposal', 'New project proposals and RFPs'),
((SELECT id FROM email_categories WHERE name = 'business_inquiry' AND user_id IS NULL LIMIT 1), 
 'partnership', 'Partnership', 'Partnership and collaboration opportunities'),
((SELECT id FROM email_categories WHERE name = 'business_inquiry' AND user_id IS NULL LIMIT 1), 
 'consulting_request', 'Consulting Request', 'Consulting and advisory requests'),

-- Networking subcategories
((SELECT id FROM email_categories WHERE name = 'networking' AND user_id IS NULL LIMIT 1), 
 'event', 'Event', 'Conference and event invitations'),
((SELECT id FROM email_categories WHERE name = 'networking' AND user_id IS NULL LIMIT 1), 
 'community', 'Community', 'Community and group activities'),
((SELECT id FROM email_categories WHERE name = 'networking' AND user_id IS NULL LIMIT 1), 
 'collaboration', 'Collaboration', 'Collaboration opportunities'),

-- Financial subcategories
((SELECT id FROM email_categories WHERE name = 'financial' AND user_id IS NULL LIMIT 1), 
 'invoice', 'Invoice', 'Invoice and billing statements'),
((SELECT id FROM email_categories WHERE name = 'financial' AND user_id IS NULL LIMIT 1), 
 'payment', 'Payment', 'Payment confirmations and receipts'),
((SELECT id FROM email_categories WHERE name = 'financial' AND user_id IS NULL LIMIT 1), 
 'billing', 'Billing', 'Billing notifications'),

-- Marketing subcategories
((SELECT id FROM email_categories WHERE name = 'marketing' AND user_id IS NULL LIMIT 1), 
 'newsletter', 'Newsletter', 'Regular newsletters and digests'),
((SELECT id FROM email_categories WHERE name = 'marketing' AND user_id IS NULL LIMIT 1), 
 'promotion', 'Promotion', 'Promotional emails and offers'),
((SELECT id FROM email_categories WHERE name = 'marketing' AND user_id IS NULL LIMIT 1), 
 'announcement', 'Announcement', 'Product and service announcements');

-- Default High Priority Keywords (English + Serbian)
INSERT INTO keyword_mappings (keyword, category_id, priority, weight, language) VALUES
-- Automation keywords
('automatizacija', (SELECT id FROM email_categories WHERE name = 'automation_opportunity' AND user_id IS NULL LIMIT 1), 'high', 2.00, 'sr'),
('automation', (SELECT id FROM email_categories WHERE name = 'automation_opportunity' AND user_id IS NULL LIMIT 1), 'high', 2.00, 'en'),
('workflow', (SELECT id FROM email_categories WHERE name = 'automation_opportunity' AND user_id IS NULL LIMIT 1), 'high', 1.80, 'en'),
('integration', (SELECT id FROM email_categories WHERE name = 'automation_opportunity' AND user_id IS NULL LIMIT 1), 'high', 1.70, 'en'),
('digitalizacija', (SELECT id FROM email_categories WHERE name = 'automation_opportunity' AND user_id IS NULL LIMIT 1), 'high', 1.80, 'sr'),
('AI', (SELECT id FROM email_categories WHERE name = 'automation_opportunity' AND user_id IS NULL LIMIT 1), 'high', 1.90, 'en'),
('machine learning', (SELECT id FROM email_categories WHERE name = 'automation_opportunity' AND user_id IS NULL LIMIT 1), 'high', 1.80, 'en'),

-- Business inquiry keywords
('projekat', (SELECT id FROM email_categories WHERE name = 'business_inquiry' AND user_id IS NULL LIMIT 1), 'high', 1.80, 'sr'),
('project', (SELECT id FROM email_categories WHERE name = 'business_inquiry' AND user_id IS NULL LIMIT 1), 'high', 1.80, 'en'),
('partnership', (SELECT id FROM email_categories WHERE name = 'business_inquiry' AND user_id IS NULL LIMIT 1), 'high', 1.70, 'en'),
('consulting', (SELECT id FROM email_categories WHERE name = 'business_inquiry' AND user_id IS NULL LIMIT 1), 'high', 1.70, 'en'),
('B2B', (SELECT id FROM email_categories WHERE name = 'business_inquiry' AND user_id IS NULL LIMIT 1), 'high', 1.60, 'en'),
('proposal', (SELECT id FROM email_categories WHERE name = 'business_inquiry' AND user_id IS NULL LIMIT 1), 'high', 1.50, 'en'),

-- Medium priority keywords
('networking', (SELECT id FROM email_categories WHERE name = 'networking' AND user_id IS NULL LIMIT 1), 'medium', 1.20, 'en'),
('conference', (SELECT id FROM email_categories WHERE name = 'networking' AND user_id IS NULL LIMIT 1), 'medium', 1.20, 'en'),
('collaboration', (SELECT id FROM email_categories WHERE name = 'networking' AND user_id IS NULL LIMIT 1), 'medium', 1.30, 'en'),
('startup', (SELECT id FROM email_categories WHERE name = 'networking' AND user_id IS NULL LIMIT 1), 'medium', 1.10, 'en'),

-- Low priority keywords
('newsletter', (SELECT id FROM email_categories WHERE name = 'marketing' AND user_id IS NULL LIMIT 1), 'low', 0.50, 'en'),
('unsubscribe', (SELECT id FROM email_categories WHERE name = 'marketing' AND user_id IS NULL LIMIT 1), 'low', 0.30, 'en'),
('promotion', (SELECT id FROM email_categories WHERE name = 'marketing' AND user_id IS NULL LIMIT 1), 'low', 0.50, 'en'),
('marketing', (SELECT id FROM email_categories WHERE name = 'marketing' AND user_id IS NULL LIMIT 1), 'low', 0.60, 'en');

-- ═══════════════════════════════════════════════════════════════
-- Example Queries for Usage
-- ═══════════════════════════════════════════════════════════════

-- Get user goals
-- SELECT * FROM user_goals WHERE user_id = 123 AND is_active = TRUE LIMIT 1;

-- Get categories for user (including defaults)
-- SELECT * FROM email_categories 
-- WHERE (user_id IS NULL OR user_id = 123) AND is_active = TRUE
-- ORDER BY priority DESC, sort_order ASC;

-- Get keywords with categories
-- SELECT km.keyword, km.priority, km.weight, ec.name as category_name
-- FROM keyword_mappings km
-- JOIN email_categories ec ON km.category_id = ec.id
-- WHERE (km.user_id IS NULL OR km.user_id = 123) AND km.is_active = TRUE
-- ORDER BY km.priority DESC, km.weight DESC;

-- ═══════════════════════════════════════════════════════════════
-- Analytics & Reporting Tables (Optional - Future)
-- ═══════════════════════════════════════════════════════════════

-- Track AI classification accuracy for improvement
CREATE TABLE ai_classification_feedback (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    message_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    
    -- AI suggested
    ai_category_id BIGINT UNSIGNED NULL,
    ai_priority VARCHAR(20) NULL,
    ai_confidence DECIMAL(3,2) NULL,
    
    -- User corrected
    actual_category_id BIGINT UNSIGNED NULL,
    actual_priority VARCHAR(20) NULL,
    
    -- Feedback
    was_correct BOOLEAN DEFAULT FALSE,
    feedback_notes TEXT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_message_id (message_id),
    INDEX idx_user_id (user_id),
    INDEX idx_accuracy (was_correct),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ai_category_id) REFERENCES email_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (actual_category_id) REFERENCES email_categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
