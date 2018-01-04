DROP TABLE IF EXISTS stories;

CREATE TABLE stories (
  id serial PRIMARY KEY,
  title text NOT NULL,
  content text,
  created timestamp DEFAULT now()
);

ALTER SEQUENCE stories_id_seq RESTART WITH 1000;

INSERT INTO stories (title, content) VALUES 
('What the government doesn''t want you to know about cats', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.'),
('The most boring article about cats you''ll ever read', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.'),
('7 things lady gaga has in common with cats', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.'),
('The most incredible article about cats you''ll ever read', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.'),
('10 ways cats can help you live to 100', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.'),
('9 reasons you can blame the recession on cats', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.'),
('10 ways marketers are making you addicted to cats', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.'),
('11 ways investing in cats can make you a millionaire', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.'),
('Why you should forget everything you learned about cats', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.');
