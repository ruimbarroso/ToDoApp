INSERT INTO users (email, password) 
VALUES ('user1@gmail.com', '$2a$10$8y1yJc8jTbxYW396lDTDhehAvZiNTM8N..ezKuqUbeNzbPAU7y.ku');

INSERT INTO groups (name, description, color, user_id) 
VALUES 
    ('Work', 'Tasks related to work', 'FF0000', 1),
    ('Personal', 'Personal tasks and reminders', '00FF00', 1),
    ('Hobbies', 'Hobby-related activities', '0000FF', 1);

INSERT INTO todos (name, is_complete, due_date, group_id) 
VALUES 
    ('Finish report', FALSE, NOW() - INTERVAL '10 days', 1),
    ('Email client', TRUE, NOW() + INTERVAL '5 days', 1),
    ('Prepare presentation', FALSE, NOW() - INTERVAL '10 days', 1),
    ('Meeting with manager', TRUE, NOW() + INTERVAL '5 days', 1),
    ('Buy groceries', FALSE, NOW() - INTERVAL '10 days', 2),
    ('Call plumber', FALSE, NOW() + INTERVAL '5 days', 2);
