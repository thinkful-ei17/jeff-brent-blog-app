-- get all stories
SELECT * FROM stories;

-- get all authors
SELECT * FROM authors;

-- get all stories with authors
SELECT * FROM stories
INNER JOIN authors ON stories.author_id = authors.id;

-- get all stories, show author if they exists otherwise null
SELECT * FROM stories
LEFT JOIN authors ON stories.author_id = authors.id;
