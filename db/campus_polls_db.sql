CREATE DATABASE campus_polls_db;
USE campus_polls_db;

CREATE TABLE polls (
  poll_id INT AUTO_INCREMENT PRIMARY KEY,
  question VARCHAR(255) NOT NULL,
  option_a VARCHAR(100),
  option_b VARCHAR(100),
  option_c VARCHAR(100),
  option_d VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE votes (
  vote_id INT AUTO_INCREMENT PRIMARY KEY,
  poll_id INT,
  option_chosen VARCHAR(10),
  voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (poll_id) REFERENCES polls(poll_id)
);

CREATE TABLE memes (
  meme_id INT AUTO_INCREMENT PRIMARY KEY,
  caption VARCHAR(255),
  image_path VARCHAR(255),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
